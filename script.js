/**
 * @license
 * Rotating Content Slider - GSAP Animation & Interaction Engine
 * Standalone Vanilla JavaScript implementation
 */

(function () {
  'use strict';

  // --- Resilient GSAP Loader & Fallback ---
  function getGSAP() {
    if (typeof window !== 'undefined' && window.gsap) return window.gsap;
    if (typeof gsap !== 'undefined') return gsap;
    return null;
  }

  function createFallbackGSAP() {
    return {
      to: function (target, vars) {
        var els = typeof target === 'string' ? document.querySelectorAll(target) : (target && target.forEach ? target : [target]);
        if (els) {
          Array.prototype.forEach.call(els, function (el) {
            if (!el) return;
            el.style.transition = 'all ' + (vars.duration || 0.4) + 's cubic-bezier(0.25, 0.8, 0.25, 1)';
            if (vars.rotation !== undefined) el.style.transform = 'rotate(' + vars.rotation + 'deg)';
            if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
            if (vars.scale !== undefined) el.style.transform = (el.style.transform || '') + ' scale(' + vars.scale + ')';
          });
        }
        if (vars && vars.onComplete) {
          setTimeout(vars.onComplete, Math.max(10, (vars.duration || 0.4) * 1000));
        }
      },
      set: function (target, vars) {
        var els = typeof target === 'string' ? document.querySelectorAll(target) : (target && target.forEach ? target : [target]);
        if (els) {
          Array.prototype.forEach.call(els, function (el) {
            if (!el) return;
            if (vars.rotation !== undefined) el.style.transform = 'rotate(' + vars.rotation + 'deg)';
            if (vars.opacity !== undefined) el.style.opacity = vars.opacity;
          });
        }
      },
      from: function (target, vars) {
        var current = getGSAP() || this;
        current.to(target, vars);
      },
      timeline: function () {
        var self = this;
        return {
          to: function (target, vars) {
            self.to(target, vars);
            return this;
          }
        };
      }
    };
  }

  function runWithGSAP(fn, retries) {
    if (typeof retries === 'undefined') retries = 25;
    var g = getGSAP();
    if (g) {
      window.gsap = g;
      fn(g);
      return;
    }
    if (retries > 0) {
      setTimeout(function () {
        runWithGSAP(fn, retries - 1);
      }, 40);
      return;
    }
    // Attempt local vendor injection
    var script = document.createElement('script');
    script.src = './assets/vendor/gsap.min.js';
    script.onload = function () {
      var loaded = getGSAP() || createFallbackGSAP();
      window.gsap = loaded;
      fn(loaded);
    };
    script.onerror = function () {
      var fallback = createFallbackGSAP();
      window.gsap = fallback;
      fn(fallback);
    };
    document.head.appendChild(script);
  }

  // --- Main Application Initialization ---
  function initApp(gsapInstance) {
    var gsap = gsapInstance || getGSAP() || createFallbackGSAP();
    window.gsap = gsap;

    // --- Content Data Extraction ---
    const flavors = [];
    const flavorElements = document.querySelectorAll('#flavors-data .flavor-data');

    flavorElements.forEach(function (el) {
      const nameEl = el.querySelector('.flavor-name');
      const colorEl = el.querySelector('.flavor-color');
      const imageEl = el.querySelector('.flavor-image');
      const bgImgEl = el.querySelector('.flavor-bg-image');
      const descEl = el.querySelector('.flavor-desc');

      const name = nameEl ? (nameEl.querySelector('h1,h2,h3,h4,h5,h6,p,span') || nameEl).textContent.trim() : '';
      const color = colorEl ? (colorEl.querySelector('p,h1,h2,h3,h4,h5,h6,span') || colorEl).textContent.trim() : '';

      const imgTag = imageEl ? imageEl.querySelector('img') : null;
      const image = imgTag ? (imgTag.getAttribute('src') || '') : '';

      const bgTag = bgImgEl ? bgImgEl.querySelector('img') : null;
      let bgImageUrl = bgTag ? (bgTag.getAttribute('src') || '') : '';
      if (bgImageUrl === window.location.href) {
        bgImageUrl = '';
      }

      const desc = descEl ? (descEl.querySelector('p,span,div') || descEl).textContent.trim() : '';

      if (name) {
        flavors.push({
          name: name,
          color: color,
          image: image,
          bgImage: bgImageUrl,
          desc: desc
        });
      }
    });

    // Fallback if semantic data not in DOM
    if (flavors.length === 0) {
      flavors.push(
        {
          name: 'Kiwi',
          color: 'linear-gradient(270deg, #01451F 0%, #3F9418 100%)',
          image: './assets/images/kiwi-bowl.png',
          bgImage: './assets/images/kiwi-bg.png',
          desc: 'Indulge in the exquisite delight of our luscious Kiwi Dream Pie. Picture a buttery golden crust, cradling a symphony of vibrant, juicy fruits, glistening like emeralds in the morning sun.'
        },
        {
          name: 'Blackberry',
          color: 'linear-gradient(270deg, #25003D 0%, #7A16C7 100%)',
          image: './assets/images/blackberry-bowl.png',
          bgImage: './assets/images/blackberry-bg.png',
          desc: 'Bursting with the bold flavor of wild blackberries, this pie is deep, rich, and beautifully juicy beneath a golden lattice crust. Finished with a sprinkle of coarse sugar for the perfect sweet crunch in every bite.'
        },
        {
          name: 'Banana',
          color: 'linear-gradient(270deg, #A86A00 0%, #F0B800 100%)',
          image: './assets/images/banana-bowl.png',
          bgImage: './assets/images/banana-bg.png',
          desc: 'Bright, zesty, and refreshingly rich, this Banana Caramel Silk pie features creamy custard whipped with ripe organic bananas, drizzled with handcrafted butterscotch on a crisp pastry crust.'
        },
        {
          name: 'Strawberry',
          color: 'linear-gradient(270deg, #8B0024 0%, #C90035 100%)',
          image: './assets/images/strawberry-bowl.png',
          bgImage: './assets/images/strawberry-bg.png',
          desc: 'Bursting with ripe field strawberries, this pie balances natural tartness with velvety sweetness beneath a golden lattice crust, finished with sparkling coarse sugar for a delicate crunch.'
        }
      );
    }

    // --- DOM Elements ---
    const appContainer = document.getElementById('app');
    const ring = document.getElementById('ring');
    const bgOverlay = document.getElementById('bg-overlay');
    const pieContainer = document.getElementById('pie-container');
    const titleEl = document.querySelector('#title h1') || document.querySelector('#title');
    const descWrapper = document.querySelector('#description');
    const descEl = descWrapper ? (descWrapper.querySelector('p, div') || descWrapper) : null;
    const indicatorRing = document.querySelector('.indicator-ring');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');

    if (!ring || !bgOverlay || !pieContainer) {
      console.error('[RotatingSlider] Required DOM containers missing.');
      return;
    }

    // Ensure circle-container class is present on the ring parent
    const circleContainer = ring.parentElement;
    if (circleContainer && !circleContainer.classList.contains('circle-container')) {
      circleContainer.classList.add('circle-container');
    }

    // Ensure nav-layer is child of app container
    const navLayer = document.querySelector('.nav-layer');
    if (navLayer && appContainer && navLayer.parentElement !== appContainer) {
      appContainer.appendChild(navLayer);
    }

    // --- State Variables ---
    let currentIndex = 0;
    let currentVirtualIndex = 0;
    const totalItems = flavors.length;
    let isAnimating = false;
    let isMobile = window.innerWidth <= 768;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Layout Configuration ---
    function getLayoutConfig() {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const angleStepMobile = 360 / totalItems;
        return {
          isMobile: true,
          angleStep: angleStepMobile,
          startAngle: 0,
          ringOffset: -angleStepMobile / 2
        };
      } else {
        const maxTotalArc = 170;
        const angleStepDesktop = Math.min(35, maxTotalArc / Math.max(1, totalItems - 1));
        const startAngleDesktop = -((totalItems - 1) / 2) * angleStepDesktop;
        return {
          isMobile: false,
          angleStep: angleStepDesktop,
          startAngle: startAngleDesktop,
          ringOffset: 0
        };
      }
    }

    // --- Render Pagination Dots ---
    function initDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      flavors.forEach(function (_, idx) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (idx === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        dot.addEventListener('click', function () {
          if (!isAnimating && idx !== currentIndex) {
            const config = getLayoutConfig();
            if (config.isMobile) {
              let diff = idx - currentIndex;
              if (diff > totalItems / 2) diff -= totalItems;
              if (diff < -totalItems / 2) diff += totalItems;
              currentVirtualIndex += diff;
            }
            goToFlavor(idx);
          }
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots(index) {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // --- Build Circular Text Ring ---
    function initRing() {
      ring.innerHTML = '';
      const config = getLayoutConfig();

      flavors.forEach(function (flavor, index) {
        const item = document.createElement('div');
        item.classList.add('flavor-item');
        item.dataset.index = index;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'Select ' + flavor.name);

        // Curved text effect — dynamically scale angle step to match ring curvature
        const text = flavor.name;
        const charAngleStep = window.innerWidth <= 380 ? 4.5 : (window.innerWidth <= 480 ? 4.0 : (config.isMobile ? 3.4 : 2.2));
        const totalAngle = (text.length - 1) * charAngleStep;
        const startTextAngle = -totalAngle / 2;

        text.split('').forEach(function (char, i) {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'flavor-char';
          const charAngle = startTextAngle + (i * charAngleStep);
          span.style.transform = 'rotate(' + charAngle + 'deg)';
          item.appendChild(span);
        });

        const angle = config.startAngle + (index * config.angleStep);
        item.style.transform = 'rotate(' + angle + 'deg)';

        const handleSelect = function () {
          if (!isAnimating && index !== currentIndex) {
            if (config.isMobile) {
              let diff = index - currentIndex;
              if (diff > totalItems / 2) diff -= totalItems;
              if (diff < -totalItems / 2) diff += totalItems;
              currentVirtualIndex += diff;
            }
            goToFlavor(index);
          }
        };

        item.addEventListener('click', handleSelect);
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        });

        ring.appendChild(item);
      });

      updateUI(currentIndex, true);
    }

    // --- Update UI Classes ---
    function updateUIClasses(index) {
      const items = ring.querySelectorAll('.flavor-item');
      items.forEach(function (item, i) {
        item.style.opacity = '';
        item.style.pointerEvents = '';

        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      updateDots(index);
    }

    // --- Main Slide Transition Function ---
    function goToFlavor(newIndex) {
      if (isAnimating) return;
      isAnimating = true;

      const oldIndex = currentIndex;
      currentIndex = newIndex;
      const flavor = flavors[currentIndex];
      const config = getLayoutConfig();

      if (!config.isMobile) {
        updateUIClasses(currentIndex);
      } else {
        updateDots(currentIndex);
      }

      const animDuration = prefersReducedMotion ? 0.05 : 0.7;

      // 1. Animate Circular Text Ring & Indicator Dot
      if (config.isMobile) {
        const ringAngle = -currentVirtualIndex * config.angleStep + config.ringOffset;

        gsap.to(ring, {
          rotation: ringAngle,
          duration: prefersReducedMotion ? 0 : 0.35,
          ease: 'power3.inOut'
        });

        const leftIndex = currentIndex;
        const rightIndex = (currentIndex + 1) % totalItems;

        const items = ring.querySelectorAll('.flavor-item');
        items.forEach(function (item, i) {
          const isVisible = (i === leftIndex || i === rightIndex);
          gsap.to(item, {
            opacity: isVisible ? 0.9 : 0,
            duration: 0.3,
            ease: 'power3.inOut',
            onComplete: function () {
              item.style.pointerEvents = isVisible ? 'auto' : 'none';
            }
          });
        });

        if (indicatorRing) {
          gsap.to(indicatorRing, { rotation: 0, duration: 0.3 });
        }
      } else {
        const indicatorAngle = config.startAngle + (currentIndex * config.angleStep);
        gsap.to(ring, { rotation: 0, duration: 0.3, ease: 'power3.inOut' });
        if (indicatorRing) {
          gsap.to(indicatorRing, {
            rotation: indicatorAngle,
            duration: prefersReducedMotion ? 0 : 0.35,
            ease: 'power3.inOut'
          });
        }
      }

      // 2. Animate Background Layer (Crossfade with Dynamic Gradients)
      const fadeLayer = document.createElement('div');
      fadeLayer.style.position = 'absolute';
      fadeLayer.style.top = '0';
      fadeLayer.style.left = '0';
      fadeLayer.style.width = '100%';
      fadeLayer.style.height = '100%';
      fadeLayer.style.zIndex = '1';
      fadeLayer.style.opacity = '0';
      fadeLayer.style.backgroundColor = flavor.color;

      if (flavor.bgImage && flavor.color.includes('gradient')) {
        fadeLayer.style.backgroundImage = 'url("' + flavor.bgImage + '"), ' + flavor.color;
        fadeLayer.style.backgroundSize = 'cover';
        fadeLayer.style.backgroundPosition = 'center';
      } else if (flavor.bgImage) {
        fadeLayer.style.backgroundImage = 'url("' + flavor.bgImage + '")';
        fadeLayer.style.backgroundSize = 'cover';
        fadeLayer.style.backgroundPosition = 'center';
      } else if (flavor.color.includes('gradient')) {
        fadeLayer.style.backgroundImage = flavor.color;
      }

      bgOverlay.appendChild(fadeLayer);

      gsap.to(fadeLayer, {
        opacity: 1,
        duration: prefersReducedMotion ? 0.1 : 0.8,
        ease: 'power3.inOut',
        onComplete: function () {
          bgOverlay.style.backgroundColor = flavor.color;
          if (flavor.bgImage && flavor.color.includes('gradient')) {
            bgOverlay.style.backgroundImage = 'url("' + flavor.bgImage + '"), ' + flavor.color;
          } else if (flavor.bgImage) {
            bgOverlay.style.backgroundImage = 'url("' + flavor.bgImage + '")';
          } else if (flavor.color.includes('gradient')) {
            bgOverlay.style.backgroundImage = flavor.color;
          } else {
            bgOverlay.style.backgroundImage = 'none';
          }
          fadeLayer.remove();
        }
      });

      // 3. Animate Text (Title and Description)
      const animTargets = [];
      if (titleEl) animTargets.push(titleEl);
      if (descWrapper) animTargets.push(descWrapper);

      if (animTargets.length) {
        if (prefersReducedMotion) {
          if (titleEl) titleEl.textContent = flavor.name;
          if (descEl) descEl.textContent = flavor.desc;
        } else {
          const tlText = gsap.timeline();
          tlText.to(animTargets, {
            y: -12,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: function () {
              if (titleEl) titleEl.textContent = flavor.name;
              if (descEl) descEl.textContent = flavor.desc;
            }
          }).to(animTargets, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out'
          });
        }
      }

      // 4. Animate Pie Hero Image
      const oldImg = pieContainer.querySelector('img.hero-pie');

      const newImg = document.createElement('img');
      newImg.src = flavor.image;
      newImg.alt = flavor.name + ' Pie';
      newImg.className = 'hero-pie';
      newImg.style.opacity = '0';

      // Fallback image handling
      newImg.onerror = function () {
        console.warn('[RotatingSlider] Failed loading local image: ' + newImg.src);
      };

      let direction = newIndex > oldIndex ? 1 : -1;
      if (oldIndex === totalItems - 1 && newIndex === 0) direction = 1;
      if (oldIndex === 0 && newIndex === totalItems - 1) direction = -1;

      if (prefersReducedMotion) {
        pieContainer.querySelectorAll('img.hero-pie').forEach(function (img) { img.remove(); });
        newImg.style.opacity = '1';
        pieContainer.appendChild(newImg);
        isAnimating = false;
      } else {
        gsap.set(newImg, { rotation: direction * 45, scale: 0.95 });
        pieContainer.appendChild(newImg);

        if (oldImg) {
          gsap.to(oldImg, {
            rotation: -direction * 45,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            ease: 'power2.in',
            onComplete: function () { oldImg.remove(); }
          });
        }

        gsap.to(newImg, {
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'back.out(1.2)',
          onComplete: function () {
            isAnimating = false;
          }
        });
      }
    }

    // --- Initial UI Setup ---
    function updateUI(index, isInitial) {
      const flavor = flavors[index];
      const config = getLayoutConfig();

      if (titleEl) titleEl.textContent = flavor.name;
      if (descEl) descEl.textContent = flavor.desc;

      bgOverlay.style.backgroundColor = flavor.color;
      if (flavor.bgImage && flavor.color.includes('gradient')) {
        bgOverlay.style.backgroundImage = 'url("' + flavor.bgImage + '"), ' + flavor.color;
        bgOverlay.style.backgroundSize = 'cover';
        bgOverlay.style.backgroundPosition = 'center';
      } else if (flavor.bgImage) {
        bgOverlay.style.backgroundImage = 'url("' + flavor.bgImage + '")';
        bgOverlay.style.backgroundSize = 'cover';
        bgOverlay.style.backgroundPosition = 'center';
      } else if (flavor.color.includes('gradient')) {
        bgOverlay.style.backgroundImage = flavor.color;
      }

      if (!config.isMobile) {
        updateUIClasses(index);
        const indicatorAngle = config.startAngle + (index * config.angleStep);
        gsap.set(ring, { rotation: 0 });
        if (indicatorRing) gsap.set(indicatorRing, { rotation: indicatorAngle });
      } else {
        const ringAngle = -currentVirtualIndex * config.angleStep + config.ringOffset;
        gsap.set(ring, { rotation: ringAngle });
        if (indicatorRing) gsap.set(indicatorRing, { rotation: 0 });

        const leftIndex = currentIndex;
        const rightIndex = (currentIndex + 1) % totalItems;

        const items = ring.querySelectorAll('.flavor-item');
        items.forEach(function (item, i) {
          if (i === leftIndex || i === rightIndex) {
            item.style.opacity = '0.9';
            item.style.pointerEvents = 'auto';
          } else {
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
          }
        });
      }

      updateDots(index);

      // Setup initial image
      pieContainer.querySelectorAll('img.hero-pie').forEach(function (img) { img.remove(); });
      const img = document.createElement('img');
      img.src = flavor.image;
      img.alt = flavor.name + ' Pie';
      img.className = 'hero-pie';
      img.style.opacity = '1';
      pieContainer.appendChild(img);

      if (isInitial && !prefersReducedMotion) {
        gsap.from(img, {
          scale: 0.8,
          rotation: -25,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }
    }

    // --- Next / Prev Controls ---
    function stepNext() {
      if (!isAnimating) {
        currentVirtualIndex++;
        let newIdx = currentIndex + 1;
        if (newIdx >= totalItems) newIdx = 0;
        goToFlavor(newIdx);
      }
    }

    function stepPrev() {
      if (!isAnimating) {
        currentVirtualIndex--;
        let newIdx = currentIndex - 1;
        if (newIdx < 0) newIdx = totalItems - 1;
        goToFlavor(newIdx);
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', stepNext);
    if (prevBtn) prevBtn.addEventListener('click', stepPrev);

    // --- Keyboard Navigation ---
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepPrev();
      }
    });

    // --- Touch Swipe Navigation ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    appContainer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    appContainer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 45;

      // Ensure horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          stepNext(); // swipe left -> next
        } else {
          stepPrev(); // swipe right -> prev
        }
      }
    }

    // --- Window Resize Handling ---
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
          isMobile = newIsMobile;
          initRing();
        }
      }, 150);
    });

    // --- Header Navigation & Interactive Toasts ---
    const toast = document.getElementById('slider-toast');
    let toastTimer;

    function showToast(message) {
      if (!toast) return;
      toast.querySelector('.toast-text').textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove('show');
      }, 3000);
    }

    // CTA Button
    const ctaBtns = document.querySelectorAll('.cta-btn, .see-products-btn');
    ctaBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const activeName = flavors[currentIndex] ? flavors[currentIndex].name : 'Pie';
        showToast('Viewing ' + activeName + ' collection in the Choppi Pies menu.');
      });

    });

    // Header Links
    const navLinks = document.querySelectorAll('.ffy-nav-btn a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.forEach(function (l) { l.parentElement.classList.remove('ffy-nav-active'); });
        link.parentElement.classList.add('ffy-nav-active');
        const sectionName = link.textContent.trim();
        showToast('Navigated to "' + sectionName + '" section.');
        const navMenu = document.querySelector('.ffy-nav');
        if (navMenu) navMenu.classList.remove('mobile-open');
      });
    });

    // Cart and Search buttons
    const cartBtn = document.querySelector('.header-action-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Cart: 1 item (' + flavors[currentIndex].name + ' Pie) ready for checkout.');
      });
    }

    const searchBtn = document.querySelector('.header-action-search');
    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showToast('Search: Try searching for "Kiwi", "Strawberry", or "Blackberry".');
      });
    }

    // Mobile Hamburger Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const ffyNav = document.querySelector('.ffy-nav');
    if (mobileMenuBtn && ffyNav) {
      mobileMenuBtn.addEventListener('click', function () {
        ffyNav.classList.toggle('mobile-open');
      });
    }

    // Initialize dots and ring
    initDots();
    initRing();
  }

  // DOM ready hook with resilient GSAP waiting
  function start() {
    runWithGSAP(initApp);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

