// ============================
// PARTICLE SYSTEM
// ============================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ============================
// NAVBAR SCROLL EFFECT & LOGO SWAP
// ============================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const navLogo = document.querySelector('.logo');
    const aboutSection = document.getElementById('about');
    const footer = document.querySelector('footer');
    
    // Add scrolled class to navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Swap logo: show fest-logo from about section till footer
    if (aboutSection && navLogo) {
        const aboutPosition = aboutSection.offsetTop;
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        // Calculate the end position (footer or end of document)
        let endPosition = document.documentElement.scrollHeight;
        if (footer) {
            endPosition = footer.offsetTop + footer.offsetHeight;
        }
        
        if (scrollPosition >= aboutPosition && scrollPosition < endPosition) {
            // From about section to end - show fest logo
            navLogo.src = 'images/fest-logo.png';
            navLogo.alt = 'Fest Logo';
        } else {
            // Before about section - show college logo
            navLogo.src = 'images/clg.png';
            navLogo.alt = 'College Logo';
        }
    }
});

// ============================
// HERO PARALLAX EFFECT
// ============================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && scrolled < window.innerHeight) {
        const festLogo = document.querySelector('.fest-logo');
        const heroImage = document.querySelector('.hero-image');
        const heroTagline = document.querySelector('.hero-tagline');
        
        // Different parallax speeds for layered depth effect
        if (festLogo) {
            festLogo.style.transform = `translateY(${scrolled * 0.3}px)`;
            festLogo.style.opacity = 1 - (scrolled / 500);
        }
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroImage.style.opacity = 1 - (scrolled / 600);
        }
        
        if (heroTagline) {
            heroTagline.style.transform = `translateY(${scrolled * 0.7}px)`;
            heroTagline.style.opacity = 1 - (scrolled / 700);
        }
    }
});

// ============================
// MOBILE MENU - CLEAN & SIMPLE
// ============================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const menuBackdrop = document.getElementById('menuBackdrop');
const closeMenu = document.getElementById('closeMenu');

// Toggle menu
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuBackdrop.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Close menu
function closeMenuFunc() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

// Hamburger click
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Backdrop click
if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenuFunc);
}

// Close button click
if (closeMenu) {
    closeMenu.addEventListener('click', closeMenuFunc);
}

// Desktop dropdown - prevent default on toggle click
document.querySelectorAll('.desktop-nav .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        // Desktop dropdowns work on hover, so this just prevents navigation
    });
});

// Mobile dropdown toggle
document.querySelectorAll('.mobile-sidebar .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.dropdown');
        dropdown.classList.toggle('active');
    });
});

// Close menu when clicking menu links
document.querySelectorAll('.menu-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMenuFunc);
});

// Close menu when clicking dropdown links
document.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', closeMenuFunc);
});

// ============================
// SMOOTH SCROLL REVEAL ANIMATION
// ============================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});
    function hashCode(s) {
        if (s.length === 0) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    window.addEventListener('mousemove', e => {
        let pointer = pointers[0];
        let posX = scaleByPixelRatio(e.clientX);
        let posY = scaleByPixelRatio(e.clientY);
        updatePointerMoveData(pointer, posX, posY);
    });

    window.addEventListener('touchmove', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        let pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].clientX);
            let posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerMoveData(pointer, posX, posY);
        }
    }, false);

    update();
})();
*/

// ============================
// COUNTDOWN TIMER TO NOVEMBER 21, 2025
// ============================
function updateCountdown() {
    // Set the target date to November 21, 2025 at midnight
    const targetDate = new Date('November 21, 2025 00:00:00').getTime();
    
    // Update the countdown every second
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the DOM elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // If countdown is finished, display a message
        if (distance < 0) {
            clearInterval(countdownInterval);
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
        }
    }, 1000);
}

// Start countdown when page loads
if (document.getElementById('days')) {
    updateCountdown();
}

// ============================
// CONSOLE EASTER EGG
// ============================
console.log('%c🔮 Welcome to the Mystical Fest! 🔮', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%cWhere Legends Awaken...', 'color: #06b6d4; font-size: 14px;');

