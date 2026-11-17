import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export { gsap, ScrollTrigger };
