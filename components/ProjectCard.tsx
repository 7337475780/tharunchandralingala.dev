import React from "react";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { cn } from "./ui/Button";

interface ProjectCardProps {
  title: string;
  description: string;
  stack: string[];
  tag?: string;
  githubUrl?: string;
  liveUrl?: string;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  stack,
  tag,
  githubUrl = "#",
  liveUrl = "#",
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6 md:p-8 flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden",
        className
      )}
    >
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-[50px] group-hover:bg-accent/20 transition-colors duration-500" />

      {tag && (
        <span className="self-start px-3 py-1 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full mb-6 uppercase border border-primary/20">
          {tag}
        </span>
      )}

      <h3 className="text-2xl font-bold font-heading text-white mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-8 flex-grow">
        {description}
      </p>

      <div className="flex flex-col gap-6 mt-auto">
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium text-white/80 bg-white/5 rounded-md border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <FaGithub size={20} />
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <ExternalLink size={20} />
            <span className="sr-only md:not-sr-only md:ml-1">Live Demo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
