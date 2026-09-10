import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`}>
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-3xl p-3 sm:p-4 flex flex-col items-center text-center group cursor-pointer border border-white/70 relative overflow-hidden"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-emerald-50 relative flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {category.name}
        </h4>
        <span className="text-[10px] text-slate-400 font-medium">
          {category.itemCount} items
        </span>
      </motion.div>
    </Link>
  );
};
