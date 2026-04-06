/**
 * ANWAAR FOUNDATION - MAIN JAVASCRIPT
 * Handles animations, interactions, and form submissions
 */

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initThumbnailSlider();
    initSmoothScroll();
    initCounterAnimation();
    initDonationAmounts();
    initScrollAnimations();
    initActiveNavLink();
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.pillar-card, .program-card, .value-item, .partner-item, .story-item'
    );
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(el);
    });
}

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
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
