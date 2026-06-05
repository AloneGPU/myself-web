import React from 'react';

interface SkeletonProps {
  count?: number;
  variant?: 'text' | 'card' | 'avatar';
  className?: string;
}

function SkeletonItem({ variant = 'card' }: { variant: 'text' | 'card' | 'avatar'; key?: React.Key }) {
  if (variant === 'avatar') {
    return <div className="skeleton w-12 h-12 rounded-full shrink-0" />;
  }
  if (variant === 'text') {
    return <div className="skeleton h-4 w-3/4 rounded" />;
  }
  // card variant
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5">
      <div className="skeleton w-full aspect-video" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </div>
  );
}

export default function Skeleton({ count = 1, variant = 'card', className = '' }: SkeletonProps) {
  return (
    <div className={`grid gap-4 ${variant === 'card' ? 'grid-cols-1 sm:grid-cols-2' : 'space-y-3'} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} variant={variant} />
      ))}
    </div>
  );
}
