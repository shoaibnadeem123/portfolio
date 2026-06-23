document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Initialize Lenis Smooth Scroll Engine
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 3. GSAP Fade/Slide Up Animations
  const sections = document.querySelectorAll(".section");

  sections.forEach((section) => {
    const revealElements = section.querySelectorAll(".reveal");

    if (revealElements.length > 0) {
      gsap.to(revealElements, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%", 
          toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }
  });

  // 4. Smooth Scrolling for Navbar Links
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Check if it's an internal hash link
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault(); 
        lenis.scrollTo(targetId, {
          offset: -100, 
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

  // 5. Accordion Logic
  const cards = document.querySelectorAll('.experience-card, .project-card, .cert-card');

  cards.forEach(card => {
    const toggle = card.querySelector('.exp-accordion-toggle, .accordion-toggle, .cert-expand-toggle');
    const header = card.querySelector('.experience-header, .project-header, .cert-header');
    const triggerElement = toggle || header;

    if (triggerElement) {
      triggerElement.addEventListener('click', (e) => {
        // Prevent triggering if user clicks the 'Verify' button inside the card
        if (e.target.closest('.cert-link')) return;

        e.stopPropagation();
        const isCurrentlyExpanded = card.classList.contains('is-expanded');

        cards.forEach(c => c.classList.remove('is-expanded'));

        if (!isCurrentlyExpanded) {
          card.classList.add('is-expanded');
          refreshScrollTrigger();
        }
      });
    }
  });

  // 6. Copy to Clipboard Functionality
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = btn.querySelector('i');
        icon.className = "fas fa-check text-emerald";
        setTimeout(() => {
          icon.className = "far fa-copy";
        }, 2000);
      });
    });
  });

  // Helper function for layout shifts
  function refreshScrollTrigger() {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);
  }
});
