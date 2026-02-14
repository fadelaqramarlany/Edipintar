
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-level-selector',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      @for (level of levels; track level.id) {
        <button
          (click)="selectLevel.emit(level.id)"
          class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="level.icon" />
            </svg>
          </div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="level.icon" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{{ level.name }}</h3>
            <p class="text-slate-500 text-sm group-hover:text-slate-600">{{ level.desc }}</p>
          </div>
        </button>
      }
    </div>
  `
})
export class LevelSelectorComponent {
  selectLevel = output<string>();

  levels = [
    {
      id: 'SD',
      name: 'Sekolah Dasar (SD)',
      desc: 'Kelas 1 sampai 6. Dasar-dasar ilmu pengetahuan.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
      id: 'SMP',
      name: 'SMP / Sederajat',
      desc: 'Kelas 7 sampai 9. Pengetahuan menengah.',
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
    },
    {
      id: 'SMA',
      name: 'SMA / SMK',
      desc: 'Kelas 10 sampai 12. Pendalaman materi spesifik.',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    },
    {
      id: 'Agama',
      name: 'Pendidikan Agama',
      desc: 'Islam, Kristen, Katolik, Hindu, Buddha, Konghucu.',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    },
    {
      id: 'Umum',
      name: 'Pengetahuan Umum',
      desc: 'Sejarah dunia, Teknologi, Bahasa Asing, dll.',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
    }
  ];
}
