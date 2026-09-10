export interface ProductNutrition {
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
  fiber?: string;
  vitamins?: string;
  sugar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  weight: string;
  price: number;
  mrp: number;
  discount: number; // percentage e.g. 24
  stock: number;
  rating: number; // e.g. 4.8
  reviewsCount: number; // e.g. 142
  nutrition?: ProductNutrition;
  ingredients?: string;
  brand: string;
  tags: string[];
  isOrganic?: boolean;
  isBestSeller?: boolean;
  isFreshPick?: boolean;
  isTodayDeal?: boolean;
  isQuickEssential?: boolean;
  isPremium?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  pincode: string;
  deliveryNotes?: string;
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  minOrder: number;
  discountValue: number;
  discountType: 'flat' | 'percentage';
  maxDiscount?: number;
  expiresAt: string;
}

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Packed' | 'Out for Delivery' | 'Delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  time: string;
  done: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  couponCode?: string;
  address: Address;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Delivery';
  status: OrderStatus;
  estimatedDelivery: string;
  createdAt: string;
  trackingSteps: TrackingStep[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Blocked';
}
