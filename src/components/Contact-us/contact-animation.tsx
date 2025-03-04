"use client"
import ContactSvg from "../../../public/Contact/Contact.json"
import dynamic from "next/dynamic"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export function ContactAnimation() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <Lottie animationData={ContactSvg} loop={true} />
    </div>
  )
}

