
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { getBlogPostBySlug } from '@/lib/data';
import { PageTitle } from '@/components/shared/PageTitle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle, ArrowLeft, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPostBySlug(slug);
      setTimeout(() => { // Simulate fetch delay
        setPost(foundPost || null);
      }, 300);
    }
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!post) {
    notFound(); // This will render the not-found.tsx file if it exists, or a default Next.js 404 page
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
      <Link href="/blog" className="mb-8 inline-block">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <PageTitle title={post.title} className="mb-4" />
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              <span>Published on {format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </header>
        
        {/* In a real app, use a Markdown renderer or dangerouslySetInnerHTML for rich text */}
        <Card className="prose prose-lg max-w-none dark:prose-invert shadow-none border-none bg-transparent p-0">
            <CardContent className="p-0">
                 <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-foreground space-y-6" />
            </CardContent>
        </Card>

      </article>
    </div>
  );
}
