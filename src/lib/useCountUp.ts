import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, animate } from 'framer-motion';

export const useCountUp = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const controls = useAnimation();
  const initialRender = useRef(true);

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [controls, inView]);

  useEffect(() => {
    if (inView && initialRender.current) {
      initialRender.current = false;
      const animateCount = () => {
        animate(0, end, {
          duration,
          onUpdate: (latest) => {
            // Use the actual number without rounding
            setCount(latest);
          },
        });
      };
      animateCount();
    }
  }, [end, duration, inView]);

  return { count, ref, controls };
};

