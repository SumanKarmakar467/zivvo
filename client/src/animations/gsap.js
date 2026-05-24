import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const splitWordsReveal = (element) => {
  if (!element) return undefined;
  const words = element.textContent.trim().split(/\s+/);
  element.innerHTML = words.map((word) => `<span class="inline-block overflow-hidden"><span class="split-word inline-block">${word}</span></span>`).join(" ");
  return gsap.fromTo(element.querySelectorAll(".split-word"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power4.out" });
};

export const revealOnScroll = (selector) =>
  gsap.utils.toArray(selector).forEach((node) => {
    gsap.fromTo(node, { opacity: 0, y: 42 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: node, start: "top 82%" }
    });
  });

export default gsap;
