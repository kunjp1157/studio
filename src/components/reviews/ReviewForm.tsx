
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarDisplay } from '@/components/shared/StarDisplay';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ReviewFormProps {
  facilityName: string;
  bookingId: string;
  onSubmit: (rating: number, comment: string, bookingId: string) => Promise<void>;
  onCancel: () => void;
}

export function ReviewForm({ facilityName, bookingId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      // Could show a toast here too
      alert("Please select a star rating.");
      return;
    }
    setIsLoading(true);
    await onSubmit(rating, comment, bookingId);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Your Rating for {facilityName}
        </Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                size={28}
                className={cn(
                  'cursor-pointer transition-colors',
                  (hoverRating >= star || rating >= star)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
        </div>
         {rating > 0 && <p className="text-xs text-muted-foreground mt-1">You selected {rating} star{rating !==1 ? 's' : ''}.</p>}
      </div>

      <div>
        <Label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Your Review
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Share your experience at ${facilityName}... (Optional)`}
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || rating === 0}>
          {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : null}
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
