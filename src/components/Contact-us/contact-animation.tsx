"use client"
import Image from "next/image"

export function ContactAnimation() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <Image 
        src="/Contact/ContactUs.png" 
        alt="Contact Us" 
        width={300} 
        height={300} 
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  )
}

