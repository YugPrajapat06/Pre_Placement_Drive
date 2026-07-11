"use client";

import { useState } from "react";
import { BackgroundCircles } from "./hero";

const COLOR_VARIANTS = {
  primary: {
    border: [
      "border-emerald-500/60",
      "border-cyan-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-emerald-500/30",
  },

  secondary: {
    border: [
      "border-violet-500/60",
      "border-fuchsia-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-violet-500/30",
  },

  tertiary: {
    border: [
      "border-orange-500/60",
      "border-yellow-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-orange-500/30",
  },

  quaternary: {
    border: [
      "border-purple-500/60",
      "border-pink-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-purple-500/30",
  },

  quinary: {
    border: [
      "border-red-500/60",
      "border-rose-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-red-500/30",
  },

  senary: {
    border: [
      "border-blue-500/60",
      "border-sky-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-blue-500/30",
  },

  septenary: {
    border: [
      "border-gray-500/60",
      "border-gray-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-gray-500/30",
  },

  octonary: {
    border: [
      "border-red-500/60",
      "border-rose-400/50",
      "border-slate-600/30",
    ],
    gradient: "from-red-500/30",
  },
};

export function DemoCircles() {
  const [currentVariant, setCurrentVariant] = useState("octonary");

  const variants = Object.keys(COLOR_VARIANTS);

  function getNextVariant() {
    const currentIndex = variants.indexOf(currentVariant);

    return variants[(currentIndex + 1) % variants.length];
  }

  return (
    <>
      <BackgroundCircles variant={currentVariant} />

      <div className="absolute right-12 top-12">
        {/* <button
          type="button"
          className="z-10 rounded-md bg-slate-950 px-4 py-1 text-sm font-medium text-white dark:bg-white dark:text-slate-950"
          onClick={() => {
            setCurrentVariant(getNextVariant());
          }}
        >
          Change Variant
        </button> */}
      </div>
    </>
  );
}

export default DemoCircles;

