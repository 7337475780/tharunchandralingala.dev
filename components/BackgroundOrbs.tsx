"use client";

import React from "react";

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] animate-[blob_7s_infinite]" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/20 blur-[100px] animate-[blob_7s_infinite_2s]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-primary/10 blur-[100px] animate-[blob_7s_infinite_4s]" />
      
      {/* Subtle particle effect using a CSS pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: "radial-gradient(circle at center, white 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
    </div>
  );
}
