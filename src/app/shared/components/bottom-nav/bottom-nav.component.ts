import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export type NavTab = 'home' | 'reports' | 'catalogue' | 'account' | 'pos';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [MatIconModule, MatRippleModule],
  template: `
    <nav class="fixed bottom-5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div class="bg-[#727339] border border-white/[0.08] rounded-[26px] px-2 py-2.5
                  flex items-center gap-2 shadow-[0_20px_40px_rgba(114,115,57,0.3)]
                  pointer-events-auto w-[90%] max-w-[440px]">

        <div matRipple [matRippleColor]="'rgba(241,225,200,0.1)'"
             class="flex-1 flex flex-col items-center gap-0.5 py-1.5 cursor-pointer rounded-xl transition-colors"
             [class.text-[#f1e1c8]]="active() === 'home'"
             [class.text-[#f1e1c8]/50]="active() !== 'home'"
             (click)="tabChange.emit('home')">
          <mat-icon class="!text-[20px]">home</mat-icon>
          <span class="text-[10px] font-bold">Home</span>
        </div>

        <div matRipple [matRippleColor]="'rgba(241,225,200,0.1)'"
             class="flex-1 flex flex-col items-center gap-0.5 py-1.5 cursor-pointer rounded-xl transition-colors"
             [class.text-[#f1e1c8]]="active() === 'reports'"
             [class.text-[#f1e1c8]/50]="active() !== 'reports'"
             (click)="tabChange.emit('reports')">
          <mat-icon class="!text-[20px]">bar_chart</mat-icon>
          <span class="text-[10px] font-bold">Reports</span>
        </div>

        <!-- Center + button -->
        <div class="flex-none flex justify-center" (click)="addInvoice.emit()">
          <div class="w-[52px] h-[52px] rounded-full flex items-center justify-center cursor-pointer
                      shadow-lg border-[4px] border-[#727339] -mt-6 transition-all duration-200
                      hover:scale-105 hover:shadow-xl active:scale-95
                      {{ active() === 'pos'
                         ? 'bg-gradient-to-br from-[#632a85] to-[#451a66] text-[#f1e1c8] shadow-[#632a85]/45'
                         : 'bg-gradient-to-br from-[#727339] to-[#555627] text-[#f1e1c8] shadow-[#727339]/45' }}">
            <mat-icon class="!text-[22px]">add</mat-icon>
          </div>
        </div>

        <div matRipple [matRippleColor]="'rgba(241,225,200,0.1)'"
             class="flex-1 flex flex-col items-center gap-0.5 py-1.5 cursor-pointer rounded-xl transition-colors"
             [class.text-[#f1e1c8]]="active() === 'catalogue'"
             [class.text-[#f1e1c8]/50]="active() !== 'catalogue'"
             (click)="tabChange.emit('catalogue')">
          <mat-icon class="!text-[20px]">inventory_2</mat-icon>
          <span class="text-[10px] font-bold">Catalogue</span>
        </div>

        <div matRipple [matRippleColor]="'rgba(241,225,200,0.1)'"
             class="flex-1 flex flex-col items-center gap-0.5 py-1.5 cursor-pointer rounded-xl transition-colors"
             [class.text-[#f1e1c8]]="active() === 'account'"
             [class.text-[#f1e1c8]/50]="active() !== 'account'"
             (click)="tabChange.emit('account')">
          <mat-icon class="!text-[20px]">person</mat-icon>
          <span class="text-[10px] font-bold">Account</span>
        </div>

      </div>
    </nav>
  `,
})
export class BottomNavComponent {
  active  = input.required<NavTab>();
  tabChange  = output<NavTab>();
  addInvoice = output<void>();
}
