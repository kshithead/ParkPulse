import React from 'react';

export const PlateBadge = ({ plateNumber, size = 'sm', className = '' }) => {
  if (!plateNumber) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1 font-bold',
    lg: 'text-base px-4 py-1.5 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-md font-mono tracking-wider shadow-sm uppercase ${
        sizeClasses[size] || sizeClasses.sm
      } ${className}`}
    >
      <span className="flex flex-col items-center justify-center text-[8px] leading-tight font-sans font-extrabold text-blue-800 pr-1 border-r border-slate-900/40">
        <span>IND</span>
      </span>
      <span className="font-bold">{plateNumber}</span>
    </div>
  );
};

