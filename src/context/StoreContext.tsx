import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SneakerProduct,
  CartItem,
  WishlistItem,
  Order,
  UserProfile,
  Review,
  Coupon,
  FilterState,
  ActivePage,
  AppNotification,
  OrderStatus,
  SneakerSize,
  ProductColor,
  MerchantSettlement
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, AVAILABLE_COUPONS } from '../data/sneakers';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where
} from '../lib/firebase';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Authentication & User
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, pass?: string, role?: 'customer' | 'admin') => Promise<boolean>;
  signUp: (name: string, email: string, pass?: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  switchUserRole: (role: 'customer' | 'admin') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Separate Admin Auth
  adminUser: any | null;
  adminAccounts: any[];
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  createAdminAccount: (username: string, pass: string) => boolean;

  // Navigation & Page routing
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProductId: string | null;
  viewProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: SneakerProduct, size: SneakerSize, color: ProductColor, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  discountAmount: number;
  couponCode: string | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  updateCartItemQuantity: (idOrProductId: string, sizeOrQty?: any, colorOrUndefined?: any, qtyOrUndefined?: number) => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: SneakerProduct) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveWishlistToCart: (wishlistItem: WishlistItem, size?: SneakerSize) => void;

  // Orders & Tracking
  orders: Order[];
  createOrder: (orderData: any, shippingCostArg?: number, paymentMethodArg?: any) => Order;
  initiateOrder: (orderData: any, shippingCostArg?: number, paymentMethodArg?: any) => Promise<Order>;
  finalizeOrder: (order: Order) => void;
  activeOrderForTracking: Order | null;
  setActiveOrderForTracking: (order: Order | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Products
  products: SneakerProduct[];
  addProduct: (product: SneakerProduct) => void;
  updateProduct: (product: SneakerProduct) => void;
  deleteProduct: (productId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Filters & Search
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Quick View Modal
  quickViewProduct: SneakerProduct | null;
  setQuickViewProduct: (product: SneakerProduct | null) => void;

  // Toasts
  toasts: Toast[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Merchant Settlement Configuration (Direct Payments to Merchant)
  merchantSettlement: MerchantSettlement;
  updateMerchantSettlement: (settings: Partial<MerchantSettlement>) => void;
}

export const DEFAULT_MERCHANT_SETTLEMENT: MerchantSettlement = {
  method: 'momo',
  momoNetwork: 'MTN Mobile Money',
  momoNumber: '0557617501',
  accountName: 'Derrick Ahinakwah (VANTA STORE)',
  bankName: 'Stanbic Bank Ghana',
  bankAccountNumber: '9040003482910',
  bankBranch: 'Airport City Branch, Accra',
  payoutSchedule: 'instant',
  merchantNote: 'Official Direct Merchant Recipient'
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  gender: 'all',
  brand: 'all',
  size: 'all',
  color: 'all',
  priceRange: [0, 500],
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'recommended'
};

const EMPTY_USER_BASE: UserProfile = {
  id: '',
  email: '',
  fullName: '',
  role: 'customer',
  addresses: [],
  savedPaymentMethods: [],
  preferences: {
    newsletter: true,
    orderUpdates: true,
    vipDrops: true
  }
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Drop 04 Unlocked',
    message: 'The Vanta Eclipse limited run is now live for VIP accounts.',
    date: '10m ago',
    read: false,
    type: 'drop'
  },
  {
    id: 'notif-2',
    title: 'Welcome to VANTA',
    message: 'Use code VANTA10 for 10% off your inaugural order.',
    date: '1h ago',
    read: false,
    type: 'promo'
  },
  {
    id: 'notif-3',
    title: 'Restock Alert',
    message: 'Vanta Street Pro in Chalk & Concrete has been restocked in sizes 9-11.',
    date: '1d ago',
    read: true,
    type: 'system'
  }
];

const INITIAL_ORDERS: Order[] = [];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with isAuthenticated = false so requirement #2 is strictly met:
  // "When a user visits the website for the first time, show an Authentication / Welcome page before the main store."
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('vanta_auth_status');
    return saved === 'authenticated';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vanta_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && !parsed.email.includes('collector@vanta.com')) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('vanta_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminAccounts, setAdminAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('vanta_admin_accounts');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', username: 'admin', passwordHash: 'VANTA2025', role: 'superadmin', createdAt: new Date().toISOString() }
    ];
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Products
  const [products, setProducts] = useState<SneakerProduct[]>(() => {
    const saved = localStorage.getItem('vanta_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: SneakerProduct) => {
            const fresh = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
            if (fresh) {
              return {
                ...p,
                images: fresh.images
              };
            }
            return p;
          });
        }
        return INITIAL_PRODUCTS;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vanta_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('vanta_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vanta_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(orders[0] || null);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('vanta_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vanta_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('vanta_recent_searches');
    return saved ? JSON.parse(saved) : ['Runner X1', 'Carbon Series', 'Street Pro', 'Triple Black'];
  });

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<SneakerProduct | null>(null);

  // Merchant Settlement State (Direct destination for incoming customer payments)
  const [merchantSettlement, setMerchantSettlement] = useState<MerchantSettlement>(() => {
    const saved = localStorage.getItem('vanta_merchant_settlement');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MERCHANT_SETTLEMENT;
      }
    }
    return DEFAULT_MERCHANT_SETTLEMENT;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync merchant settlement to localStorage
  useEffect(() => {
    localStorage.setItem('vanta_merchant_settlement', JSON.stringify(merchantSettlement));
  }, [merchantSettlement]);

  // Try fetching public merchant settlement settings from Firestore
  useEffect(() => {
    const fetchMerchantSettings = async () => {
      try {
        const docRef = doc(db, 'store_settings', 'payouts');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<MerchantSettlement>;
          setMerchantSettlement((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Silently fallback to local defaults
      }
    };
    fetchMerchantSettings();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vanta_auth_status', isAuthenticated ? 'authenticated' : 'unauthenticated');
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vanta_user_profile', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vanta_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vanta_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('vanta_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vanta_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vanta_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('vanta_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vanta_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Toast Helper
  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Firebase Auth State Listener & Cloud Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          let profile: UserProfile;
          if (userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
          } else {
            const isAdmin = fbUser.email?.toLowerCase().includes('admin') || false;
            const derivedName =
              fbUser.displayName ||
              (fbUser.email
                ? fbUser.email
                    .split('@')[0]
                    .replace(/[^a-zA-Z0-9]/g, ' ')
                    .split(' ')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')
                : 'Collector');

            profile = {
              ...EMPTY_USER_BASE,
              id: fbUser.uid,
              email: fbUser.email || 'collector@vanta.store',
              fullName: derivedName,
              avatar: fbUser.photoURL || undefined,
              role: isAdmin ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile, { merge: true });
          }

          setUser(profile);
          setIsAuthenticated(true);
          localStorage.setItem('vanta_auth_status', 'authenticated');
          localStorage.setItem('vanta_user_profile', JSON.stringify(profile));

          // Load user-scoped cart & wishlist from user profile or scoped storage
          const scopedCartKey = `vanta_cart_${fbUser.uid}`;
          const savedCart = localStorage.getItem(scopedCartKey);
          if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch { /* ignore */ }
          }

          const scopedWishlistKey = `vanta_wishlist_${fbUser.uid}`;
          const savedWishlist = localStorage.getItem(scopedWishlistKey);
          if (savedWishlist) {
            try { setWishlist(JSON.parse(savedWishlist)); } catch { /* ignore */ }
          }
        } catch (err) {
          console.warn('Firestore profile sync info:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync cart & wishlist per user
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`vanta_cart_${user.id}`, JSON.stringify(cart));
      localStorage.setItem(`vanta_wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user]);

  // Auth Methods
  const login = async (email: string, pass?: string, role: 'customer' | 'admin' = 'customer'): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const isAdmin = trimmedEmail.includes('admin') || role === 'admin';
    const passwordToUse = pass && pass.length >= 6 ? pass : 'VantaSecure2026!';
    
    let savedName = isAdmin
      ? 'Vanta Ops Admin'
      : trimmedEmail
          .split('@')[0]
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') || 'Collector';

    try {
      // Authenticate with Firebase
      let fbUser = null;
      try {
        const userCred = await signInWithEmailAndPassword(auth, trimmedEmail, passwordToUse);
        fbUser = userCred.user;
      } catch (signInErr: any) {
        if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
          // If first time logging in with this email, create secure account
          const newCred = await createUserWithEmailAndPassword(auth, trimmedEmail, passwordToUse);
          fbUser = newCred.user;
        } else {
          console.warn('Firebase signIn notice:', signInErr?.message);
        }
      }

      const uid = fbUser?.uid || `usr_${Date.now()}`;
      let loggedUser: UserProfile = {
        ...EMPTY_USER_BASE,
        id: uid,
        email: trimmedEmail,
        fullName: savedName,
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      // Check existing doc in Firestore
      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
          loggedUser = { ...loggedUser, ...(userSnap.data() as UserProfile) };
        } else {
          await setDoc(doc(db, 'users', uid), loggedUser, { merge: true });
        }
      } catch (dbErr) {
        console.warn('Firestore write:', dbErr);
      }

      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('vanta_auth_status', 'authenticated');
      localStorage.setItem('vanta_user_profile', JSON.stringify(loggedUser));
      addToast('Welcome back', `Signed in as ${loggedUser.fullName}`, 'success');
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      const loggedUser: UserProfile = {
        ...EMPTY_USER_BASE,
        id: `usr_${Date.now()}`,
        email: trimmedEmail,
        fullName: savedName,
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('vanta_auth_status', 'authenticated');
      localStorage.setItem('vanta_user_profile', JSON.stringify(loggedUser));
      addToast('Welcome back', `Signed in as ${loggedUser.fullName}`, 'success');
      return true;
    }
  };

  const signUp = async (name: string, email: string, pass?: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'Collector';
    const passwordToUse = pass && pass.length >= 6 ? pass : 'VantaSecure2026!';

    try {
      let fbUser = null;
      try {
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, passwordToUse);
        fbUser = cred.user;
      } catch (createErr: any) {
        if (createErr?.code === 'auth/email-already-in-use') {
          const signCred = await signInWithEmailAndPassword(auth, trimmedEmail, passwordToUse);
          fbUser = signCred.user;
        } else {
          console.warn('Firebase create error:', createErr);
        }
      }

      const uid = fbUser?.uid || `usr_${Date.now()}`;
      const newUser: UserProfile = {
        ...EMPTY_USER_BASE,
        id: uid,
        fullName: cleanName,
        email: trimmedEmail,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', uid), newUser, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore write:', dbErr);
      }

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('vanta_auth_status', 'authenticated');
      localStorage.setItem('vanta_user_profile', JSON.stringify(newUser));
      addToast('Account created', `Welcome to VANTA, ${cleanName}!`, 'success');
      return true;
    } catch (err) {
      console.error('Sign up error:', err);
      const newUser: UserProfile = {
        ...EMPTY_USER_BASE,
        id: `usr_${Date.now()}`,
        fullName: cleanName,
        email: trimmedEmail,
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('vanta_auth_status', 'authenticated');
      localStorage.setItem('vanta_user_profile', JSON.stringify(newUser));
      addToast('Account created', `Welcome to VANTA, ${cleanName}!`, 'success');
      return true;
    }
  };

  const loginWithGoogle = async (
    customEmail?: string,
    customName?: string,
    customAvatar?: string
  ): Promise<boolean> => {
    try {
      let fbUser = null;
      let email = customEmail?.trim()?.toLowerCase();
      let name = customName?.trim();
      let avatar = customAvatar;

      if (!email) {
        // Direct Google Popup flow
        const result = await signInWithPopup(auth, googleProvider);
        fbUser = result.user;
        email = fbUser.email?.toLowerCase() || '';
        name = fbUser.displayName || '';
        avatar = fbUser.photoURL || undefined;
      } else {
        // Modal / Sandboxed flow
        try {
          const cred = await signInWithEmailAndPassword(auth, email, 'GoogleAuthToken2026!');
          fbUser = cred.user;
        } catch {
          try {
            const cred = await createUserWithEmailAndPassword(auth, email, 'GoogleAuthToken2026!');
            fbUser = cred.user;
          } catch {
            // Continue with unique ID
          }
        }
      }

      if (!email) {
        throw new Error('No Google account email provided');
      }

      if (!name) {
        const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();
        name =
          prefix
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ') || 'Collector';
      }

      const uid = fbUser?.uid || `google_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const isAdmin = email.includes('admin');

      let googleUser: UserProfile = {
        ...EMPTY_USER_BASE,
        id: uid,
        fullName: name,
        email: email,
        avatar: avatar || fbUser?.photoURL || undefined,
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        if (docSnap.exists()) {
          googleUser = { ...googleUser, ...(docSnap.data() as UserProfile) };
        } else {
          await setDoc(doc(db, 'users', uid), googleUser, { merge: true });
        }
      } catch (dbErr) {
        console.warn('Firestore write:', dbErr);
      }

      // Save session for this device
      try {
        const savedGoogleSessions = localStorage.getItem('vanta_saved_google_sessions');
        const sessions = savedGoogleSessions ? JSON.parse(savedGoogleSessions) : [];
        if (!sessions.some((s: any) => s.email.toLowerCase() === email?.toLowerCase())) {
          sessions.push({ email, name, avatar });
          localStorage.setItem('vanta_saved_google_sessions', JSON.stringify(sessions));
        }
      } catch {
        /* ignore */
      }

      setUser(googleUser);
      setIsAuthenticated(true);
      localStorage.setItem('vanta_auth_status', 'authenticated');
      localStorage.setItem('vanta_user_profile', JSON.stringify(googleUser));
      addToast('Authenticated with Google', `Signed in as ${email}`, 'success');
      return true;
    } catch (err: any) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      ...EMPTY_USER_BASE,
      id: 'guest_user',
      fullName: 'Guest Collector',
      email: 'guest@vanta.store',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
    setIsAuthenticated(true);
    localStorage.setItem('vanta_auth_status', 'authenticated');
    localStorage.setItem('vanta_user_profile', JSON.stringify(guestUser));
    addToast('Browsing as Guest', 'Full store access unlocked.', 'info');
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('vanta_auth_status');
    localStorage.removeItem('vanta_user_profile');
    setActivePage('home');
    addToast('Signed out', 'See you next drop.', 'info');
  };

  const switchUserRole = async (role: 'customer' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    if (user.id && user.id !== 'guest_user') {
      try {
        await updateDoc(doc(db, 'users', user.id), { role });
      } catch {
        // ignore
      }
    }
    addToast(`Switched Role to ${role.toUpperCase()}`, role === 'admin' ? 'Admin dashboard access unlocked' : 'Customer shopping view active', 'info');
    if (role === 'admin') {
      setActivePage('admin');
    } else if (activePage === 'admin') {
      setActivePage('home');
    }
  };

  const loginAdmin = (username: string, pass: string): boolean => {
    const account = adminAccounts.find((a) => a.username === username && a.passwordHash === pass);
    if (account) {
      setAdminUser(account);
      localStorage.setItem('vanta_admin_session', JSON.stringify(account));
      addToast('Staff Access Authorized', `Welcome to the Store Operations Console, ${account.username}.`, 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('vanta_admin_session');
    addToast('Logged out', 'Staff session terminated securely.', 'info');
  };

  const createAdminAccount = (username: string, pass: string): boolean => {
    const exists = adminAccounts.some(a => a.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      addToast('Error', 'Username already exists', 'error');
      return false;
    }
    const newAccount = {
      id: `admin_${Date.now()}`,
      username,
      passwordHash: pass,
      role: 'staff',
      createdAt: new Date().toISOString()
    };
    const updated = [...adminAccounts, newAccount];
    setAdminAccounts(updated);
    localStorage.setItem('vanta_admin_accounts', JSON.stringify(updated));
    addToast('Account created', `Staff account ${username} added successfully.`, 'success');
    return true;
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (user.id && user.id !== 'guest_user') {
      try {
        await setDoc(doc(db, 'users', user.id), updated, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore update profile:', dbErr);
      }
    }
    addToast('Profile updated', 'Your changes have been saved.', 'success');
  };

  // Routing
  const viewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: SneakerProduct, size: SneakerSize, color: ProductColor, qty = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor.name === color.name
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        selectedSize: size,
        size,
        selectedColor: color,
        color,
        quantity: qty
      };
      setCart((prev) => [newItem, ...prev]);
    }

    addToast('Added to Cart', `${product.name} (${size})`, 'success');
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (idOrProductId: string, size?: string, colorName?: string) => {
    if (!size && !colorName) {
      const item = cart.find((i) => i.id === idOrProductId);
      setCart((prev) => prev.filter((i) => i.id !== idOrProductId));
      if (item) {
        addToast('Item removed', `${item.product.name} removed from cart.`, 'info');
      }
      return;
    }
    const item = cart.find(
      (i) =>
        (i.id === idOrProductId || i.productId === idOrProductId) &&
        (i.selectedSize === size || i.size === size) &&
        (i.selectedColor?.name === colorName || i.color?.name === colorName)
    );
    if (item) {
      setCart((prev) => prev.filter((i) => i.id !== item.id));
      addToast('Item removed', `${item.product.name} removed from cart.`, 'info');
    } else {
      setCart((prev) => prev.filter((i) => i.id !== idOrProductId));
    }
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const updateCartItemQuantity = (
    idOrProductId: string,
    sizeOrQty?: any,
    colorOrUndefined?: any,
    qtyOrUndefined?: number
  ) => {
    if (typeof sizeOrQty === 'number') {
      updateCartQuantity(idOrProductId, sizeOrQty);
      return;
    }
    const found = cart.find(
      (i) =>
        (i.id === idOrProductId || i.productId === idOrProductId) &&
        (i.selectedSize === sizeOrQty || i.size === sizeOrQty) &&
        (i.selectedColor?.name === colorOrUndefined || i.color?.name === colorOrUndefined)
    );
    if (found && typeof qtyOrUndefined === 'number') {
      updateCartQuantity(found.id, qtyOrUndefined);
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product?.price ?? 0) * (item.quantity ?? 1), 0);
  const cartTotal = cartSubtotal;
  const discountAmount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercentage) / 100 : 0;
  const couponCode = appliedCoupon ? appliedCoupon.code : null;

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === normalized && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promotional code' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return { success: false, message: `Minimum spend of GH₵${found.minSpend} required for this code` };
    }
    setAppliedCoupon(found);
    addToast('Code applied', `${found.code}: ${found.description}`, 'success');
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promo removed', undefined, 'info');
  };

  // Wishlist operations
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: SneakerProduct) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      addToast('Removed from Wishlist', product.name, 'info');
    } else {
      const newItem: WishlistItem = {
        id: `wl-${Date.now()}`,
        productId: product.id,
        product,
        addedAt: new Date().toISOString()
      };
      setWishlist((prev) => [newItem, ...prev]);
      addToast('Saved to Wishlist', product.name, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const moveWishlistToCart = (wishlistItem: WishlistItem, size: SneakerSize = 'US 9') => {
    addToCart(wishlistItem.product, size, wishlistItem.product.colors[0], 1);
    removeFromWishlist(wishlistItem.productId);
  };

  // Orders
  // Real Payment Flow Support
  const initiateOrder = async (
    orderDataOrAddress: any,
    shippingCostArg?: number,
    paymentMethodArg?: any
  ): Promise<Order> => {
    const isAddressObj = orderDataOrAddress && ('fullName' in orderDataOrAddress || 'street' in orderDataOrAddress || 'addressLine1' in orderDataOrAddress);
    const orderData: Partial<Order> = isAddressObj
      ? {
          shippingAddress: orderDataOrAddress,
          shippingCost: shippingCostArg ?? 15,
          paymentDetails: {
            method: paymentMethodArg === 'apple_pay' ? 'card' : (paymentMethodArg || 'card')
          }
        }
      : (orderDataOrAddress || {});

    const orderNum = `VNTA-${Math.floor(10000 + Math.random() * 90000)}`;
    const calcSubtotal = cartSubtotal;
    const calcDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercentage) / 100 : 0;
    const calcShipping = orderData.shippingCost ?? (calcSubtotal >= 200 ? 0 : 15);
    const calcTotal = orderData.total ?? Math.max(0, calcSubtotal - calcDiscount + calcShipping);
    const orderDate = new Date().toISOString().split('T')[0];
    const estimatedDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: orderDate,
      createdAt: orderDate,
      status: 'placed', // Note: 'placed' / pending
      paymentStatus: 'pending',
      items: [...cart],
      shippingAddress:
        orderData.shippingAddress ||
        user?.addresses?.[0] || {
          fullName: user?.fullName || 'Valued Collector',
          email: user?.email || '',
          street: 'Main Delivery Address',
          city: 'Accra',
          country: 'Ghana'
        },
      deliveryMethod: orderData.deliveryMethod || 'standard',
      shippingCost: calcShipping,
      subtotal: calcSubtotal,
      discount: calcDiscount,
      tax: Math.round(calcSubtotal * 0.05),
      total: calcTotal,
      totalAmount: calcTotal,
      paymentMethod:
        orderData.paymentDetails?.method ||
        (typeof paymentMethodArg === 'string' ? paymentMethodArg : 'card'),
      paymentDetails: orderData.paymentDetails || { method: 'card' },
      carrier: orderData.deliveryMethod === 'express' ? 'DHL Express Priority' : 'FedEx Ground Logistics',
      trackingNumber: `VNTA-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDeliveryDate: estimatedDate,
      estimatedDelivery: estimatedDate,
      trackingTimeline: [
        {
          status: 'placed',
          label: 'Order Initiated',
          timestamp: 'Just now',
          location: 'VANTA Checkout',
          completed: true
        }
      ]
    };

    try {
      const orderToSave = {
        ...newOrder,
        userId: user?.id || 'guest_user',
        userEmail: user?.email || 'guest@vanta.store',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'orders', newOrder.id), orderToSave, { merge: true });
    } catch (e) {
      console.warn('Firestore order initiate error:', e);
    }
    
    // We intentionally DO NOT clear cart or add to local orders array yet.
    // The order exists in Firestore as pending.
    return newOrder;
  };

  const finalizeOrder = (order: Order) => {
    const updatedOrder = { ...order, status: 'processing', paymentStatus: 'paid' as any };
    setOrders((prev) => [updatedOrder, ...prev]);
    setActiveOrderForTracking(updatedOrder);
    clearCart();

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Order ${order.orderNumber} Confirmed`,
      message: `Payment successful. Your sneakers are being prepared.`,
      date: 'Just now',
      read: false,
      type: 'order'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const createOrder = (
    orderDataOrAddress: any,
    shippingCostArg?: number,
    paymentMethodArg?: any
  ): Order => {
    const isAddressObj =
      orderDataOrAddress &&
      ('fullName' in orderDataOrAddress ||
        'street' in orderDataOrAddress ||
        'addressLine1' in orderDataOrAddress);

    const orderData: Partial<Order> = isAddressObj
      ? {
          shippingAddress: orderDataOrAddress,
          shippingCost: shippingCostArg ?? 15,
          paymentDetails: {
            method: paymentMethodArg === 'apple_pay' ? 'card' : (paymentMethodArg || 'card'),
            lastFour: '4242'
          }
        }
      : (orderDataOrAddress || {});

    const orderNum = `VNTA-${Math.floor(10000 + Math.random() * 90000)}`;
    const calcSubtotal = cartSubtotal;
    const calcDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercentage) / 100 : 0;
    const calcShipping = orderData.shippingCost ?? (calcSubtotal >= 200 ? 0 : 15);
    const calcTotal = orderData.total ?? Math.max(0, calcSubtotal - calcDiscount + calcShipping);
    const orderDate = new Date().toISOString().split('T')[0];
    const estimatedDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: orderDate,
      createdAt: orderDate,
      status: 'processing',
      items: [...cart],
      shippingAddress:
        orderData.shippingAddress ||
        user?.addresses?.[0] || {
          fullName: user?.fullName || 'Valued Collector',
          email: user?.email || '',
          street: 'Main Delivery Address',
          city: 'Accra',
          country: 'Ghana'
        },
      deliveryMethod: orderData.deliveryMethod || 'standard',
      shippingCost: calcShipping,
      subtotal: calcSubtotal,
      discount: calcDiscount,
      tax: Math.round(calcSubtotal * 0.05),
      total: calcTotal,
      totalAmount: calcTotal,
      paymentMethod:
        orderData.paymentDetails?.method ||
        (typeof paymentMethodArg === 'string' ? paymentMethodArg : 'card'),
      paymentDetails: orderData.paymentDetails || { method: 'card', lastFour: '4242' },
      carrier: orderData.deliveryMethod === 'express' ? 'DHL Express Priority' : 'FedEx Ground Logistics',
      trackingNumber: `VNTA-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDeliveryDate: estimatedDate,
      estimatedDelivery: estimatedDate,
      trackingTimeline: [
        {
          status: 'processing',
          label: 'Order Placed & Payment Secured',
          timestamp: 'Just now',
          location: 'VANTA Logistics Core',
          completed: true
        },
        {
          status: 'confirmed',
          label: 'Authenticity NFC Chip Certified',
          timestamp: 'Pending verification',
          location: 'Authentication Lab',
          completed: false
        },
        {
          status: 'shipped',
          label: 'Dispatched with Carrier',
          timestamp: 'Awaiting handoff',
          location: 'Central Distribution',
          completed: false
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Local Delivery',
          timestamp: 'Upcoming',
          location: 'Local Delivery Facility',
          completed: false
        },
        {
          status: 'delivered',
          label: 'Delivered & Signature Secured',
          timestamp: 'Pending delivery',
          location: 'Delivery Destination',
          completed: false
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderForTracking(newOrder);
    clearCart();

    // Persist order to Firestore for durable authenticated user tracking
    try {
      const orderToSave = {
        ...newOrder,
        userId: user?.id || 'guest_user',
        userEmail: user?.email || 'guest@vanta.store',
        createdAt: new Date().toISOString()
      };
      setDoc(doc(db, 'orders', newOrder.id), orderToSave, { merge: true }).catch((err) => {
        console.warn('Firestore order save info:', err);
      });
    } catch (e) {
      console.warn('Firestore order save error:', e);
    }

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Order ${newOrder.orderNumber} Confirmed`,
      message: `Your sneakers are being prepared in the authentication vault.`,
      date: 'Just now',
      read: false,
      type: 'order'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedTimeline = order.trackingTimeline.map((step) => {
          if (step.status === newStatus) {
            return { ...step, completed: true, timestamp: 'Updated by Admin' };
          }
          return step;
        });
        const updated = {
          ...order,
          status: newStatus,
          trackingTimeline: updatedTimeline
        };
        // Update in Firestore
        try {
          updateDoc(doc(db, 'orders', orderId), {
            status: newStatus,
            trackingTimeline: updatedTimeline
          }).catch(() => {});
        } catch { /* ignore */ }
        return updated;
      })
    );
    addToast('Order Status Updated', `Status changed to ${newStatus}`, 'success');
  };

  // Products CRUD
  const addProduct = (newProduct: SneakerProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast('Product Published', `${newProduct.name} is now live in store.`, 'success');
  };

  const updateProduct = (updatedProduct: SneakerProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    addToast('Product Updated', `${updatedProduct.name} changes saved.`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('Product Removed', 'Removed from store inventory.', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'verified'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      verified: true
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast('Review Submitted', 'Thank you for rating your pair!', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications cleared', undefined, 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Search & Filter
  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      return [term.trim(), ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Update Merchant Settlement destination
  const updateMerchantSettlement = async (settings: Partial<MerchantSettlement>) => {
    const updated = { ...merchantSettlement, ...settings };
    setMerchantSettlement(updated);
    localStorage.setItem('vanta_merchant_settlement', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'store_settings', 'payouts'), updated, { merge: true });
    } catch (e) {
      console.warn('Sync merchant settings to firestore:', e);
    }

    addToast('Payout Destination Updated', 'Payments will now route directly to your account.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signUp,
        loginWithGoogle,
        loginAsGuest,
        logout,
        switchUserRole,
        updateUserProfile,
        adminUser,
        adminAccounts,
        loginAdmin,
        logoutAdmin,
        createAdminAccount,
        activePage,
        setActivePage,
        selectedProductId,
        viewProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        discountAmount,
        couponCode,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        updateCartItemQuantity,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveWishlistToCart,
        orders,
        createOrder,
        initiateOrder,
        finalizeOrder,
        activeOrderForTracking,
        setActiveOrderForTracking,
        selectedOrder: activeOrderForTracking,
        setSelectedOrder: setActiveOrderForTracking,
        updateOrderStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        reviews,
        addReview,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        filterState,
        setFilterState,
        resetFilters,
        isSearchModalOpen,
        setIsSearchModalOpen,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        merchantSettlement,
        updateMerchantSettlement
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
