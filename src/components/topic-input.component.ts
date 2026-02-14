
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topic-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div class="text-center mb-8">
        <span class="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-2">
          {{ level() }} &bull; {{ subject() }}
        </span>
        <h2 class="text-3xl font-bold text-slate-800">Mau belajar apa hari ini?</h2>
        <p class="text-slate-500 mt-2">Tuliskan topik spesifik atau biarkan kosong untuk topik acak.</p>
      </div>

      <div class="mb-8">
        <label class="block text-sm font-medium text-slate-700 mb-2">Topik Bahasan</label>
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="topic"
            placeholder="Contoh: Pecahan, Perang Dunia II, Hukum Newton..."
            class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
            (keyup.enter)="start('learn')"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          (click)="start('learn')"
          class="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Mulai Belajar
        </button>

        <button
          (click)="start('quiz')"
          class="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-orange-100 bg-orange-50 text-orange-700 font-bold hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mulai Kuis
        </button>
      </div>
    </div>
  `
})
export class TopicInputComponent {
  level = input.required<string>();
  subject = input.required<string>();
  onStart = output<{ topic: string, mode: 'learn' | 'quiz' }>();

  topic = signal('');

  start(mode: 'learn' | 'quiz') {
    const t = this.topic().trim() || 'Topik Dasar / Pengenalan';
    this.onStart.emit({ topic: t, mode });
  }
}
