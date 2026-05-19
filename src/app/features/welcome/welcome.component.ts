import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  template: `
    <div class="relative w-screen h-screen overflow-hidden bg-[#f1e1c8]">
      <video
        class="absolute inset-0 w-full h-full object-cover"
        autoplay loop muted playsinline>
        <source src="d_a_f_ca_b_df_e_mp_.mp4" type="video/mp4">
      </video>

      <!-- bottom purple gradient fade -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#632a85]/40 to-transparent pointer-events-none"></div>

      <!-- small pill button -->
      <button
        (click)="enter()"
        class="absolute bottom-9 left-1/2 -translate-x-1/2 z-20
               flex items-center gap-2 px-6 py-3 rounded-full
               bg-[#632a85]/85 backdrop-blur text-white text-sm font-bold
               shadow-lg shadow-[#632a85]/40
               hover:bg-[#632a85] hover:-translate-y-1 hover:shadow-xl
               active:scale-95 transition-all duration-200 whitespace-nowrap border border-white/20">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        Open GulGusto Dashboard
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>
    </div>
  `,
})
export class WelcomeComponent {
  constructor(private router: Router) {}
  enter() { this.router.navigate(['/dashboard']); }
}
