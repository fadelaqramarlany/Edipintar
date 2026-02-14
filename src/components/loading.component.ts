
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full opacity-50"></div>
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>
      <h3 class="text-xl font-bold text-slate-700 mb-2">{{ message() }}</h3>
      <p class="text-slate-500 max-w-md mx-auto">AI sedang menyiapkan materi terbaik untukmu...</p>
    </div>
  `
})
export class LoadingComponent {
  message = input<string>('Sedang memuat...');
}
