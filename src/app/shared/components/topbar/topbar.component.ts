import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <header class="w-full bg-[#727339] px-6 md:px-10 py-3 flex items-center justify-between
                   shadow-[0_4px_20px_rgba(114,115,57,0.25)] z-30">
      <div class="flex items-center gap-3">
        <!-- Brand logo -->
        <div class="w-10 h-10 rounded-full bg-[#f1e1c8] flex items-center justify-center overflow-hidden
                    shadow-lg shadow-[#727339]/40 border-2 border-[#f1e1c8]">
          <img src="logo.jpg" alt="GulGusto Logo" class="w-full h-full object-cover">
        </div>
        <div class="flex flex-col">
          <span class="text-[#f1e1c8] font-extrabold text-base leading-tight">GulGusto Dashboard</span>
          <span class="text-[#f1e1c8]/70 text-xs font-semibold">{{ todayDate }}</span>
        </div>
      </div>

      <button mat-stroked-button (click)="goBack()"
              class="!text-[#f1e1c8] !border-[#f1e1c8]/30 !text-xs !font-bold
                     hover:!bg-[#f1e1c8]/15 !rounded-xl">
        <mat-icon class="!text-sm !mr-1">arrow_back</mat-icon>
        Back
      </button>
    </header>
  `,
})
export class TopbarComponent {
  todayDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  constructor(private router: Router) { }
  goBack() { this.router.navigate(['/']); }
}
