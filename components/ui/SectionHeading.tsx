import React from "react";
import { cn } from "./Button";

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center mb-16", className)}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-center">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground text-lg text-center max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
    </div>
  );
}
