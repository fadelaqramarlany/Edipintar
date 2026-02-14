
import { Component, input, output, signal, computed } from '@angular/core';
import { Quiz } from '../services/gemini.service';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  template: `
    <div class="animate-fade-in max-w-3xl mx-auto">
      <!-- Quiz Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">{{ data().title }}</h2>
          <p class="text-slate-500">{{ level() }} &bull; {{ subject() }}</p>
        </div>
        <div class="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm">
          Soal {{ currentIndex() + 1 }} / {{ data().questions.length }}
        </div>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
        @if (!showResult()) {
          <div class="p-8 md:p-10 flex-grow">
            <!-- Progress Bar -->
            <div class="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div
                class="h-full bg-indigo-500 transition-all duration-500 ease-out"
                [style.width.%]="((currentIndex() + 1) / data().questions.length) * 100"
              ></div>
            </div>

            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
              {{ currentQuestion().question }}
            </h3>

            <div class="space-y-3">
              @for (option of currentQuestion().options; track $index) {
                <button
                  (click)="selectAnswer($index)"
                  [class]="getOptionClass($index)"
                  [disabled]="hasAnswered()"
                  class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative flex items-center group disabled:cursor-default"
                >
                  <span class="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold transition-colors"
                    [class.border-slate-300]="!hasAnswered()"
                    [class.text-slate-400]="!hasAnswered()"
                    [class.bg-slate-50]="!hasAnswered()"
                    [class.border-indigo-500]="selectedAnswer() === $index"
                    [class.bg-indigo-500]="selectedAnswer() === $index"
                    [class.text-white]="selectedAnswer() === $index"
                  >
                    {{ ['A', 'B', 'C', 'D'][$index] }}
                  </span>
                  <span class="text-lg font-medium">{{ option }}</span>

                  <!-- Feedback Icons -->
                  @if (hasAnswered() && $index === currentQuestion().correctIndex) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  }
                  @if (hasAnswered() && selectedAnswer() === $index && $index !== currentQuestion().correctIndex) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 ml-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                </button>
              }
            </div>

            <!-- Explanation Area -->
            @if (hasAnswered()) {
              <div class="mt-8 p-6 rounded-xl animate-fade-in" [class]="isCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                <h4 class="font-bold mb-2 flex items-center gap-2" [class]="isCorrect() ? 'text-green-800' : 'text-red-800'">
                  @if (isCorrect()) {
                    <span>🎉 Benar!</span>
                  } @else {
                    <span>🤔 Kurang Tepat</span>
                  }
                </h4>
                <p [class]="isCorrect() ? 'text-green-700' : 'text-red-700'">
                  {{ currentQuestion().explanation }}
                </p>
              </div>
            }
          </div>

          <!-- Footer Navigation -->
          <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
            @if (hasAnswered()) {
               <button (click)="nextQuestion()" class="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-md">
                {{ currentIndex() === data().questions.length - 1 ? 'Lihat Nilai' : 'Soal Selanjutnya' }}
              </button>
            }
          </div>
        } @else {
          <!-- Score Result View -->
          <div class="p-12 flex flex-col items-center justify-center text-center h-full animate-fade-in">
            <div class="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-6"
              [class]="score() > 60 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'">
              {{ score() }}%
            </div>
            <h2 class="text-3xl font-bold text-slate-800 mb-2">
              {{ score() > 80 ? 'Luar Biasa!' : (score() > 60 ? 'Bagus!' : 'Tetap Semangat!') }}
            </h2>
            <p class="text-slate-500 mb-8 max-w-md">
              Kamu berhasil menjawab {{ correctCount() }} dari {{ data().questions.length }} soal dengan benar.
            </p>

            <div class="flex gap-4">
               <button (click)="goHome.emit()" class="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Kembali ke Menu
              </button>
              <button (click)="retry.emit()" class="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                Ulangi Kuis
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class QuizViewComponent {
  data = input.required<Quiz>();
  level = input.required<string>();
  subject = input.required<string>();
  goHome = output<void>();
  retry = output<void>();

  currentIndex = signal(0);
  selectedAnswer = signal<number | null>(null);
  hasAnswered = signal(false);
  answers = signal<boolean[]>([]);
  showResult = signal(false);

  currentQuestion = computed(() => this.data().questions[this.currentIndex()]);
  
  isCorrect = computed(() => {
    return this.selectedAnswer() === this.currentQuestion().correctIndex;
  });

  correctCount = computed(() => this.answers().filter(a => a).length);
  score = computed(() => Math.round((this.correctCount() / this.data().questions.length) * 100));

  selectAnswer(index: number) {
    if (this.hasAnswered()) return;
    this.selectedAnswer.set(index);
    this.hasAnswered.set(true);
    
    // Record result
    const isCorrect = index === this.currentQuestion().correctIndex;
    const currentAnswers = this.answers();
    this.answers.set([...currentAnswers, isCorrect]);
  }

  nextQuestion() {
    if (this.currentIndex() < this.data().questions.length - 1) {
      this.currentIndex.update(v => v + 1);
      this.resetQuestionState();
    } else {
      this.showResult.set(true);
    }
  }

  resetQuestionState() {
    this.selectedAnswer.set(null);
    this.hasAnswered.set(false);
  }

  getOptionClass(index: number): string {
    const base = "border-slate-200 hover:bg-slate-50 hover:border-indigo-300";
    if (!this.hasAnswered()) {
      return this.selectedAnswer() === index 
        ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" 
        : base;
    }

    // Answered state logic
    const correctIndex = this.currentQuestion().correctIndex;
    
    if (index === correctIndex) {
      return "border-green-500 bg-green-50 ring-1 ring-green-500"; // Always highlight correct answer
    }
    
    if (this.selectedAnswer() === index && index !== correctIndex) {
      return "border-red-500 bg-red-50 ring-1 ring-red-500"; // Highlight wrong selection
    }

    return "border-slate-100 opacity-60"; // Fade others
  }
}
