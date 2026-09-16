// Shared prefers-reduced-motion check. Every GSAP entrance/scroll-reveal
// animation across the app is gated behind this — when true, components
// skip building the tween entirely so content renders at its natural,
// final CSS state immediately (rather than depending on an animation
// that may never run to unhide it).
function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

module.exports = { prefersReducedMotion };
