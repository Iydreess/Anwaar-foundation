/**
 * ANWAAR FOUNDATION - MAIN JAVASCRIPT
 * Handles animations, interactions, and form submissions
 */

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initLenisSmoothScroll();
    initThumbnailSlider();
    initSmoothScroll();
    initCounterAnimation();
    initDonationAmounts();
    initScrollAnimations();
    initActiveNavLink();
    initProgramsDropdownA11y();
    initMobileProgramsLinks();
    initMobileMenuDismiss();
    initGalleryFilters();
    initGalleryProjectModal();
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isHomePage = currentPath === 'index.html';

    function updateHeaderState() {
        const currentScroll = window.pageYOffset;

        if (!isHomePage || currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Ensure correct navbar state on first paint.
    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// ============================================
// THUMBNAIL SLIDER (Hero Section)
// ============================================
function initThumbnailSlider() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length === 0) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        thumbnails[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % thumbnails.length;
        thumbnails[currentIndex].classList.add('active');
    }, 4000);
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initLenisSmoothScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function setupLenis() {
        if (!window.Lenis || window.__lenisInstance) return;

        const lenis = new window.Lenis({
            duration: 1.75,
            smoothWheel: true,
            smoothTouch: false,
            lerp: 0.055,
            wheelMultiplier: 0.72
        });

        window.__lenisInstance = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    if (window.Lenis) {
        setupLenis();
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js';
    script.async = true;
    script.onload = setupLenis;
    document.head.appendChild(script);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                if (window.__lenisInstance) {
                    window.__lenisInstance.scrollTo(targetPosition, { duration: 1.6 });
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================
// COUNTER ANIMATION (Impact Section)
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================
// DONATION AMOUNT SELECTION
// ============================================
function initDonationAmounts() {
    const amountButtons = document.querySelectorAll('.donation-amount');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Handle custom amount
            if (this.classList.contains('custom')) {
                const customAmount = prompt('Enter custom amount (USD):');
                if (customAmount && !isNaN(customAmount) && customAmount > 0) {
                    this.textContent = '$' + parseInt(customAmount);
                    this.setAttribute('data-amount', customAmount);
                } else {
                    // Revert to default if invalid
                    amountButtons[2].classList.add('active');
                    this.classList.remove('active');
                    this.textContent = 'Custom';
                }
            }
        });
    });
}

// ============================================
// PROCESS DONATION
// ============================================
function processDonation() {
    const activeAmount = document.querySelector('.donation-amount.active');
    const donationType = document.querySelector('input[name="donation-type"]:checked').value;
    
    if (!activeAmount) {
        showToast('Please select a donation amount', 'error');
        return;
    }
    
    const amount = activeAmount.getAttribute('data-amount');
    const type = donationType === 'monthly' ? 'monthly' : 'one-time';
    
    // Show confirmation message
    showToast(`Thank you! Redirecting to secure payment for $${amount} ${type} donation...`);
    
    // In a real implementation, this would redirect to a payment processor
    // Example: window.location.href = `/payment?amount=${amount}&type=${type}`;
    
    // Simulate payment redirect delay
    setTimeout(() => {
        // For demo purposes, show success
        showToast('Payment processing would begin here. Thank you for your generosity!');
    }, 2000);
}

// ============================================
// SHOW MONTHLY GIVING INFO
// ============================================
function showMonthlyInfo(event) {
    event.preventDefault();
    showToast('Monthly giving helps us plan ahead and reach more communities. Select "Monthly" and choose your amount.');
}

// ============================================
// CONTACT FORM HANDLER
// ============================================
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showToast('Sending message...');
    
    setTimeout(() => {
        showToast('Thank you! Your message has been sent. We will get back to you soon.');
        form.reset();
    }, 1500);
    
    // In a real implementation, you would send this to a server:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     body: formData
    // })
}

// ============================================
// NEWSLETTER FORM HANDLER
// ============================================
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showToast('Thank you for subscribing!');
    event.target.reset();
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Update icon based on type
    const icon = toast.querySelector('i');
    if (icon) {
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
}

function initMobileMenuDismiss() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNav = mobileMenu ? mobileMenu.querySelector('.mobile-nav') : null;

    if (!mobileMenu || !mobileNav) return;

    mobileMenu.addEventListener('click', function(event) {
        if (!mobileMenu.classList.contains('active')) return;

        if (event.target === mobileMenu) {
            toggleMobileMenu();
        }
    });
}

function initMobileProgramsLinks() {
    const mobileNavs = Array.from(document.querySelectorAll('.mobile-nav'));
    if (mobileNavs.length === 0) return;

    const programSubpages = [
        { href: 'ramadhan-cooked-meals.html', label: 'Ramadhan Cooked Meals' },
        { href: 'eid-support-programs.html', label: 'Eid Support Programs' },
        { href: 'dry-food-distribution.html', label: 'Dry Food Distribution' },
        { href: 'livelihood-empowerment.html', label: 'Livelihood Empowerment' }
    ];

    mobileNavs.forEach((nav) => {
        const links = Array.from(nav.querySelectorAll('a'));
        const programsLink = links.find((link) => (link.getAttribute('href') || '').toLowerCase() === 'programs.html');

        if (!programsLink) return;

        const existingHrefs = new Set(Array.from(nav.querySelectorAll('a')).map((link) => (link.getAttribute('href') || '').toLowerCase()));
        const fragment = document.createDocumentFragment();

        programSubpages.forEach((subpage) => {
            if (existingHrefs.has(subpage.href.toLowerCase())) return;

            const subLink = document.createElement('a');
            subLink.href = subpage.href;
            subLink.textContent = subpage.label;
            subLink.classList.add('mobile-sub-link');
            subLink.setAttribute('onclick', 'toggleMobileMenu()');
            fragment.appendChild(subLink);
        });

        if (!fragment.hasChildNodes()) return;

        const galleryLink = Array.from(nav.querySelectorAll('a')).find((link) => (link.getAttribute('href') || '').toLowerCase() === 'gallery.html');

        const insertionPoint = galleryLink || programsLink.nextSibling;
        nav.insertBefore(fragment, insertionPoint || null);
    });
}

function initGalleryFilters() {
    const filterButtons = Array.from(document.querySelectorAll('.gallery-filter-btn'));
    const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-card'));

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    function applyFilter(filterValue) {
        galleryItems.forEach((item) => {
            const categoryString = (item.getAttribute('data-category') || '').toLowerCase();
            const matchesFilter = filterValue === 'all' || categoryString.split(/\s+/).includes(filterValue);
            item.classList.toggle('is-hidden', !matchesFilter);
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const filterValue = (this.getAttribute('data-filter') || 'all').toLowerCase();

            filterButtons.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            applyFilter(filterValue);
        });
    });
}

function initGalleryProjectModal() {
    const cards = Array.from(document.querySelectorAll('.gallery-grid .gallery-card'));
    const modal = document.getElementById('galleryModal');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalProject = document.getElementById('galleryModalProject');
    const modalClose = document.getElementById('galleryModalClose');
    const modalImage = document.getElementById('galleryLightboxImage');
    const modalCaption = document.getElementById('galleryLightboxCaption');
    const modalCounter = document.getElementById('galleryLightboxCounter');
    const prevButton = document.getElementById('galleryPrev');
    const nextButton = document.getElementById('galleryNext');

    if (
        cards.length === 0 ||
        !modal ||
        !modalTitle ||
        !modalProject ||
        !modalClose ||
        !modalImage ||
        !modalCaption ||
        !modalCounter ||
        !prevButton ||
        !nextButton
    ) return;

    let isModalOpen = false;
    let currentImages = [];
    let currentIndex = 0;

    function parseImages(rawValue) {
        return (rawValue || '')
            .split(';;')
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => {
                const [src, caption] = item.split('|');
                return { src: (src || '').trim(), caption: (caption || '').trim() };
            })
            .filter((entry) => entry.src);
    }

    function closeModal() {
        if (!isModalOpen) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        isModalOpen = false;
    }

    function renderCurrentImage() {
        if (currentImages.length === 0) return;

        const current = currentImages[currentIndex];
        modalImage.src = current.src;
        modalCaption.textContent = current.caption || modalProject.textContent;
        modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    function moveImage(delta) {
        if (currentImages.length <= 1) return;

        currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
        renderCurrentImage();
    }

    function openModalForCard(card) {
        const projectName = card.getAttribute('data-project') || 'Program Work';
        const workName = card.getAttribute('data-work') || 'Project visuals';
        const images = parseImages(card.getAttribute('data-images'));

        if (images.length === 0) return;

        currentImages = images;
        currentIndex = 0;

        modalProject.textContent = projectName.toUpperCase();
        modalTitle.textContent = workName;
        renderCurrentImage();

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        isModalOpen = true;
    }

    cards.forEach((card) => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', function() {
            openModalForCard(this);
        });

        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModalForCard(this);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    prevButton.addEventListener('click', function() {
        moveImage(-1);
    });

    nextButton.addEventListener('click', function() {
        moveImage(1);
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (!isModalOpen) return;

        if (event.key === 'Escape') {
            closeModal();
        }

        if (event.key === 'ArrowLeft') {
            moveImage(-1);
        }

        if (event.key === 'ArrowRight') {
            moveImage(1);
        }
    });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const animatedElements = Array.from(document.querySelectorAll('[data-anim]'));
    const footers = Array.from(document.querySelectorAll('.main-footer'));

    if (animatedElements.length === 0 && footers.length === 0) return;

    document.documentElement.classList.add('motion-ready');

    document.querySelectorAll('[data-stagger]').forEach((group) => {
        const staggerStep = (Number(group.getAttribute('data-stagger')) || 0.08) * 1.35;
        const staggerItems = Array.from(group.querySelectorAll('[data-anim]'));

        staggerItems.forEach((item, index) => {
            if (item.getAttribute('data-delay')) return;
            item.style.setProperty('--anim-delay', `${(index * staggerStep).toFixed(2)}s`);
        });
    });

    animatedElements.forEach((element) => {
        const customDelay = element.getAttribute('data-delay');
        if (customDelay) {
            element.style.setProperty('--anim-delay', customDelay);
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        scrollObserver.observe(el);
    });

    footers.forEach((footer) => {
        scrollObserver.observe(footer);
    });
}

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hashLinks = Array.from(navLinks).filter(link => (link.getAttribute('href') || '').startsWith('#'));
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0) return;

    // Multi-page mode: highlight nav by current URL path.
    if (hashLinks.length === 0) {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const programsDetailPages = [
            'ramadhan-cooked-meals.html',
            'eid-support-programs.html',
            'dry-food-distribution.html',
            'livelihood-empowerment.html'
        ];
        const resolvedPath = programsDetailPages.includes(currentPath) ? 'programs.html' : currentPath;

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href === resolvedPath);
        });
        return;
    }

    if (sections.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
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
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ============================================
// PROGRAMS DROPDOWN ACCESSIBILITY
// ============================================
function initProgramsDropdownA11y() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    if (dropdowns.length === 0) return;

    dropdowns.forEach((dropdown, dropdownIndex) => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = menu ? Array.from(menu.querySelectorAll('a')) : [];

        if (!toggle || !menu || items.length === 0) return;

        if (!menu.id) {
            menu.id = `programs-dropdown-${dropdownIndex + 1}`;
        }

        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', menu.id);

        function setExpanded(value) {
            toggle.setAttribute('aria-expanded', value ? 'true' : 'false');
        }

        function focusItem(index) {
            const safeIndex = (index + items.length) % items.length;
            items[safeIndex].focus();
        }

        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setExpanded(true);
                focusItem(0);
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setExpanded(true);
                focusItem(items.length - 1);
            }
        });

        items.forEach((item, itemIndex) => {
            item.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusItem(itemIndex + 1);
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusItem(itemIndex - 1);
                }

                if (e.key === 'Home') {
                    e.preventDefault();
                    focusItem(0);
                }

                if (e.key === 'End') {
                    e.preventDefault();
                    focusItem(items.length - 1);
                }

                if (e.key === 'Escape') {
                    e.preventDefault();
                    setExpanded(false);
                    toggle.focus();
                }
            });
        });

        dropdown.addEventListener('focusin', function() {
            setExpanded(true);
        });

        dropdown.addEventListener('focusout', function(e) {
            if (!dropdown.contains(e.relatedTarget)) {
                setExpanded(false);
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT (Optional enhancement)
// ============================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg img');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px) scale(1)`;
    });
}, { passive: true });

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// ============================================
// PERFORMANCE: Lazy load images
// ============================================
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c Anwaar Foundation ', 'background: #0B3A2E; color: #C8A24C; font-size: 20px; font-weight: bold; padding: 10px 20px;');
console.log('%c Bringing light, relief, and lasting change to vulnerable communities in Kenya. ', 'color: #0B3A2E; font-size: 14px;');
