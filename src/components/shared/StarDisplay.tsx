
'use client';

import { Star as StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarDisplayProps {
  rating: number;
  maxStars?: number;
  starSize?: number;
  className?: string;
  showEmptyStars?: boolean;
}

export function StarDisplay({
  rating,
  maxStars = 5,
  starSize = 16,
  className,
  showEmptyStars = true,
}: StarDisplayProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0; // Not implementing half stars visually for now, but logic is there
  const emptyStars = showEmptyStars ? maxStars - fullStars - (halfStar ? 1 : 0) : 0;

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon
          key={`full-${i}`}
          size={starSize}
          className="text-yellow-400 fill-yellow-400"
        />
      ))}
      {/* Placeholder for half star if we implement it visually later */}
      {/* {halfStar && <StarIcon key="half" size={starSize} className="text-yellow-400 fill-yellow-200" />} */}
      {showEmptyStars && Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon
          key={`empty-${i}`}
          size={starSize}
          className="text-yellow-400" // Outline only
        />
      ))}
    </div>
  );
}
