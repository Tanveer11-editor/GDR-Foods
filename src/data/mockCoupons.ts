import { Coupon } from '../types';

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'FRESH50',
    title: 'Flat ₹50 OFF',
    description: 'Get ₹50 off on orders above ₹299 for fresh fruits & vegetables',
    minOrder: 299,
    discountValue: 50,
    discountType: 'flat',
    expiresAt: '2026-12-31',
  },
  {
    code: 'SAVE100',
    title: 'Flat ₹100 OFF',
    description: 'Save ₹100 on mega grocery orders over ₹799',
    minOrder: 799,
    discountValue: 100,
    discountType: 'flat',
    expiresAt: '2026-12-31',
  },
  {
    code: 'WELCOME20',
    title: '20% OFF First Order',
    description: 'Special 20% discount for new GDR Foods customers up to ₹150',
    minOrder: 399,
    discountValue: 20,
    discountType: 'percentage',
    maxDiscount: 150,
    expiresAt: '2026-12-31',
  },
  {
    code: 'FREEDELIVERY',
    title: 'Free Delivery',
    description: 'Waive delivery fee on any order above ₹199',
    minOrder: 199,
    discountValue: 29,
    discountType: 'flat',
    expiresAt: '2026-12-31',
  },
];
