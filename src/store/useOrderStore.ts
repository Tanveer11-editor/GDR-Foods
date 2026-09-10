import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus, TrackingStep, CartItem, Address } from '../types';

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;

  createOrder: (data: {
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
  }) => Order;

  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  setActiveOrderId: (orderId: string | null) => void;
}

const buildTrackingSteps = (currentStatus: OrderStatus): TrackingStep[] => {
  const statuses: { status: OrderStatus; title: string; description: string; time: string }[] = [
    {
      status: 'Confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been placed & confirmed by GDR Foods',
      time: 'Just now',
    },
    {
      status: 'Preparing',
      title: 'Preparing & Picking',
      description: 'Our fresh store experts are hand-picking your items',
      time: 'In 3-5 mins',
    },
    {
      status: 'Packed',
      title: 'Quality Checked & Packed',
      description: 'Items packed in eco-friendly chilled insulated bags',
      time: 'In 10 mins',
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Fast Delivery',
      description: 'Delivery partner Rahul is en route to your location',
      time: 'In 15-20 mins',
    },
    {
      status: 'Delivered',
      title: 'Delivered Fresh',
      description: 'Handed over safely at your doorstep',
      time: 'Estimated 25 mins',
    },
  ];

  const orderIndexMap: Record<OrderStatus, number> = {
    Confirmed: 0,
    Preparing: 1,
    Packed: 2,
    'Out for Delivery': 3,
    Delivered: 4,
  };

  const currentIndex = orderIndexMap[currentStatus];

  return statuses.map((s, index) => ({
    ...s,
    done: index <= currentIndex,
    current: index === currentIndex,
  }));
};

const INITIAL_MOCK_ORDER: Order = {
  id: 'GDR-20260910-001',
  items: [
    {
      product: {
        id: 'prod-1',
        name: 'Red Delicious Organic Apples',
        category: 'Fruits',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
        description: 'Crisp, sweet, and naturally orchard-ripened apples packed with antioxidants and fiber.',
        weight: '4 pcs (approx. 500g)',
        price: 140,
        mrp: 180,
        discount: 22,
        stock: 45,
        rating: 4.9,
        reviewsCount: 328,
        brand: 'GDR Organic Orchards',
        tags: ['Organic', 'Fresh'],
      },
      quantity: 1,
    },
    {
      product: {
        id: 'prod-7',
        name: 'Farm Fresh A2 Whole Milk',
        category: 'Dairy & Eggs',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
        description: 'Pure A2 cow milk delivered in glass bottles.',
        weight: '1 Litre',
        price: 78,
        mrp: 85,
        discount: 8,
        stock: 100,
        rating: 4.95,
        reviewsCount: 840,
        brand: 'GDR Dairy Craft',
        tags: ['A2 Milk'],
      },
      quantity: 2,
    },
  ],
  subtotal: 296,
  discount: 50,
  deliveryFee: 0,
  platformFee: 5,
  totalAmount: 251,
  couponCode: 'FRESH50',
  address: {
    id: 'addr-1',
    label: 'Home',
    name: 'Mohammed Tanveer',
    phone: '+91 98765 43210',
    street: 'Emerald Residency, 4th Cross, Indiranagar',
    apartment: 'Apt 402, B Block',
    city: 'Bengaluru',
    pincode: '560038',
  },
  paymentMethod: 'UPI (Google Pay)',
  paymentStatus: 'Paid',
  status: 'Out for Delivery',
  estimatedDelivery: '18 mins (Arriving soon)',
  createdAt: new Date().toISOString(),
  trackingSteps: buildTrackingSteps('Out for Delivery'),
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [INITIAL_MOCK_ORDER],
      activeOrderId: 'GDR-20260910-001',

      createOrder: (data) => {
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(100 + Math.random() * 900);
        const orderId = `GDR-${todayStr}-${randomNum}`;

        const newOrder: Order = {
          ...data,
          id: orderId,
          status: 'Confirmed',
          estimatedDelivery: '20–30 minutes',
          createdAt: new Date().toISOString(),
          trackingSteps: buildTrackingSteps('Confirmed'),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrderId: newOrder.id,
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: newStatus,
                trackingSteps: buildTrackingSteps(newStatus),
                estimatedDelivery: newStatus === 'Delivered' ? 'Delivered successfully' : 'Arriving in 15 mins',
              };
            }
            return order;
          }),
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      setActiveOrderId: (orderId) => set({ activeOrderId: orderId }),
    }),
    {
      name: 'gdr_orders_store',
    }
  )
);
