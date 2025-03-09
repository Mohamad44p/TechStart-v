"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { searchContent } from "@/app/actions/search-actions";
import SearchResults from "./SearchResults";
import { useDebounce } from "@/lib/use-debounce";

const AnimatedSearch = () => {
  const { currentLang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    if (isExpanded && searchQuery) {
      // Clear search when closing
      setSearchQuery("");
      setSearchResults([]);
    }
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowResults(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setIsExpanded(false);
    setShowResults(false);
    setSearchQuery("");
  };

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchContent(debouncedSearchQuery, currentLang);
        if (response.success) {
          setSearchResults(response.results);
        } else {
          console.error("Search failed:", response.error);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery, currentLang]);

  return (
    <motion.div
      ref={searchRef}
      className="relative flex items-center"
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <motion.input
        type="text"
        placeholder={currentLang === "ar" ? "ابحث هنا..." : "Search here..."}
        className={cn(
          "bg-white text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-zinc-400 outline-none duration-300",
          "placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-zinc-400",
          currentLang === "ar" ? "text-right" : "text-left"
        )}
        dir={currentLang === "ar" ? "rtl" : "ltr"}
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => {
          if (searchQuery.length > 0) {
            setShowResults(true);
          }
        }}
        variants={{
          expanded: { width: "250px", padding: "8px 40px 8px 16px" },
          collapsed: { width: "40px", padding: "8px" }
        }}
        transition={{ duration: 0.3 }}
      />
      
      {isExpanded && searchQuery && (
        <motion.button
          className="absolute right-10 bg-transparent rounded-full p-1"
          onClick={handleClearSearch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-4 h-4 text-gray-500" />
        </motion.button>
      )}
      
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

      <SearchResults 
        results={searchResults}
        isVisible={isExpanded && showResults}
        isLoading={isLoading}
        onResultClick={handleResultClick}
      />
    </motion.div>
  );
};

export default AnimatedSearch;

