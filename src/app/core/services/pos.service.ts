import { Injectable, signal, computed } from '@angular/core';

export interface Transaction {
  id: string;
  name: string;
  time: string;
  amount: string;
  amountNum: number;
}

@Injectable({ providedIn: 'root' })
export class PosService {
  // ── Core State ──────────────────────────────────────────────────────────
  readonly transactions = signal<Transaction[]>([
    { id: '1', name: 'GulGusto Special Biryani', time: '9:45 AM', amount: '₹285.00', amountNum: 285 },
    { id: '2', name: 'Butter Chicken Thali',     time: '9:12 AM', amount: '₹420.50', amountNum: 420.5 },
    { id: '3', name: 'Masala Dosa Combo',         time: '8:55 AM', amount: '₹315.25', amountNum: 315.25 },
    { id: '4', name: 'GulGusto Fresh Juice',      time: '8:30 AM', amount: '₹228.00', amountNum: 228 },
  ]);

  readonly isSalesVisible = signal(true);
  readonly isLoading      = signal(false);

  // ── Computed Metrics ────────────────────────────────────────────────────
  readonly totalSales = computed(() =>
    this.transactions().reduce((s, t) => s + t.amountNum, 0)
  );

  readonly billsCount = computed(() => this.transactions().length);

  readonly avgSale = computed(() =>
    this.billsCount() > 0 ? this.totalSales() / this.billsCount() : 0
  );

  readonly salesDisplay = computed(() =>
    this.isSalesVisible()
      ? `₹${this.totalSales().toFixed(2)}`
      : '₹ ••••••'
  );

  readonly avgDisplay = computed(() =>
    this.isSalesVisible()
      ? `₹${this.avgSale().toFixed(2)}`
      : '₹ ••••'
  );

  readonly billsDisplay = computed(() =>
    this.isSalesVisible() ? `${this.billsCount()}` : '•'
  );

  // ── Actions ─────────────────────────────────────────────────────────────
  toggleVisibility() {
    this.isSalesVisible.update(v => !v);
  }

  async addInvoice() {
    const items = [
      'GulGusto Special Biryani', 'Butter Chicken Thali',
      'Masala Dosa Combo',        'GulGusto Fresh Juice',
      'Paneer Tikka Platter',     'Mutton Rogan Josh',
      'Dal Makhani Bowl',         'GulGusto Kulfi Special',
    ];
    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 800));

    const name = items[Math.floor(Math.random() * items.length)];
    const amountNum = parseFloat((Math.random() * 300 + 150).toFixed(2));
    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() < 12 ? 'AM' : 'PM';

    this.transactions.update(list => [
      { id: Date.now().toString(), name, time: `${hh}:${mm} ${ampm}`,
        amount: `₹${amountNum.toFixed(2)}`, amountNum },
      ...list,
    ]);
    this.isLoading.set(false);
  }
}
