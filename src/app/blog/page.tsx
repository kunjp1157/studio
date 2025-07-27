
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import type { BlogPost } from '@/lib/types';
import { getAllBlogPosts } from '@/lib/data';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching posts
    setTimeout(() => {
      const fetchedPosts = getAllBlogPosts();
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <PageTitle 
          title="Sports Arena Blog"
          description="News, tips, and insights for sports enthusiasts in Pune."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
             <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id);


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="Sports Arena Blog"
        description="News, tips, and insights for sports enthusiasts in Pune."
      />

      {posts.length === 0 ? (
        <Alert className="mt-8">
          <FileText className="h-4 w-4" />
          <AlertTitle>No Blog Posts Yet</AlertTitle>
          <AlertDescription>
            There are currently no articles. Check back soon for updates!
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {featuredPost && (
            <section className="mb-12">
              <BlogPostCard post={featuredPost} isFeatured={true} />
            </section>
          )}
          {regularPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 font-headline">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Simple skeleton for loading state
const CardSkeleton = () => (
  <div className="bg-card p-4 rounded-lg shadow-md animate-pulse">
    <div className="aspect-video bg-muted rounded mb-4"></div>
    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-full mb-1"></div>
    <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
    <div className="flex space-x-2 mb-3">
        <div className="h-5 bg-muted rounded-full w-20"></div>
        <div className="h-5 bg-muted rounded-full w-24"></div>
    </div>
    <div className="h-10 bg-muted rounded w-full mt-2"></div>
  </div>
);
