
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-subject-selector',
  standalone: true,
  template: `
    <div class="animate-fade-in">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">Pilih Mata Pelajaran untuk <span class="text-indigo-600">{{ levelName() }}</span></h2>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        @for (subject of subjects(); track subject) {
          <button
            (click)="selectSubject.emit(subject)"
            class="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-slate-700 font-medium text-center shadow-sm"
          >
            {{ subject }}
          </button>
        }
        <!-- Custom Subject Button -->
         <button
            (click)="selectSubject.emit('Lainnya')"
            class="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-white hover:text-indigo-700 transition-all text-slate-500 font-medium text-center"
          >
            + Lainnya
          </button>
      </div>
    </div>
  `
})
export class SubjectSelectorComponent {
  level = input.required<string>();
  selectSubject = output<string>();

  levelName = computed(() => {
    switch (this.level()) {
      case 'SD': return 'Sekolah Dasar';
      case 'SMP': return 'Sekolah Menengah Pertama';
      case 'SMA': return 'Sekolah Menengah Atas';
      case 'Agama': return 'Pendidikan Agama';
      case 'Umum': return 'Pengetahuan Umum';
      default: return this.level();
    }
  });

  subjects = computed(() => {
    switch (this.level()) {
      case 'SD':
        return ['Matematika', 'Bhs Indonesia', 'IPA', 'IPS', 'PPKn', 'Bhs Inggris', 'Seni Budaya', 'PJOK'];
      case 'SMP':
        return ['Matematika', 'Bhs Indonesia', 'Bhs Inggris', 'IPA (Terpadu)', 'IPS (Terpadu)', 'PPKn', 'Informatika', 'Seni Budaya'];
      case 'SMA':
        return ['Matematika Wajib', 'Matematika Minat', 'Fisika', 'Kimia', 'Biologi', 'Ekonomi', 'Geografi', 'Sosiologi', 'Sejarah', 'Bhs Indonesia', 'Bhs Inggris'];
      case 'Agama':
        return ['Pend. Agama Islam', 'Pend. Agama Kristen', 'Pend. Agama Katolik', 'Pend. Agama Hindu', 'Pend. Agama Buddha', 'Sejarah Agama'];
      case 'Umum':
        return ['Sejarah Dunia', 'Teknologi Informasi', 'Koding & Programming', 'Bhs Mandarin', 'Bhs Jepang', 'Bhs Arab', 'Psikologi Dasar', 'Keuangan Dasar'];
      default:
        return [];
    }
  });
}
