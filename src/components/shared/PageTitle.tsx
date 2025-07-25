
interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={`mb-8 ${className} animate-fadeInUp`}>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
