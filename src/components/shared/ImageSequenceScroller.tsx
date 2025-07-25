
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageSequenceScrollerProps {
  imageUrls: string[];
  frameHeight: number;
  className?: string;
  containerClassName?: string;
}

export function ImageSequenceScroller({
  imageUrls,
  frameHeight,
  className,
  containerClassName
}: ImageSequenceScrollerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const totalFrames = imageUrls.length;
  const totalScrollHeight = totalFrames * frameHeight;

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const frame = Math.min(
        totalFrames - 1,
        Math.floor(scrollTop / frameHeight)
      );
      setCurrentFrame(frame);
    }
  }, [frameHeight, totalFrames]);

  useEffect(() => {
    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollDiv.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative h-[70vh] w-full overflow-hidden rounded-lg border bg-secondary/30 shadow-lg',
        containerClassName
      )}
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 h-full w-full overflow-y-scroll"
      >
        <div style={{ height: `${totalScrollHeight}px` }} className="w-full" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          ref={imageRef}
          src={imageUrls[currentFrame]}
          alt={`Frame ${currentFrame + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className={cn('object-cover', className)}
          loading="eager" // Eager load to avoid flashes
          priority={true}
        />
      </div>
    </div>
  );
}
