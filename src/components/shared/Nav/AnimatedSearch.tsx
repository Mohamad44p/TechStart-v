"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="relative flex items-center"
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <motion.input
        type="text"
        placeholder="Search here..."
        className="bg-white text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-zinc-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-zinc-400"
        variants={{
          expanded: { width: "200px", padding: "8px 40px 8px 16px" },
          collapsed: { width: "40px", padding: "8px" }
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.button
        className="absolute right-2 bg-white rounded-full p-2"
        onClick={toggleSearch}
        variants={{
          expanded: { right: "4px" },
          collapsed: { right: "0px" }
        }}
        transition={{ duration: 0.3 }}
      >
        <Search className={cn('w-full h-full text-black', 
            isExpanded ? 'w-4 h-4' : 'w-full h-full'
        )} />
      </motion.button>
    </motion.div>
  );
};

export default AnimatedSearch;

