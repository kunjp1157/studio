
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
  isFeatured?: boolean;
}

export function BlogPostCard({ post, isFeatured = false }: BlogPostCardProps) {
  return (
    <Card className={`flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg hover:-translate-y-2 ${isFeatured ? 'md:col-span-2' : ''}`}>
      <CardContent className="p-4 md:p-6 flex-grow">
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className={`font-headline mb-2 hover:text-primary transition-colors ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {post.excerpt}
        </CardDescription>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
              <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
            <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
         {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-0">
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-300">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
