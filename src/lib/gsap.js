"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { duration, gsapEase } from "./motion";

/**
 * Central GSAP entry point. Import gsap / ScrollTrigger / SplitText / useGSAP
 * from here (never directly from "gsap") so plugins are registered exactly
 * once and only in the browser.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: gsapEase.outQuart, duration: duration.slow });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
