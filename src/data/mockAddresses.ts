import { Address } from '../types';

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Mohammed Tanveer',
    phone: '+91 98765 43210',
    street: 'Emerald Residency, 4th Cross, Indiranagar',
    apartment: 'Apt 402, B Block',
    city: 'Bengaluru',
    pincode: '560038',
    deliveryNotes: 'Leave with security at main gate',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    name: 'Mohammed Tanveer',
    phone: '+91 98765 43210',
    street: 'GDR Tech Park, EPIP Zone, Whitefield',
    apartment: 'Floor 3, Tower B',
    city: 'Bengaluru',
    pincode: '560066',
    deliveryNotes: 'Call upon arrival at reception',
    isDefault: false,
  },
];
