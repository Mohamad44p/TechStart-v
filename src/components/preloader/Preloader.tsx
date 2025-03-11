"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLoading } from "@/context/LoadingContext";
import { useLanguage } from "@/context/LanguageContext";

interface PreloaderProps {
  children: React.ReactNode;
  onLoadingComplete?: () => void;
}

export default function Preloader({ children }: PreloaderProps) {
  const { completeLoading, isFirstLoad } = useLoading();
  const { currentLang } = useLanguage();
  const isArabic = currentLang === "ar";
  const [isLoading, setIsLoading] = useState(isFirstLoad);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const counter1Ref = useRef<HTMLDivElement>(null);
  const counter2Ref = useRef<HTMLDivElement>(null);
  const counter3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const powerButtonRef = useRef<SVGSVGElement>(null);
  const powerButtonPathRef = useRef<SVGPathElement>(null);
  const counterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !loadingScreenRef.current ||
      !counter1Ref.current ||
      !counter2Ref.current ||
      !counter3Ref.current ||
      !contentRef.current ||
      !powerButtonRef.current ||
      !powerButtonPathRef.current ||
      !counterContainerRef.current
    )
      return;

    const counter3 = counter3Ref.current;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 10; j++) {
        const div = document.createElement("div");
        div.className = "num";
        div.textContent = j.toString();
        fragment.appendChild(div);
      }
    }
    const finalDiv = document.createElement("div");
    finalDiv.className = "num";
    finalDiv.textContent = "0";
    fragment.appendChild(finalDiv);
    counter3.appendChild(fragment);

    function animate(counter: HTMLElement, duration: number, delay = 0) {
      const numHeight = counter.querySelector(".num")?.clientHeight || 0;
      const totalDistance =
        (counter.querySelectorAll(".num").length - 1) * numHeight;
      return gsap.to(counter, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
      });
    }

    const tl = gsap.timeline();
    const powerButtonPath = powerButtonPathRef.current;
    const pathLength = powerButtonPath.getTotalLength();
    powerButtonPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    powerButtonPath.style.strokeDashoffset = `${pathLength}`;
    
    tl.add(animate(counter3, 3)); // Increased to 3s
    tl.add(animate(counter2Ref.current, 3.5), 0); // Increased to 3.5s
    tl.add(animate(counter1Ref.current, 1.2), 3); // Increased to 1.2s
    
    tl.to(powerButtonPath, {
      strokeDashoffset: 0,
      duration: 3.5, // Increased to 3.5s
      ease: "power2.inOut",
    }, 0);

    tl.to(
      counterContainerRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      4.2
    );

    tl.to(
      powerButtonRef.current,
      {
        scale: 15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setIsLoading(false);
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        },
      },
      4.5
    );

    tl.to(
      contentRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      4.5
    );

    tl.to(
      loadingScreenRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setIsLoading(false);
          completeLoading();
        },
      },
      4.8
    );
  }, [completeLoading]);

  if (!isFirstLoad) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={contentRef}
        className="website-content w-full min-h-screen bg-white opacity-0"
      >
        {children}
      </div>
      {isLoading && (
        <div
          ref={loadingScreenRef}
          className="loading-screen fixed top-0 left-0 w-full h-full bg-black text-white pointer-events-none overflow-hidden"
        >
          <div
            ref={counterContainerRef}
            className="counter fixed left-4 sm:left-12 bottom-4 sm:bottom-12 flex flex-row h-16 sm:h-24 text-4xl sm:text-[100px] leading-[1.02] font-normal [clip-path:polygon(0_0,100%_0,100%_100px,0_100px)]"
            style={{ direction: "ltr" }}
          >
            <div ref={counter1Ref} className="counter-1 digit relative -top-1 sm:-top-4 order-1">
              <div className="num">0</div>
              <div className="num relative -right-2 sm:-right-6">1</div>
            </div>
            <div ref={counter2Ref} className="counter-2 digit relative -top-1 sm:-top-4 order-2">
              <div className="num">0</div>
              <div className="num relative -right-1 sm:-right-2.5">1</div>
              <div className="num">2</div>
              <div className="num">3</div>
              <div className="num">4</div>
              <div className="num">5</div>
              <div className="num">6</div>
              <div className="num">7</div>
              <div className="num">8</div>
              <div className="num">9</div>
              <div className="num">0</div>
            </div>
            <div
              ref={counter3Ref}
              className="counter-3 digit relative -top-1 sm:-top-4 order-3"
            ></div>
          </div>
          <div className="power-button absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              ref={powerButtonRef}
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-24 h-24 sm:w-48 sm:h-48"
            >
              <path
                ref={powerButtonPathRef}
                d="M18.36 6.64A9 9 0 1 1 5.64 6.64"
              />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

