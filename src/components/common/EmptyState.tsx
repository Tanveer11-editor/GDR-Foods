import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, PackageX, SearchX, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'search';
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  actionLink = '/',
  onActionClick,
}) => {
  const getDefaults = () => {
    switch (type) {
      case 'cart':
        return {
          icon: <ShoppingBag className="w-10 h-10 text-emerald-600" />,
          title: title || 'Your cart is feeling a little empty.',
          description: description || 'Explore orchard fresh fruits, veggies & essentials delivered in 25 mins!',
          actionText: actionText || 'Start Shopping',
        };
      case 'wishlist':
        return {
          icon: <Heart className="w-10 h-10 text-rose-500" />,
          title: title || 'Save your favorite products here.',
          description: description || 'Tap the heart icon on any product to save it for quick future purchases.',
          actionText: actionText || 'Explore Fresh Picks',
        };
      case 'orders':
        return {
          icon: <PackageX className="w-10 h-10 text-emerald-600" />,
          title: title || 'No orders placed yet.',
          description: description || 'You haven’t placed any orders with GDR Foods yet. Place your first order now!',
          actionText: actionText || 'Explore GDR Foods',
        };
      case 'search':
        return {
          icon: <SearchX className="w-10 h-10 text-amber-500" />,
          title: title || 'No matching fresh items found',
          description: description || 'Try checking for spelling errors, broader keywords, or exploring our categories.',
          actionText: actionText || 'View All Categories',
        };
    }
  };

  const defaults = getDefaults();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center glass-panel rounded-3xl border border-white/70 max-w-md mx-auto my-6 shadow-xl">
      <div className="w-20 h-20 rounded-3xl bg-slate-100/80 flex items-center justify-center mb-4 border border-slate-200/60 shadow-inner">
        {defaults.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{defaults.title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
        {defaults.description}
      </p>

      {onActionClick ? (
        <button
          onClick={onActionClick}
          className="btn-emerald px-6 py-3 rounded-2xl flex items-center gap-2 text-sm"
        >
          <span>{defaults.actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <Link
          to={actionLink}
          className="btn-emerald px-6 py-3 rounded-2xl flex items-center gap-2 text-sm"
        >
          <span>{defaults.actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
