import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-4 flex flex-col justify-between h-80 animate-pulse border border-white/60">
      <div className="w-full h-40 bg-slate-200/70 rounded-2xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200/80 rounded-md w-3/4"></div>
        <div className="h-3 bg-slate-200/60 rounded-md w-1/2"></div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-5 bg-slate-200/80 rounded-md w-1/3"></div>
        <div className="h-9 bg-slate-200 rounded-2xl w-20"></div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-4 flex flex-col items-center justify-center h-36 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-slate-200/80 mb-2"></div>
      <div className="h-4 bg-slate-200/80 rounded-md w-2/3"></div>
    </div>
  );
};
