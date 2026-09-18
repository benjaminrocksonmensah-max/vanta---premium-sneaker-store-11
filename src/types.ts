export type Gender = 'men' | 'women' | 'unisex' | 'kids';

export type Category = 'running' | 'lifestyle' | 'basketball' | 'skate' | 'luxury' | 'limited';
export type SneakerCategory = Category;

export type PaymentMethodType = 'card' | 'momo' | 'apple_pay' | 'bank_transfer';

export type SneakerSize =
  | 'US 1Y' | 'US 1.5Y' | 'US 2Y' | 'US 2.5Y' | 'US 3Y' | 'US 3.5Y' | 'US 4Y' | 'US 4.5Y' | 'US 5Y' | 'US 5.5Y' | 'US 6Y'
  | 'US 5' | 'US 5.5' | 'US 6' | 'US 6.5' | 'US 7' | 'US 7.5' | 'US 8' | 'US 8.5' | 'US 9' | 'US 9.5' | 'US 10' | 'US 10.5' | 'US 11' | 'US 11.5' | 'US 12' | 'US 12.5' | 'US 13'
  | 'US 13.5' | 'US 14' | 'US 14.5' | 'US 15' | 'US 16';

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  authorName?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  status?: 'published' | 'pending' | 'rejected';
  verified: boolean;
  helpfulCount: number;
  photos?: string[];
}

export interface SneakerProduct {
  id: string;
  sku: string;
  name: string;
  brand: string; // e.g. "VANTA LAB", "VANTA STUDIO", "VANTA X VIBRAM"
  tagline: string;
  price: number;
  originalPrice?: number;
  category: Category;
  gender: Gender;
  collection: string;
  colors: ProductColor[];
  sizes: { size: SneakerSize; stock: number }[];
  images: string[];
  description: string;
  details: string[];
  materials: string[];
  releaseDate: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isLimited?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  dropDate?: string; // For exclusive drops
}

export interface CartItem {
  id: string;
  productId: string;
  product: SneakerProduct;
  selectedSize: SneakerSize;
  size?: SneakerSize;
  selectedColor: ProductColor;
  color?: ProductColor;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: SneakerProduct;
  addedAt: string;
}

export type OrderStatus = 'placed' | 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  street?: string;
  city: string;
  stateOrRegion: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentDetails {
  method: 'card' | 'momo' | 'bank_transfer';
  providerName?: string;
  lastFour?: string;
  momoNumber?: string;
  momoProvider?: 'MTN' | 'Telecel' | 'AirtelTigo';
  transactionReference?: string;
}

export interface MerchantSettlement {
  method: 'momo' | 'bank' | 'both';
  momoNetwork: string;
  momoNumber: string;
  accountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch?: string;
  payoutSchedule: 'instant' | 'daily' | 'weekly';
  merchantNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt?: string;
  status: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'standard' | 'express' | 'overnight';
  shippingCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  totalAmount?: number;
  paymentMethod?: string;
  paymentDetails: PaymentDetails;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: string;
  estimatedDelivery?: string;
  trackingTimeline: {
    status: OrderStatus;
    label: string;
    timestamp: string;
    location: string;
    completed: boolean;
  }[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: ShippingAddress[];
  savedPaymentMethods: {
    id: string;
    type: 'card' | 'momo';
    title: string;
    subtitle: string;
    isDefault: boolean;
  }[];
  preferences: {
    newsletter: boolean;
    orderUpdates: boolean;
    vipDrops: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'drop' | 'promo' | 'system';
  link?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
  minSpend?: number;
  active: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  gender: string;
  brand: string;
  size: string;
  color: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'recommended' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'best_selling';
}

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'order-tracking' 
  | 'account' 
  | 'wishlist' 
  | 'collections' 
  | 'new-arrivals' 
  | 'sale' 
  | 'about' 
  | 'contact' 
  | 'faq' 
  | 'admin';

export interface AdminAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'staff';
  createdAt: string;
}
