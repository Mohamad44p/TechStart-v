"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const ease = 'power4.inOut';

    const revealTransition = () => {
      return new Promise<void>((resolve) => {
        gsap.set('.block', { visibility: 'visible', scaleY: 1 });
        gsap.to('.block', {
          scaleY: 0,
          duration: 1,
          stagger: {
            each: 0.1,
            from: 'start',
            grid: 'auto',
            axis: 'x',
          },
          ease: ease,
          onComplete: () => {
            gsap.set('.block', { visibility: 'hidden' });
            resolve();
          },
        });
      });
    };

    const animateTransition = () => {
      return new Promise<void>((resolve) => {
        gsap.set('.block', { visibility: 'visible', scaleY: 0 });
        gsap.to('.block', {
          scaleY: 1,
          duration: 1,
          stagger: {
            each: 0.1,
            from: 'start',
            grid: [2, 5],
            axis: 'x',
          },
          ease: ease,
          onComplete: resolve,
        });
      });
    };

    // Initial page reveal
    revealTransition();

    // Handle page transitions
    if (isTransitioning) {
      animateTransition().then(() => {
        setIsTransitioning(false);
      });
    }
  }, [isTransitioning, pathname]);

  useEffect(() => {
    setIsTransitioning(true);
  }, [pathname]);

  return (
    <>
      {children}
      <div 
        ref={transitionRef} 
        className="fixed top-0 left-0 w-screen h-screen flex flex-col z-50 pointer-events-none"
      >
        <div className="flex flex-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={`row1-block-${i}`} 
              className="block flex-1 bg-[#746df8] origin-top will-change-transform"
            />
          ))}
        </div>
        <div className="flex flex-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={`row2-block-${i}`} 
              className="block flex-1 bg-[#746df8] origin-bottom will-change-transform"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PageTransition;

