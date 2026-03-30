"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ZoomDialogProps {
  src: string;
  zoomSrc?: string;
  alt: string;
  children: React.ReactNode;
}

export function ZoomDialog({ src, alt, children }: ZoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const rfq = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(rfq);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    
    // Defer opening to prevent accidental triggers
    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 400); 
  };

  const handleMouseLeave = () => {
    // Clear any pending open timeout
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    
    // Add a grace period before closing so the user can move the mouse to the dialog
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms grace period
  };

  const handleDialogEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  return (
    <div 
      className="relative w-full h-full group/zoom-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-9999 pointer-events-none flex items-center justify-center p-4 sm:p-8 md:p-12">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Dialog Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ 
                  type: "spring", 
                  damping: 30, 
                  stiffness: 200,
                  mass: 1.2,
                  delay: 0.1 
                }}
                className="relative pointer-events-auto bg-white p-4 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20 overflow-hidden ring-1 ring-black/5"
                onMouseEnter={handleDialogEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative overflow-hidden rounded-[2rem] bg-neutral-100 aspect-4/3 w-[850px] max-w-[92vw] max-h-[88vh]">
                  <CustomHoverZoom src={src} alt={alt} />
                  
                  {/* Overlay Info */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-bold border border-white/10 shadow-lg">
                      Live Preview
                    </div>
                  </div>
                  
                  <div className="absolute bottom-5 right-5 pointer-events-none">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-black/5 shadow-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-semibold text-neutral-700">Explore Details</span>
                    </div>
                  </div>
                </div>
                
                {/* Visual indicator that it's a "hover" dialog */}
                <div className="mt-2 px-4 py-1 text-center">
                  <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-tighter">
                    Preview will close when mouse leaves
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}



// Custom Bulletproof Zoom Component
function CustomHoverZoom({ src, alt }: { src: string; alt: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className="w-full h-full overflow-hidden cursor-crosshair relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain md:object-cover transition-transform duration-200 ease-out"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? 'scale(2.5)' : 'scale(1)'
        }}
      />
    </div>
  );
}
