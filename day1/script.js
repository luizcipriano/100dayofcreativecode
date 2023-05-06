const lenis = new Lenis({
  duration: 1.2,
  easing:(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  oientation : 'vertical',
  gestureOrientation:'vertical',
  smoothWheel: true,
  wheelMultiplier : 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})


function raf(time){
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


gsap.registerPlugin(ScrollTrigger);

gsap.to(".panel:not(:last-child)", {
  yPercent: -105, 
  ease: "none",
  stagger: 0.5,
  scrollTrigger: {
    trigger: "#container",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true
  }
});

gsap.set(".panel", {zIndex: (i, target, targets) => targets.length - i});