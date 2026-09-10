import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, PackageCheck, Truck, Home, ArrowRight } from 'lucide-react';
import { TrackingStep, OrderStatus } from '../../types';

interface OrderTimelineProps {
  steps: TrackingStep[];
  currentStatus: OrderStatus;
  onAdvanceStatus?: (nextStatus: OrderStatus) => void;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  steps,
  currentStatus,
  onAdvanceStatus,
}) => {
  const getIcon = (status: OrderStatus, isDone: boolean, isCurrent: boolean) => {
    const iconClass = `w-5 h-5 ${
      isCurrent
        ? 'text-white'
        : isDone
        ? 'text-emerald-600'
        : 'text-slate-400'
    }`;

    switch (status) {
      case 'Confirmed':
        return <CheckCircle2 className={iconClass} />;
      case 'Preparing':
        return <Clock className={iconClass} />;
      case 'Packed':
        return <PackageCheck className={iconClass} />;
      case 'Out for Delivery':
        return <Truck className={iconClass} />;
      case 'Delivered':
        return <Home className={iconClass} />;
    }
  };

  const statusOrder: OrderStatus[] = ['Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextStatus = currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Simulation Quick Control for Testing Live Updates */}
      {onAdvanceStatus && nextStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Test Live Status Progression:</span>
          </div>
          <button
            onClick={() => onAdvanceStatus(nextStatus)}
            className="btn-emerald px-3 py-1.5 text-xs rounded-xl flex items-center gap-1 shadow-sm"
          >
            <span>Advance to "{nextStatus}"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Steps List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, index) => {
          const isDone = step.done;
          const isCurrent = step.current;

          return (
            <div key={step.status} className="relative flex items-start gap-4 group">
              {/* Step Circle Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-100 scale-110'
                    : isDone
                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-600'
                    : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                }`}
              >
                {getIcon(step.status, isDone, isCurrent)}
              </div>

              {/* Step Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm sm:text-base font-extrabold ${
                    isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </h4>
                  <span className={`text-xs font-bold ${
                    isCurrent ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200' : 'text-slate-400'
                  }`}>
                    {step.time}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isCurrent ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
