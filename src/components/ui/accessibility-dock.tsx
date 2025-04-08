"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Sun, 
  Eye, 
  Pause, 
  Palette, 
  Underline,
  ScanFace,
  ListEnd,
  Accessibility,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Slider } from "./slider";
import { Switch } from "./switch";
import { Label } from "./label";
import { Separator } from "./separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
export function AccessibilityDock() {
  const [fontSize, setFontSize] = useState<number>(100);
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [contrast, setContrast] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [colorblindMode, setColorblindMode] = useState<string>("none");

  // Load saved preferences on mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Check if dark mode is already active
      if (document.documentElement.classList.contains('dark')) {
        setDarkMode(true);
      }
      
      // Check if high contrast is active
      if (document.documentElement.classList.contains('high-contrast')) {
        setContrast(true);
      }
      
      // Check if reduced motion is active
      if (document.documentElement.classList.contains('reduce-motion')) {
        setReducedMotion(true);
      }

      // Check if dyslexic font is active
      if (document.documentElement.classList.contains('dyslexic-font')) {
        setDyslexicFont(true);
      }

      // Check if focus mode is active
      if (document.documentElement.classList.contains('focus-mode')) {
        setFocusMode(true);
      }
      
      // Get font size
      const savedFontSize = parseFloat(document.documentElement.style.fontSize) || 100;
      if (savedFontSize) setFontSize(savedFontSize);
    }
  }, []);

  // Apply font size changes
  const changeFontSize = (value: number[]) => {
    setFontSize(value[0]);
    document.documentElement.style.fontSize = `${value[0]}%`;
  };

  // Apply line height changes
  const changeLineHeight = (value: number[]) => {
    setLineHeight(value[0]);
    document.documentElement.style.setProperty('--line-height-multiplier', `${value[0]}`);
    document.documentElement.classList.add('custom-line-height');
  };

  // Apply letter spacing changes
  const changeLetterSpacing = (value: number[]) => {
    setLetterSpacing(value[0]);
    document.documentElement.style.setProperty('--letter-spacing', `${value[0]}px`);
    document.documentElement.classList.add('custom-letter-spacing');
  };

  // Apply high contrast
  const toggleContrast = () => {
    setContrast(!contrast);
    document.documentElement.classList.toggle("high-contrast");
  };

  // Apply dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Apply reduced motion
  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle("reduce-motion");
    
    // Apply reduced motion preference to the system as well
    if ('matchMedia' in window) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches !== reducedMotion) {
        // This won't actually change the OS setting but can help with media queries
        document.documentElement.style.setProperty('--reduce-motion', reducedMotion ? 'reduce' : 'no-preference');
      }
    }
  };

  // Apply dyslexic friendly font
  const toggleDyslexicFont = () => {
    setDyslexicFont(!dyslexicFont);
    document.documentElement.classList.toggle("dyslexic-font");
  };

  // Apply focus mode
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    document.documentElement.classList.toggle("focus-mode");
  };

  // Apply colorblind mode
  const changeColorblindMode = (mode: string) => {
    // Remove any existing colorblind mode classes
    document.documentElement.classList.remove(
      "protanopia", 
      "deuteranopia", 
      "tritanopia", 
      "achromatopsia"
    );
    
    // Add the new mode class if it's not "none"
    if (mode !== "none") {
      document.documentElement.classList.add(mode);
    }
    
    setColorblindMode(mode);
  };

  return (
    <div className="fixed left-4 bottom-4 z-50 accessibility-dock">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-[#1C65A9] to-[#862996] hover:from-[#1C65A9]/90 hover:to-[#862996]/90"
            aria-label="Accessibility options"
          >
            <Accessibility className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" /> Accessibility Settings
            </SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="text" className="mt-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="motion">Motion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="py-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Type className="h-4 w-4" /> Text Size
                </h3>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[fontSize]}
                    min={75}
                    max={200}
                    step={5}
                    onValueChange={changeFontSize}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground block mt-1">
                  {fontSize}%
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <ListEnd className="h-4 w-4" /> Line Height
                </h3>
                <Slider
                  value={[lineHeight]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={changeLineHeight}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground block mt-1">
                  {lineHeight}x
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Underline className="h-4 w-4" /> Letter Spacing
                </h3>
                <Slider
                  value={[letterSpacing]}
                  min={0}
                  max={10}
                  step={0.5}
                  onValueChange={changeLetterSpacing}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground block mt-1">
                  {letterSpacing}px
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="dyslexic-font">Dyslexia-friendly Font</Label>
                </div>
                <Switch
                  id="dyslexic-font"
                  checked={dyslexicFont}
                  onCheckedChange={toggleDyslexicFont}
                />
              </div>
            </TabsContent>

            <TabsContent value="display" className="py-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Color & Contrast</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <Label htmlFor="high-contrast">High Contrast</Label>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={contrast}
                    onCheckedChange={toggleContrast}
                  />
                </div>

                <Separator />

                <h3 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Color Blindness Filter
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={colorblindMode === "none" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeColorblindMode("none")}
                  >
                    None
                  </Button>
                  <Button 
                    variant={colorblindMode === "protanopia" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeColorblindMode("protanopia")}
                  >
                    Protanopia
                  </Button>
                  <Button 
                    variant={colorblindMode === "deuteranopia" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeColorblindMode("deuteranopia")}
                  >
                    Deuteranopia
                  </Button>
                  <Button 
                    variant={colorblindMode === "tritanopia" ? "default" : "outline"}
                    size="sm"
                    onClick={() => changeColorblindMode("tritanopia")}
                  >
                    Tritanopia
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="motion" className="py-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4" />
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion} 
                    onCheckedChange={toggleReducedMotion}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Reduces or eliminates animations and transitions
                </p>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScanFace className="h-4 w-4" />
                    <Label htmlFor="focus-mode">Focus Mode</Label>
                  </div>
                  <Switch
                    id="focus-mode"
                    checked={focusMode}
                    onCheckedChange={toggleFocusMode}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Highlights the content you&apos;re currently reading
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
} 