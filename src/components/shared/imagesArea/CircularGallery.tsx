"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(Flip, CustomEase);

const itemsCount = 30;

export default function CircularGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const centerCircleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (
      !containerRef.current ||
      !galleryRef.current ||
      !loaderRef.current ||
      !centerCircleRef.current
    )
      return;

    CustomEase.create(
      "hop",
      "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1"
    );

    const container = containerRef.current;
    const gallery = galleryRef.current;
    const loader = loaderRef.current;
    const centerCircle = centerCircleRef.current;

    let isCircularLayout = false;

    const setInitialLinearLayout = () => {
      const items = gallery.querySelectorAll(".item");
      const totalItemsWidth =
        (items.length - 1) * 20 + (items[0] as HTMLElement).offsetWidth;
      const startX = (container.offsetWidth - totalItemsWidth) / 2;

      items.forEach((item, index) => {
        gsap.set(item, {
          left: `${startX + index * 20}px`,
          top: "60%",
          rotation: 0,
        });
      });

      gsap.to(items, {
        top: "50%",
        y: "-50%",
        duration: 1,
        ease: "hop",
        stagger: 0.03,
      });
    };

    const animateCounter = () => {
      const counterElement = loader.querySelector("p");
      if (!counterElement) return;

      let currentValue = 0;
      const updateInterval = 150;
      const maxDuration = 1000;
      const endValue = 100;
      const startTime = Date.now();

      const updateCounter = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < maxDuration) {
          currentValue = Math.min(
            currentValue + Math.floor(Math.random() * 30) + 5,
            endValue
          );
          counterElement.textContent = currentValue.toString();
          setTimeout(updateCounter, updateInterval);
        } else {
          counterElement.textContent = endValue.toString();
          setTimeout(() => {
            gsap.to(counterElement, {
              y: -20,
              duration: 0.5,
              ease: "power3.inOut",
              onComplete: () => {
                animateToCircularLayout();
              },
            });
          }, 150);
        }
      };

      updateCounter();
    };

    const setCircularLayout = () => {
      const items = gallery.querySelectorAll(".item");
      const numberOfItems = items.length;
      const angleIncrement = (2 * Math.PI) / numberOfItems;
      // Adjust radius based on screen size
      const radius = Math.min(container.offsetWidth, container.offsetHeight) * 
        (window.innerWidth < 768 ? 0.25 : 0.35);
      const centerX = container.offsetWidth / 2;
      const centerY = container.offsetHeight / 2;

      items.forEach((item, index) => {
        const angle = index * angleIncrement;
        const x =
          centerX +
          radius * Math.cos(angle) -
          (item as HTMLElement).offsetWidth / 2;
        const y =
          centerY +
          radius * Math.sin(angle) -
          (item as HTMLElement).offsetHeight / 2;

        gsap.set(item, {
          left: `${x}px`,
          top: `${y}px`,
          rotation: (angle * 180) / Math.PI - 90,
          y: 0,
        });
      });
    };

    const animateToCircularLayout = () => {
      const items = gallery.querySelectorAll(".item");
      const state = Flip.getState(items);

      setCircularLayout();

      Flip.from(state, {
        duration: 1,
        ease: "hop",
        stagger: -0.02,
        onEnter: (element) => gsap.to(element, { rotation: "+=360" }),
        onComplete: () => {
          gsap.to(centerCircle, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          });
        },
      });

      isCircularLayout = !isCircularLayout;
    };

    const startAnimation = () => {
      setInitialLinearLayout();

      gsap.to(loader.querySelector("p"), {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.5,
        onComplete: animateCounter,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] py-[3rem] md:py-[5rem] overflow-hidden bg-gradient-to-br from-[#dad8d4] to-[#f5f5f5]">
      <div className="absolute top-0 left-0 w-1/4 md:w-1/3 h-1/4 md:h-1/3 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/4 md:w-1/3 h-1/4 md:h-1/3 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Our Creative Journey
          </h2>
          <p className="text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto pb-[2rem] md:pb-[3rem]">
            Explore our curated collection of moments that define our story
            through stunning visuals and creative excellence.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[400px] md:h-[700px]"
        >
          <div ref={galleryRef} className="gallery">
            {[...Array(itemsCount)].map((_, index) => (
              <div
                key={index}
                className="item absolute w-[100px] h-[140px] md:w-[200px] md:h-[280px] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Image
                  src={`/assets/img${index + 1}.jpg`}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          
          <div
            ref={loaderRef}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 md:w-16 h-8 text-center overflow-hidden"
          >
            <p className="relative block transform translate-y-8 text-2xl md:text-3xl font-bold text-gray-900">
              0
            </p>
          </div>
          
          <div
            ref={centerCircleRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 md:w-80 h-60 md:h-80 rounded-full flex items-center justify-center opacity-0 scale-0 bg-gradient-to-br from-black/10 to-black/20 backdrop-blur-sm"
          >
            <button className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-lg md:text-xl font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Explore Gallery
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
