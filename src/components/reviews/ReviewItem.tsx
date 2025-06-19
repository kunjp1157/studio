
'use client';

import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { format, parseISO } from 'date-fns';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.userAvatar || `https://placehold.co/40x40.png?text=${review.userName.charAt(0)}`} alt={review.userName} />
          <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{review.userName}</p>
          <StarDisplay rating={review.rating} starSize={16} />
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <p className="text-sm text-foreground">{review.comment}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0 pb-3">
        <p>Reviewed on: {format(parseISO(review.createdAt), 'MMM d, yyyy')}</p>
      </CardFooter>
    </Card>
  );
}
