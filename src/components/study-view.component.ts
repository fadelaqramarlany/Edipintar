
import { Component, input, output } from '@angular/core';
import { StudyGuide } from '../services/gemini.service';

@Component({
  selector: 'app-study-view',
  standalone: true,
  template: `
    <div class="animate-fade-in max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-indigo-600 text-white rounded-t-2xl p-8 shadow-lg relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-10">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-48 h-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-4 text-indigo-100 text-sm font-semibold uppercase tracking-wide">
            <span>{{ level() }}</span>
            <span>&bull;</span>
            <span>{{ subject() }}</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ data().title }}</h1>
          <p class="text-indigo-100 text-lg leading-relaxed max-w-2xl">{{ data().introduction }}</p>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white p-8 md:p-12 shadow-md min-h-[400px]">
        @for (section of data().sections; track $index) {
          <div class="mb-10 last:mb-0">
            <h2 class="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">{{ $index + 1 }}</span>
              {{ section.heading }}
            </h2>
            <div class="prose prose-slate max-w-none text-slate-600 leading-7 whitespace-pre-line">
              {{ section.content }}
            </div>
          </div>
        }

        <div class="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h3 class="text-lg font-bold text-yellow-800 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            Ringkasan
          </h3>
          <p class="text-yellow-800">{{ data().summary }}</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-slate-50 p-6 rounded-b-2xl border-t border-slate-200 flex justify-between items-center">
        <button (click)="goBack.emit()" class="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
        <button (click)="takeQuiz.emit()" class="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          Lanjut Latihan Soal
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class StudyViewComponent {
  data = input.required<StudyGuide>();
  level = input.required<string>();
  subject = input.required<string>();
  goBack = output<void>();
  takeQuiz = output<void>();
}
