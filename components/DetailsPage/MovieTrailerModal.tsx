// components/DetailsPage/MovieTrailerModal.tsx

"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface TrailerModalProps {
  trailerKey?: string | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const TrailerModal: React.FC<TrailerModalProps> = ({ trailerKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!trailerKey) return null;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1 hover:opacity-80 mt-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="34"
                id="youtube"
              >
                <path
                  fill="#CE1312"
                  fillRule="evenodd"
                  d="m19.044 23.27-.002-13.582 12.97 6.814-12.968 6.768zM47.52 7.334s-.47-3.33-1.908-4.798C43.786.61 41.741.601 40.803.489 34.086 0 24.011 0 24.011 0h-.022S13.914 0 7.197.49c-.939.111-2.983.12-4.81 2.046C.948 4.003.48 7.334.48 7.334S0 11.247 0 15.158v3.668c0 3.912.48 7.823.48 7.823s.468 3.331 1.907 4.798c1.827 1.926 4.225 1.866 5.293 2.067C11.52 33.885 24 34 24 34s10.086-.015 16.803-.505c.938-.113 2.983-.122 4.809-2.048 1.439-1.467 1.908-4.798 1.908-4.798s.48-3.91.48-7.823v-3.668c0-3.911-.48-7.824-.48-7.824z"
                />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Watch Trailer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-video"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-white hover:opacity-80"
              >
                <X size={30} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TrailerModal;
