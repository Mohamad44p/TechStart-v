import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

export function RainbowButton({
  children,
  className,
  href,
  ...props
}: RainbowButtonProps) {
  const buttonClasses = cn(
    "group relative inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-[#2357A2] px-8 py-2 font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[#2357A2] before:[filter:blur(calc(0.8*1rem))]",
    "hover:bg-[#2357A2]/90",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
}
