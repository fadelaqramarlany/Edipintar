
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelSelectorComponent } from './components/level-selector.component';
import { SubjectSelectorComponent } from './components/subject-selector.component';
import { TopicInputComponent } from './components/topic-input.component';
import { LoadingComponent } from './components/loading.component';
import { StudyViewComponent } from './components/study-view.component';
import { QuizViewComponent } from './components/quiz-view.component';
import { GeminiService, StudyGuide, Quiz } from './services/gemini.service';

type ViewState = 'level' | 'subject' | 'topic' | 'loading' | 'study' | 'quiz';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LevelSelectorComponent,
    SubjectSelectorComponent,
    TopicInputComponent,
    LoadingComponent,
    StudyViewComponent,
    QuizViewComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#f8fafc]">
      <!-- Navbar -->
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-2 cursor-pointer" (click)="reset()">
              <div class="bg-indigo-600 text-white p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">RuangPintar AI</span>
            </div>
            
            @if (currentView() !== 'level') {
              <div class="flex items-center">
                 <button (click)="goBack()" class="text-slate-500 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </button>
              </div>
            }
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow p-4 sm:p-6 lg:p-8">
        <div class="max-w-6xl mx-auto">
          @switch (currentView()) {
            @case ('level') {
              <div class="text-center mb-10 animate-fade-in-down">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">Belajar Apa Saja Jadi Lebih Mudah</h1>
                <p class="text-lg text-slate-500 max-w-2xl mx-auto">Pilih jenjang pendidikanmu untuk memulai pengalaman belajar interaktif bertenaga AI.</p>
              </div>
              <app-level-selector (selectLevel)="onLevelSelected($event)" />
            }
            @case ('subject') {
              <app-subject-selector 
                [level]="selectedLevel()" 
                (selectSubject)="onSubjectSelected($event)" 
              />
            }
            @case ('topic') {
              <app-topic-input 
                [level]="selectedLevel()" 
                [subject]="selectedSubject()"
                (onStart)="onStartTopic($event)"
              />
            }
            @case ('loading') {
              <app-loading [message]="loadingMessage()" />
            }
            @case ('study') {
              @if (studyData()) {
                <app-study-view 
                  [data]="studyData()!"
                  [level]="selectedLevel()"
                  [subject]="selectedSubject()"
                  (goBack)="setView('topic')"
                  (takeQuiz)="startQuizFromStudy()"
                />
              }
            }
            @case ('quiz') {
              @if (quizData()) {
                <app-quiz-view 
                  [data]="quizData()!"
                  [level]="selectedLevel()"
                  [subject]="selectedSubject()"
                  (goHome)="reset()"
                  (retry)="retryQuiz()"
                />
              }
            }
          }
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 mt-auto py-8">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <p class="text-slate-400 text-sm">
            &copy; 2024 RuangPintar AI. Ditenagai oleh Google Gemini.
          </p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  gemini = inject(GeminiService);

  // State
  currentView = signal<ViewState>('level');
  selectedLevel = signal<string>('');
  selectedSubject = signal<string>('');
  selectedTopic = signal<string>('');
  
  loadingMessage = signal<string>('');
  
  // Data
  studyData = signal<StudyGuide | null>(null);
  quizData = signal<Quiz | null>(null);

  // Navigation Logic
  onLevelSelected(level: string) {
    this.selectedLevel.set(level);
    this.currentView.set('subject');
  }

  onSubjectSelected(subject: string) {
    this.selectedSubject.set(subject);
    this.currentView.set('topic');
  }

  async onStartTopic(evt: { topic: string, mode: 'learn' | 'quiz' }) {
    this.selectedTopic.set(evt.topic);
    
    if (evt.mode === 'learn') {
      await this.loadStudyMaterial();
    } else {
      await this.loadQuiz();
    }
  }

  async loadStudyMaterial() {
    this.loadingMessage.set('Menyiapkan materi belajar...');
    this.currentView.set('loading');
    
    try {
      const data = await this.gemini.generateStudyMaterial(
        this.selectedLevel(), 
        this.selectedSubject(), 
        this.selectedTopic()
      );
      this.studyData.set(data);
      this.currentView.set('study');
    } catch (err) {
      console.error(err);
      alert('Maaf, terjadi kesalahan saat membuat materi. Silakan coba lagi.');
      this.currentView.set('topic');
    }
  }

  async loadQuiz() {
    this.loadingMessage.set('Menyiapkan soal kuis...');
    this.currentView.set('loading');

    try {
      const data = await this.gemini.generateQuiz(
        this.selectedLevel(),
        this.selectedSubject(),
        this.selectedTopic()
      );
      this.quizData.set(data);
      this.currentView.set('quiz');
    } catch (err) {
      console.error(err);
      alert('Maaf, terjadi kesalahan saat membuat kuis. Silakan coba lagi.');
      this.currentView.set('topic');
    }
  }

  startQuizFromStudy() {
    this.loadQuiz();
  }

  async retryQuiz() {
    // Optionally regenerate new quiz or just reset component state
    // For now, let's regenerate to make it interesting
    await this.loadQuiz();
  }

  goBack() {
    switch (this.currentView()) {
      case 'subject': this.currentView.set('level'); break;
      case 'topic': this.currentView.set('subject'); break;
      case 'study': this.currentView.set('topic'); break;
      case 'quiz': this.currentView.set('topic'); break;
      default: this.currentView.set('level');
    }
  }

  setView(view: ViewState) {
    this.currentView.set(view);
  }

  reset() {
    this.currentView.set('level');
    this.selectedLevel.set('');
    this.selectedSubject.set('');
    this.studyData.set(null);
    this.quizData.set(null);
  }
}
