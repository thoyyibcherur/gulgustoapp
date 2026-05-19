import { Component, inject, signal, computed } from '@angular/core';
import { PosService } from '../../core/services/pos.service';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { BottomNavComponent, NavTab } from '../../shared/components/bottom-nav/bottom-nav.component';
import { ReportsComponent } from '../reports/reports.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TopbarComponent, BottomNavComponent, ReportsComponent,
    MatIconModule, MatProgressSpinnerModule, MatRippleModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  pos = inject(PosService);
  activeTab = signal<NavTab>('home');

  // Catalogue State
  catalogueSearchQuery = signal<string>('');
  activeCategory = signal<string>('All');
  activeDraftTab = signal<number>(1);
  isPOSMode = signal<boolean>(true);
  categories = signal<string[]>(['All', 'Base', 'Combo', 'Middle', 'No']);

  // Product Editor Modal State
  isProductModalOpen = signal<boolean>(false);
  editingProduct = signal<any | null>(null);
  modalProductName = signal<string>('');
  modalProductCategory = signal<string>('Middle');
  modalProductPrice = signal<number>(0);
  modalProductQuantity = signal<number>(100);
  modalProductUnit = signal<string>('Pieces');
  modalProductImage = signal<string | null>(null);
  
  // Cart state
  cart = signal<{ product: any, quantity: number }[]>([]);

  products = signal([
    { name: 'Banana Makhan', price: 149.00, unit: '100 Pcs', category: 'Middle', isFavorite: true },
    { name: 'Mango Makhan', price: 189.00, unit: '100 Pcs', category: 'Middle', isFavorite: false },
    { name: 'Shahi Makhan', price: 159.00, unit: '100 Pcs', category: 'Middle', isFavorite: false },
    { name: 'Gulab Jamun', price: 40.00, unit: '100 Pcs', category: 'No', isFavorite: false },
    { name: 'Iced Jamun', price: 79.00, unit: '100 Pcs', category: 'No', isFavorite: false },
    { name: 'Iced Jamun Nuts', price: 129.00, unit: '100 Pcs', category: 'Base', isFavorite: false },
    { name: 'Mango Gulkand', price: 139.00, unit: '100 Pcs', category: 'Combo', isFavorite: false }
  ]);

  filteredProducts = computed(() => {
    let list = this.products();
    
    // Filter by Category
    const cat = this.activeCategory();
    if (cat === 'Favorites') {
      list = list.filter(p => p.isFavorite);
    } else if (cat !== 'All') {
      list = list.filter(p => p.category === cat);
    }

    // Filter by Search Query
    const query = this.catalogueSearchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.price.toString().includes(query)
      );
    }

    return list;
  });

  // Checkout View State
  isCheckoutActive = signal<boolean>(false);
  checkoutOrderType = signal<'Sale' | 'Dine-In' | 'Takeaway'>('Sale');
  checkoutCustomerName = signal<string>('');
  checkoutCustomerPhone = signal<string>('');
  
  // Payment states
  paymentMode = signal<'single' | 'split'>('single');
  selectedPaymentMethods = signal<string[]>(['Cash']);
  splitAmounts = signal<{[key: string]: string}>({});
  checkoutNote = signal<string>('Thank you. Visit Again!');

  // Bill Settings State
  isBillSettingsActive = signal<boolean>(false);
  logoUrl = signal<string | null>(null);
  useDefaultPhone = signal<boolean>(true);
  customPhoneNumber = signal<string>('9446731741');
  sectionsEnabledCount = signal<number>(19);
  
  serviceChargeEnabled = signal<boolean>(false);
  serviceChargeValue = signal<number>(0.00);
  deliveryChargeEnabled = signal<boolean>(false);
  deliveryChargeValue = signal<number>(0.00);
  packagingChargeEnabled = signal<boolean>(false);
  packagingChargeValue = signal<number>(0.00);

  upiId = signal<string>('merchant@upi');
  instagramUrl = signal<string>('https://instagram.com/yourshop');

  // Discount state
  isDiscountActive = signal<boolean>(false);
  discountType = signal<'amount' | 'percentage'>('amount');
  discountValue = signal<number>(0.00);

  // Cart calculations
  cartTotalCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  cartTotalPrice = computed(() => {
    return this.cart().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  grandTotalPrice = computed(() => {
    const sub = this.cartTotalPrice();
    if (!this.isDiscountActive()) return sub;
    
    if (this.discountType() === 'amount') {
      return Math.max(0, sub - this.discountValue());
    } else {
      return Math.max(0, sub - (sub * this.discountValue() / 100));
    }
  });

  getProductCartQuantity(productName: string): number {
    const item = this.cart().find(c => c.product.name === productName);
    return item ? item.quantity : 0;
  }

  addProductToCart(product: any) {
    this.cart.update(current => {
      const idx = current.findIndex(c => c.product.name === product.name);
      if (idx > -1) {
        const copy = [...current];
        copy[idx].quantity += 1;
        return copy;
      } else {
        return [...current, { product, quantity: 1 }];
      }
    });
  }

  decrementProductQuantity(product: any) {
    this.cart.update(current => {
      const idx = current.findIndex(c => c.product.name === product.name);
      if (idx > -1) {
        const copy = [...current];
        if (copy[idx].quantity <= 1) {
          copy.splice(idx, 1);
        } else {
          copy[idx].quantity -= 1;
        }
        return copy;
      }
      return current;
    });
  }

  updateProductQuantity(product: any, qtyStr: string) {
    const qty = parseFloat(qtyStr) || 0;
    this.cart.update(current => {
      const idx = current.findIndex(c => c.product.name === product.name);
      if (idx > -1) {
        const copy = [...current];
        if (qty <= 0) {
          copy.splice(idx, 1);
        } else {
          copy[idx].quantity = qty;
        }
        return copy;
      } else if (qty > 0) {
        return [...current, { product, quantity: qty }];
      }
      return current;
    });
  }

  clearCart() {
    this.cart.set([]);
  }

  togglePaymentMethod(method: string) {
    if (this.paymentMode() === 'single') {
      this.selectedPaymentMethods.set([method]);
    } else {
      this.selectedPaymentMethods.update(current => {
        if (current.includes(method)) {
          if (current.length > 1) {
            return current.filter(m => m !== method);
          }
          return current;
        } else {
          return [...current, method];
        }
      });
    }
  }

  getSplitAmountValue(method: string): string {
    if (this.paymentMode() === 'single') {
      return this.grandTotalPrice().toFixed(2);
    }
    // In split mode, check if there is a manual amount, otherwise divide equally
    const val = this.splitAmounts()[method];
    if (val !== undefined) return val;
    
    const count = this.selectedPaymentMethods().length;
    if (count === 0) return '0.00';
    return (this.grandTotalPrice() / count).toFixed(2);
  }

  updateSplitAmount(method: string, val: string) {
    this.splitAmounts.update(current => ({
      ...current,
      [method]: val
    }));
  }

  switchTab(tab: NavTab) { 
    this.activeTab.set(tab); 
    this.isCheckoutActive.set(false);
    if (tab === 'catalogue') {
      this.isPOSMode.set(false);
    }
  }

  addInvoice() {
    this.activeTab.set('catalogue');
    this.isCheckoutActive.set(false);
    this.isPOSMode.set(true);
  }

  printKOT() {
    alert('Printing Kitchen Order Ticket (KOT)...');
  }

  // Product Manager Methods
  openAddProductModal() {
    this.editingProduct.set(null);
    this.modalProductName.set('');
    this.modalProductCategory.set('Middle');
    this.modalProductPrice.set(0);
    this.modalProductQuantity.set(100);
    this.modalProductUnit.set('Pieces');
    this.modalProductImage.set(null);
    this.isProductModalOpen.set(true);
  }

  openEditProductModal(product: any) {
    this.editingProduct.set(product);
    this.modalProductName.set(product.name);
    this.modalProductCategory.set(product.category);
    this.modalProductPrice.set(product.price);
    
    // Parse quantity and unit
    const qty = parseFloat(product.unit);
    this.modalProductQuantity.set(isNaN(qty) ? 100 : qty);
    
    const unitPart = product.unit.replace(/^[0-9.\s]+/, '');
    this.modalProductUnit.set(unitPart || 'Pieces');
    this.modalProductImage.set(null);
    this.isProductModalOpen.set(true);
  }

  closeProductModal() {
    this.isProductModalOpen.set(false);
  }

  addNewCategory() {
    const name = prompt('Enter new category name:');
    if (name && name.trim()) {
      const cleanName = name.trim();
      this.categories.update(current => {
        if (!current.includes(cleanName)) {
          return [...current, cleanName];
        }
        return current;
      });
      this.modalProductCategory.set(cleanName);
    }
  }

  saveProduct() {
    if (!this.modalProductName().trim()) {
      alert('Product Name is required.');
      return;
    }

    const unitStr = `${this.modalProductQuantity()} ${this.modalProductUnit()}`;
    const nameStr = this.modalProductName().trim();

    if (this.editingProduct()) {
      // Update
      const oldName = this.editingProduct().name;
      this.products.update(list => list.map(p => p.name === oldName ? {
        name: nameStr,
        price: this.modalProductPrice(),
        category: this.modalProductCategory(),
        unit: unitStr,
        isFavorite: p.isFavorite
      } : p));
      
      // Update item in cart if present
      this.cart.update(current => current.map(item => item.product.name === oldName ? {
        ...item,
        product: {
          ...item.product,
          name: nameStr,
          price: this.modalProductPrice(),
          category: this.modalProductCategory(),
          unit: unitStr
        }
      } : item));
    } else {
      // Create
      this.products.update(list => [
        {
          name: nameStr,
          price: this.modalProductPrice(),
          category: this.modalProductCategory(),
          unit: unitStr,
          isFavorite: false
        },
        ...list
      ]);
    }

    this.closeProductModal();
  }

  deleteProduct() {
    if (!this.editingProduct()) return;
    if (confirm('Are you sure you want to delete this product?')) {
      const oldName = this.editingProduct().name;
      this.products.update(list => list.filter(p => p.name !== oldName));
      // Remove from cart if present
      this.cart.update(current => current.filter(item => item.product.name !== oldName));
      this.closeProductModal();
    }
  }

  saveBill() {
    // Add current cart as a mock transaction
    const total = this.grandTotalPrice();
    if (total === 0) return;

    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() < 12 ? 'AM' : 'PM';

    this.pos.transactions.update(list => [
      {
        id: Date.now().toString(),
        name: this.cart().map(c => `${c.product.name} x${c.quantity}`).join(', '),
        time: `${hh}:${mm} ${ampm}`,
        amount: `₹${total.toFixed(2)}`,
        amountNum: total
      },
      ...list
    ]);

    this.clearCart();
    this.isCheckoutActive.set(false);
    this.activeTab.set('home');
  }
}
