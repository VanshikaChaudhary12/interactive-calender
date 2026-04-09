import React from 'react';
import { motion } from 'framer-motion';
import { formatMonthYear } from '@/lib/calendarUtils';
import { HERO_IMAGES } from '@/lib/calendarUtils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  currentDate: Date;
  heroImageIndex: number;
  onImageChange: (index: number) => void;
}

export function HeroSection({ currentDate, heroImageIndex, onImageChange }: HeroSectionProps) {
  const handlePrevImage = () => {
    onImageChange((heroImageIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNextImage = () => {
    onImageChange((heroImageIndex + 1) % HERO_IMAGES.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg border border-border group"
    >
      {/* Background image */}
      <motion.img
        key={heroImageIndex}
        src={HERO_IMAGES[heroImageIndex]}
        alt="Calendar hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Month/Year display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-6 text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-geist">{formatMonthYear(currentDate)}</h2>
        <p className="text-sm text-white/80 mt-1">Plan your days ahead</p>
      </motion.div>

      {/* Image navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePrevImage}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleNextImage}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onImageChange(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === heroImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default HeroSection;
