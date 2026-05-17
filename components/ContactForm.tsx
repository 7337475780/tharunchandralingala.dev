"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/Button";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form status after a delay
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto relative z-10">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-muted-foreground ml-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          placeholder="John Doe"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          placeholder="john@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-muted-foreground ml-1">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
          placeholder="How can I help you?"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || isSubmitted}
        className="mt-2 w-full flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <span className="animate-pulse">Sending...</span>
        ) : isSubmitted ? (
          <span className="text-green-400">Message Sent!</span>
        ) : (
          <>
            Send Message
            <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
