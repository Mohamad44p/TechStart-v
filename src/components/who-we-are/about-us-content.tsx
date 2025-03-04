"use client"

import { motion } from "framer-motion"
import OurTeam from "../OurTeam/OurTeam"
import FoucesArea from "../shared/Hero/FoucesArea"
import { AboutUsData } from "@/app/actions/pages/about-us-actions"
import { FocusareaData } from "@/app/actions/pages/focusareas-actions"
import { TeamMemberData } from "@/app/actions/pages/team-actions"
import AboutHero from "./about-hero"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.3,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

interface AboutUsContentProps {
  aboutUsData: AboutUsData
  focusareasData: FocusareaData[]
  teamMembersData: TeamMemberData[]
}

export default function AboutUsContent({ aboutUsData, focusareasData, teamMembersData }: AboutUsContentProps) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={sectionVariants}>
        <AboutHero aboutUsData={aboutUsData} />
      </motion.section>
      <motion.section variants={sectionVariants}>
        <FoucesArea focusareasData={focusareasData} />
      </motion.section>
      <motion.section variants={sectionVariants}>
        <OurTeam teamMembersData={teamMembersData} />
      </motion.section>
    </motion.div>
  )
}
