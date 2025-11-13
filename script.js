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

// ============================
// 3D CYLINDRICAL CAROUSEL (scoped by .events.cyl-3d)
// ============================
const ENABLE_3D_CYLINDER = document.querySelector('.events.cyl-3d') !== null;
const ENABLE_VERTICAL_SCROLL = document.querySelector('.events.vertical-scroll') !== null;
const ENABLE_SINGLE_CARD_SCROLL = document.querySelector('.events.single-card-scroll') !== null;
const carouselCylinder = document.getElementById('carouselCylinder');
const carouselInner = document.querySelector('.carousel-cylinder-inner');
const cylinderCards = document.querySelectorAll('.event-card-cylinder');
const prevCylinderBtn = document.getElementById('prevCylinderBtn');
const nextCylinderBtn = document.getElementById('nextCylinderBtn');

if (!ENABLE_VERTICAL_SCROLL && ENABLE_3D_CYLINDER && carouselInner && cylinderCards.length > 0) {
    const totalCards = cylinderCards.length;
    const anglePerCard = 360 / totalCards;
    
    // Responsive radius based on screen size - smaller radius shows more curve
    let radius = 500;
    if (window.innerWidth <= 768) {
        radius = 250; // Reduced from 280 to prevent overflow
    }
    if (window.innerWidth <= 480) {
        radius = 200; // Reduced from 240
    }
    if (window.innerWidth <= 360) {
        radius = 180; // Reduced from 220
    }
    
    let currentRotation = 0;
    let currentIndex = 0;
    let isAnimating = false;

    // Position cards in cylinder formation
    function positionCards() {
        cylinderCards.forEach((card, index) => {
            const angle = anglePerCard * index;
            const theta = (angle * Math.PI) / 180;
            
            // Position cards in a cylinder around Y-axis
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            
            // Mark center card
            if (index === currentIndex) {
                card.classList.add('center');
            } else {
                card.classList.remove('center');
            }
        });
        updateDepthAndInteractivity();
    }

    // Rotate carousel by one step
    function rotateCylinder(direction) {
        if (isAnimating) return;
        isAnimating = true;

        if (direction === 'next') {
            currentRotation -= anglePerCard;
            currentIndex = (currentIndex + 1) % totalCards;
        } else {
            currentRotation += anglePerCard;
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        }

    carouselInner.style.transform = `rotateY(${currentRotation}deg)`;

        // Update center card after rotation
        setTimeout(() => {
            cylinderCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('center');
                } else {
                    card.classList.remove('center');
                }
            });
            updateDepthAndInteractivity();
            isAnimating = false;
        }, 400);
    }

    // Jump to a specific card index (shortest path)
    function goToIndex(targetIndex) {
        if (targetIndex === currentIndex || isAnimating) return;
        isAnimating = true;

        // Compute shortest direction
        let forwardSteps = (targetIndex - currentIndex + totalCards) % totalCards;
        let backwardSteps = (currentIndex - targetIndex + totalCards) % totalCards;

        if (forwardSteps <= backwardSteps) {
            currentRotation -= anglePerCard * forwardSteps;
        } else {
            currentRotation += anglePerCard * backwardSteps;
        }
        currentIndex = targetIndex;
    carouselInner.style.transform = `rotateY(${currentRotation}deg)`;

        setTimeout(() => {
            cylinderCards.forEach((card, index) => {
                if (index === currentIndex) card.classList.add('center');
                else card.classList.remove('center');
            });
            updateDepthAndInteractivity();
            isAnimating = false;
        }, 400);
    }

    // Ensure proper stacking; keep all cards clickable
    function updateDepthAndInteractivity() {
        cylinderCards.forEach((card, index) => {
            // Compute minimal signed angular distance from center card
            let deltaIndex = (index - currentIndex);
            // wrap into range [-half, half]
            if (deltaIndex > totalCards / 2) deltaIndex -= totalCards;
            if (deltaIndex < -totalCards / 2) deltaIndex += totalCards;
            const deltaAngle = deltaIndex * anglePerCard; // degrees
            const rad = (deltaAngle * Math.PI) / 180;

            // zIndex weighting: front highest, back lowest
            const depth = Math.cos(rad); // 1 front, -1 back
            const z = 1000 + Math.round(depth * 500); // 500..1500
            card.style.zIndex = String(z);

            // Keep pointer events enabled so the button is always clickable
            card.style.pointerEvents = 'auto';
        });
    }

    // Initialize
    positionCards();

    // Button controls (reuse slider nav ids)
    const nextCylinderBtn = document.getElementById('eventsNextBtn');
    const prevCylinderBtn = document.getElementById('eventsPrevBtn');
    if (nextCylinderBtn) { nextCylinderBtn.addEventListener('click', () => rotateCylinder('next')); }
    if (prevCylinderBtn) { prevCylinderBtn.addEventListener('click', () => rotateCylinder('prev')); }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') rotateCylinder('prev');
        else if (e.key === 'ArrowRight') rotateCylinder('next');
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselContainer = document.querySelector('.carousel-cylinder');
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        carouselContainer.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });
        function handleSwipe() { const swipeThreshold = 50; const diff = touchStartX - touchEndX; if (Math.abs(diff) > swipeThreshold) { if (diff > 0) rotateCylinder('next'); else rotateCylinder('prev'); } }
    }

    // Auto-rotate (optional - uncomment to enable)
    /*
    let autoRotateInterval = setInterval(() => {
        rotateCylinder('next');
    }, 4000);

    // Pause on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => {
                rotateCylinder('next');
            }, 4000);
        });
    }
    */
}

// ============================
// EVENTS HORIZONTAL SLIDER
// ============================

(function initEventsSlider() {
    if (ENABLE_3D_CYLINDER || ENABLE_VERTICAL_SCROLL) return; // skip when 3D or vertical
    const track = document.getElementById('carouselCylinder');
    if (!track) return;

    const prev = document.getElementById('eventsPrevBtn');
    const next = document.getElementById('eventsNextBtn');

    const scrollByPage = (direction) => {
        const viewport = track.clientWidth;
        const gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16', 10);
        const delta = viewport - gap;
        track.scrollBy({ left: direction * delta, behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => scrollByPage(-1));
    if (next) next.addEventListener('click', () => scrollByPage(1));

    // Optional: drag to scroll (mouse)
    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; track.classList.add('dragging'); });
    window.addEventListener('mouseup', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.2;
        track.scrollLeft = scrollLeft - walk;
    });
})();

// ============================
// EVENTS VERTICAL SCROLL NAV (separate from horizontal slider)
// ============================
(function initVerticalScrollNav() {
    if (!ENABLE_VERTICAL_SCROLL) return;
    const container = document.getElementById('carouselCylinder');
    if (!container) return;
    const upBtn = document.getElementById('eventsPrevBtn');
    const downBtn = document.getElementById('eventsNextBtn');
    const cards = Array.from(container.querySelectorAll('.event-card-cylinder'));
    let currentIndex = 0;

    function clamp(i){ return Math.max(0, Math.min(cards.length-1, i)); }

    function scrollToIndex(i){
        i = clamp(i);
        currentIndex = i;
        const targetTop = cards[i].offsetTop;
        container.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    function updateCurrentIndexOnScroll(){
        const scrollTop = container.scrollTop;
        let nearest = 0; let nearestDist = Infinity;
        cards.forEach((card, idx) => {
            const dist = Math.abs(card.offsetTop - scrollTop);
            if (dist < nearestDist){ nearestDist = dist; nearest = idx; }
        });
        currentIndex = nearest;
    }

    // Attach listeners
    if (upBtn) upBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    if (downBtn) downBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { scrollToIndex(currentIndex - 1); }
        else if (e.key === 'ArrowDown') { scrollToIndex(currentIndex + 1); }
    });

    // Sync index on manual scroll
    let scrollTicking = false;
    container.addEventListener('scroll', () => {
        if (!scrollTicking){
            scrollTicking = true;
            requestAnimationFrame(() => { updateCurrentIndexOnScroll(); scrollTicking = false; });
        }
    });
})();

// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================

// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Use CSS scroll-margin-top for offset, just trigger smooth scroll
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================
// INITIALIZE ON LOAD
// ============================
window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Trigger fade-in for elements in viewport on load
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
});

// ============================
// HERO IMAGE PARALLAX EFFECT
// ============================
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ============================
// WEBGL FLUID SPLASH CURSOR - DISABLED
// ============================
/*
(function() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'fluid-canvas';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none;';
    document.body.appendChild(canvas);

    // Configuration
    const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 1.5,
        VELOCITY_DISSIPATION: 1.8,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 10,
        SPLAT_RADIUS: 0.15,
        SPLAT_FORCE: 3000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: true
    };

    function pointerPrototype() {
        this.id = -1;
        this.texcoordX = 0;
        this.texcoordY = 0;
        this.prevTexcoordX = 0;
        this.prevTexcoordY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.down = false;
        this.moved = false;
        this.color = [30, 0, 300];
    }

    let pointers = [new pointerPrototype()];
    const { gl, ext } = getWebGLContext(canvas);

    function getWebGLContext(canvas) {
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext('webgl2', params);
        const isWebGL2 = !!gl;
        if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);

        let halfFloat, supportLinearFiltering;
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
        let formatRGBA, formatRG, formatR;

        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };

        function getSupportedFormat(gl, internalFormat, format, type) {
            if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
                switch (internalFormat) {
                    case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                    case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                    default: return null;
                }

                // Click a non-center card to bring it to center
                cylinderCards.forEach((card, index) => {
                    card.addEventListener('click', (e) => {
                        // Don't hijack clicks on links/buttons inside the card
                        if (e.target.closest('a, button')) return;
                        if (index !== currentIndex) {
                            goToIndex(index);
                        }
                    });
                });
            }
            return { internalFormat, format };
        }

        function supportRenderTextureFormat(gl, internalFormat, format, type) {
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
            let fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        }
    }

    class Material {
        constructor(vertexShader, fragmentShaderSource) {
            this.vertexShader = vertexShader;
            this.fragmentShaderSource = fragmentShaderSource;
            this.programs = [];
            this.activeProgram = null;
            this.uniforms = [];
        }
        setKeywords(keywords) {
            let hash = 0;
            for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
            let program = this.programs[hash];
            if (program == null) {
                let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
                program = createProgram(this.vertexShader, fragmentShader);
                this.programs[hash] = program;
            }
            if (program === this.activeProgram) return;
            this.uniforms = getUniforms(program);
            this.activeProgram = program;
        }
        bind() { gl.useProgram(this.activeProgram); }
    }

    class Program {
        constructor(vertexShader, fragmentShader) {
            this.uniforms = {};
            this.program = createProgram(vertexShader, fragmentShader);
            this.uniforms = getUniforms(this.program);
        }
        bind() { gl.useProgram(this.program); }
    }

    function createProgram(vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.trace(gl.getProgramInfoLog(program));
        return program;
    }

    function getUniforms(program) {
        let uniforms = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    function compileShader(type, source, keywords) {
        source = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.trace(gl.getShaderInfoLog(shader));
        return shader;
    }

    function addKeywords(source, keywords) {
        if (!keywords) return source;
        let keywordsString = '';
        keywords.forEach(keyword => { keywordsString += '#define ' + keyword + '\n'; });
        return keywordsString + source;
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
    `);

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);
            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;
            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }
            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;
            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `);

    const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform sampler2D uDithering;
        uniform vec2 ditherScale;
        uniform vec2 texelSize;
        vec3 linearToGamma (vec3 color) {
            color = max(color, vec3(0));
            return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
        }
        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
    `;

    const blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        return (target, clear = false) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
    })();

    let dye, velocity, divergence, curl, pressure;
    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function initFramebuffers() {
        let simRes = getResolution(config.SIM_RESOLUTION);
        let dyeRes = getResolution(config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
        gl.disable(gl.BLEND);

        if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
        else dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

        if (!velocity) velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
        else velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

        divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
        gl.activeTexture(gl.TEXTURE0);
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
        let fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return {
            texture, fbo, width: w, height: h,
            texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
            attach(id) {
                gl.activeTexture(gl.TEXTURE0 + id);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                return id;
            }
        };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
        let fbo1 = createFBO(w, h, internalFormat, format, type, param);
        let fbo2 = createFBO(w, h, internalFormat, format, type, param);
        return {
            width: w, height: h,
            texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
            get read() { return fbo1; },
            set read(value) { fbo1 = value; },
            get write() { return fbo2; },
            set write(value) { fbo2 = value; },
            swap() { let temp = fbo1; fbo1 = fbo2; fbo2 = temp; }
        };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
        let newFBO = createFBO(w, h, internalFormat, format, type, param);
        copyProgram.bind();
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
        blit(newFBO);
        return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
        if (target.width === w && target.height === h) return target;
        target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
        target.write = createFBO(w, h, internalFormat, format, type, param);
        target.width = w; target.height = h;
        target.texelSizeX = 1.0 / w; target.texelSizeY = 1.0 / h;
        return target;
    }

    function updateKeywords() {
        let displayKeywords = [];
        if (config.SHADING) displayKeywords.push('SHADING');
        displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function update() {
        const dt = calcDeltaTime();
        if (resizeCanvas()) initFramebuffers();
        updateColors(dt);
        applyInputs();
        step(dt);
        render(null);
        requestAnimationFrame(update);
    }

    function calcDeltaTime() {
        let now = Date.now();
        let dt = (now - lastUpdateTime) / 1000;
        dt = Math.min(dt, 0.016666);
        lastUpdateTime = now;
        return dt;
    }

    function resizeCanvas() {
        let width = scaleByPixelRatio(canvas.clientWidth);
        let height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    function updateColors(dt) {
        colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
            colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
            pointers.forEach(p => { p.color = generateColor(); });
        }
    }

    function applyInputs() {
        pointers.forEach(p => {
            if (p.moved) {
                p.moved = false;
                splatPointer(p);
            }
        });
    }

    function step(dt) {
        gl.disable(gl.BLEND);
        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
        blit(pressure.write);
        pressure.swap();

        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
            blit(pressure.write);
            pressure.swap();
        }

        gradienSubtractProgram.bind();
        gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        let velocityId = velocity.read.attach(0);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
        gl.uniform1f(advectionProgram.uniforms.dt, dt);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write);
        velocity.swap();

        if (!ext.supportLinearFiltering)
            gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write);
        dye.swap();
    }

    function render(target) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        drawDisplay(target);
    }

    function drawDisplay(target) {
        let width = target == null ? gl.drawingBufferWidth : target.width;
        let height = target == null ? gl.drawingBufferHeight : target.height;
        displayMaterial.bind();
        if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
        blit(target);
    }

    function splat(x, y, dx, dy, color) {
        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write);
        dye.swap();
    }

    function correctRadius(radius) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) radius *= aspectRatio;
        return radius;
    }

    function splatPointer(pointer) {
        let dx = pointer.deltaX * config.SPLAT_FORCE;
        let dy = pointer.deltaY * config.SPLAT_FORCE;
        splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function updatePointerMoveData(pointer, posX, posY) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1.0 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function correctDeltaX(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio < 1) delta *= aspectRatio;
        return delta;
    }

    function correctDeltaY(delta) {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) delta /= aspectRatio;
        return delta;
    }

    (function initVerticalScrollNav() {
        if (!ENABLE_VERTICAL_SCROLL || ENABLE_SINGLE_CARD_SCROLL) return; // skip if single-card mode active
        const container = document.getElementById('carouselCylinder');
        if (!container) return;
        const upBtn = document.getElementById('eventsPrevBtn');
        const downBtn = document.getElementById('eventsNextBtn');
        const cards = Array.from(container.querySelectorAll('.event-card-cylinder'));
        let currentIndex = 0;

        function clamp(i){ return Math.max(0, Math.min(cards.length-1, i)); }

        function scrollToIndex(i){
            i = clamp(i);
            currentIndex = i;
            const targetTop = cards[i].offsetTop;
            container.scrollTo({ top: targetTop, behavior: 'smooth' });
        }

        function updateCurrentIndexOnScroll(){
            const scrollTop = container.scrollTop;
            let nearest = 0; let nearestDist = Infinity;
            cards.forEach((card, idx) => {
                const dist = Math.abs(card.offsetTop - scrollTop);
                if (dist < nearestDist){ nearestDist = dist; nearest = idx; }
            });
            currentIndex = nearest;
        }

        if (upBtn) upBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
        if (downBtn) downBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { scrollToIndex(currentIndex - 1); }
            else if (e.key === 'ArrowDown') { scrollToIndex(currentIndex + 1); }
            else if (e.key === 'PageUp') { scrollToIndex(currentIndex - 1); }
            else if (e.key === 'PageDown') { scrollToIndex(currentIndex + 1); }
            else if (e.key === 'Home') { scrollToIndex(0); }
            else if (e.key === 'End') { scrollToIndex(cards.length - 1); }
        });

        let scrollTicking = false;
        container.addEventListener('scroll', () => {
            if (!scrollTicking){
                scrollTicking = true;
                requestAnimationFrame(() => { updateCurrentIndexOnScroll(); scrollTicking = false; });
            }
        });
    })();

    // ============================
    // SINGLE CARD SCROLL MODE
    // ============================
    (function initSingleCardScroll(){
        if(!ENABLE_SINGLE_CARD_SCROLL) return;
        const container = document.getElementById('carouselCylinder');
        if(!container) return;
        const cards = Array.from(container.querySelectorAll('.event-card-cylinder'));
        if(cards.length === 0) return;
        const upBtn = document.getElementById('eventsPrevBtn');
        const downBtn = document.getElementById('eventsNextBtn');
        let currentIndex = 0;

        function setActive(i){
            if(i < 0 || i >= cards.length) return;
            currentIndex = i;
            cards.forEach((card, idx) => {
                const isActive = idx === i;
                card.classList.toggle('active', isActive);
                card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });
            updateArrowState();
        }

        function updateArrowState(){
            if(upBtn) upBtn.disabled = currentIndex === 0;
            if(downBtn) downBtn.disabled = currentIndex === cards.length - 1;
        }

        // Initialize
        setActive(0);

        if(upBtn) upBtn.addEventListener('click', () => setActive(currentIndex - 1));
        if(downBtn) downBtn.addEventListener('click', () => setActive(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') { setActive(currentIndex - 1); }
            else if (e.key === 'ArrowDown') { setActive(currentIndex + 1); }
            else if (e.key === 'Home') { setActive(0); }
            else if (e.key === 'End') { setActive(cards.length - 1); }
        });
    })();
    }

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

