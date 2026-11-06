import React from 'react';

export const Badge = ({ variant = 'default', children, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

  const variantClasses = {
    available: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-600/10',
    occupied: 'bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-600/10',
    reserved: 'bg-purple-50 text-purple-700 border border-purple-200 ring-1 ring-purple-600/10',
    maintenance: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-600/10',
    
    // Violation statuses
    pending: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-600/10',
    investigating: 'bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-600/10',
    warning_issued: 'bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-600/10',
    fine_issued: 'bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-600/10',
    resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-600/10',
    dismissed: 'bg-slate-100 text-slate-700 border border-slate-200',

    // Role / System badges
    user: 'bg-slate-100 text-slate-700 border border-slate-200',
    admin: 'bg-indigo-50 text-indigo-700 border border-indigo-200 ring-1 ring-indigo-600/10',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-600/10',
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        sizeClasses[size] || sizeClasses.sm
      } ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === 'available' || variant === 'resolved'
            ? 'bg-emerald-500 animate-pulse'
            : variant === 'occupied' || variant === 'warning_issued' || variant === 'fine_issued'
            ? 'bg-rose-500'
            : variant === 'pending' || variant === 'maintenance'
            ? 'bg-amber-500'
            : variant === 'investigating' || variant === 'admin'
            ? 'bg-indigo-500'
            : 'bg-slate-400'
        }`}
      />
      {children}
    </span>
  );
};
