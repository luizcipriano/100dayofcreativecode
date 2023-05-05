const lenis = new Lenis({
  duration: 1.2,
  easing:(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  oientation : 'vertical',
  gestureOrientation:'vertical',
  smoothWheel: true,
  wheelMultiplier : 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: true,
})


function raf(time){
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray(".section");

sections.forEach(section =>{
  gsap.to(section, {
    yPercent: -100,
    ease:'none',
    scrollTrigger: {
      trigger: section,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    }
  })
})
