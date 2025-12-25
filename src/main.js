/**
 * NeoTech - Enhanced Motion & Interactions
 * Main JavaScript file for scroll effects, animations, and user interactions
 */

// ========================================
// DOM Content Loaded
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initSmoothScroll();
    initScrollAnimations();
    initHeaderBehavior();
    initMobileMenu();
    initScrollToTop();
    initActiveNavLink();
    initParallaxEffect();
    initCardHoverEffects();
});

// ========================================
// Loading Screen
// ========================================
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;

    // Hide loading screen as soon as DOM is ready
    const hideLoader = () => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Hide on load or after max 1 second (fallback)
    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 1000); // Fallback: max 1 second wait
    }
}

// ========================================
// Smooth Scrolling
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.fixed-header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate counter if present
                const counter = entry.target.querySelector('[data-count]');
                if (counter) {
                    animateCounter(counter);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Also observe sections for progressive reveal
    document.querySelectorAll('.card, .spec-item, .intelligence-item, .footer-col').forEach((el, index) => {
        el.classList.add('animate-on-scroll', `delay-${(index % 4) + 1}`);
        observer.observe(el);
    });
}

// ========================================
// Counter Animation
// ========================================
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(updateCounter);
}

// ========================================
// Header Scroll Behavior
// ========================================
function initHeaderBehavior() {
    const header = document.querySelector('.fixed-header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                // Add/remove scrolled class for glassmorphism effect
                if (currentScroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Compact mode when scrolling down, expand when at top
                if (currentScroll > 100) {
                    header.classList.add('compact');
                } else {
                    header.classList.remove('compact');
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// Active Navigation Link
// ========================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id], main[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ========================================
// Scroll to Top Button
// ========================================
function initScrollToTop() {
    const scrollTop = document.querySelector('.scroll-top');
    if (!scrollTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Parallax Effect for Hero
// ========================================
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    if (!heroSection || !heroContent) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroHeight = heroSection.offsetHeight;

                if (scrolled < heroHeight) {
                    const parallaxValue = scrolled * 0.4;
                    const opacityValue = 1 - (scrolled / heroHeight);

                    heroContent.style.transform = `translateY(calc(-5vh + ${parallaxValue}px))`;
                    heroContent.style.opacity = Math.max(opacityValue, 0);
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================================
// Card Hover Effects (Mouse Tracking)
// ========================================
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ========================================
// Initialize
// ========================================
console.log('NeoTech App Initialized ✨');
