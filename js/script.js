/**
 * Interactive Particle Background - Google Antigravity Style
 * Physics-based particle system with mouse interaction
 */

class AntigravityParticles {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Particle settings
        this.particles = [];
        this.particleCount = this.isMobile() ? 80 : 200;
        
        // Mouse interaction
        this.mouse = {
            x: null,
            y: null,
            radius: 150,
            isPressed: false
        };
        
        // Physics constants - slower, smoother motion
        this.physics = {
            friction: 0.985,
            repulsionForce: 4,
            attractionForce: 0.3,
            returnSpeed: 0.008,
            maxSpeed: 3
        };
        
        // Colors matching the green theme
        this.colors = [
            'rgba(46, 125, 50, 0.8)',
            'rgba(56, 142, 60, 0.8)',
            'rgba(67, 160, 71, 0.8)',
            'rgba(129, 199, 132, 0.6)',
            'rgba(165, 214, 167, 0.7)'
        ];
        
        this.darkColors = [
            'rgba(74, 222, 128, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(22, 163, 74, 0.8)',
            'rgba(134, 239, 172, 0.6)',
            'rgba(187, 247, 208, 0.7)'
        ];
        
        this.init();
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            
            this.particles.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.008,
                mass: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    bindEvents() {
        // Resize handler
        window.addEventListener('resize', () => {
            this.resize();
            // Recalculate particle count on resize
            const newCount = this.isMobile() ? 80 : 200;
            if (newCount !== this.particleCount) {
                this.particleCount = newCount;
                this.createParticles();
            }
        });
        
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Mouse leave
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Mouse press for attraction mode
        window.addEventListener('mousedown', () => {
            this.mouse.isPressed = true;
        });
        
        window.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
        });
        
        // Touch events for mobile
        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.mouse.isPressed = true;
        });
        
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
        });
        
        window.addEventListener('touchend', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.mouse.isPressed = false;
        });
    }
    
    updateParticle(particle) {
        // Natural floating motion
        particle.angle += particle.rotationSpeed;
        
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                
                if (this.mouse.isPressed) {
                    // Attraction mode - pull particles toward cursor
                    particle.vx -= Math.cos(angle) * force * this.physics.attractionForce;
                    particle.vy -= Math.sin(angle) * force * this.physics.attractionForce;
                } else {
                    // Repulsion mode - push particles away from cursor
                    const repulsion = force * this.physics.repulsionForce * particle.mass;
                    particle.vx += Math.cos(angle) * repulsion;
                    particle.vy += Math.sin(angle) * repulsion;
                }
            }
        }
        
        // Return to base position with smooth spring motion
        const dx = particle.baseX - particle.x;
        const dy = particle.baseY - particle.y;
        particle.vx += dx * this.physics.returnSpeed;
        particle.vy += dy * this.physics.returnSpeed;
        
        // Apply friction
        particle.vx *= this.physics.friction;
        particle.vy *= this.physics.friction;
        
        // Limit max speed
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > this.physics.maxSpeed) {
            particle.vx = (particle.vx / speed) * this.physics.maxSpeed;
            particle.vy = (particle.vy / speed) * this.physics.maxSpeed;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
    }
    
    drawParticle(particle) {
        const ctx = this.ctx;
        
        // Calculate rotation based on velocity
        const velocityAngle = Math.atan2(particle.vy, particle.vx);
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        
        // Blend between natural angle and velocity angle based on speed
        const blendFactor = Math.min(speed / 2, 0.5);
        const finalAngle = particle.angle * (1 - blendFactor) + velocityAngle * blendFactor;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(finalAngle);
        
        // Draw small triangle particle
        const size = particle.size;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size * 0.866, size * 0.5);
        ctx.lineTo(size * 0.866, size * 0.5);
        ctx.closePath();
        
        // Subtle glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 6 + speed;
        
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        ctx.restore();
    }
    
    drawConnections() {
        const ctx = this.ctx;
        const connectionDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    ctx.strokeStyle = `rgba(197, 114, 233, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw subtle connections (skip on mobile for performance)
        if (!this.isMobile()) {
            this.drawConnections();
        }
        
        // Update and draw particles
        for (const particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

/**
 * Typing Effect for Role Text
 */
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }
    
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.textContent = this.txt;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

/**
 * Navigation functionality
 */
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile toggle
        this.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                this.closeMenu();
            }
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }
}

/**
 * Smooth scroll for anchor links
 */
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

/**
 * Intersection Observer for scroll animations
 */
class ScrollAnimations {
    constructor() {
        this.animateElements = document.querySelectorAll(
            '.education-card, .skill-category, .project-featured, .about-content, .statement-content'
        );
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.init();
    }
    
    init() {
        this.animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
    
    handleIntersect(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background and store globally
    window.particlesInstance = new AntigravityParticles();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize typing effect
    const typedElement = document.getElementById('typed-role');
    if (typedElement) {
        new TypeWriter(typedElement, [
            'AI/ML Developer',
            'Python Engineer',
            'Deep Learning Specialist',
            'Computer Vision Expert',
            'Problem Solver'
        ], 2000);
    }
    
    // Initialize theme toggle
    initThemeToggle();
});

/**
 * Theme Toggle Functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update particle colors if particles exist
            updateParticleColors(newTheme);
        });
    }
}

/**
 * Update particle colors based on theme
 */
function updateParticleColors(theme) {
    const lightColors = [
        'rgba(46, 125, 50, 0.8)',
        'rgba(56, 142, 60, 0.8)',
        'rgba(67, 160, 71, 0.8)',
        'rgba(129, 199, 132, 0.6)',
        'rgba(165, 214, 167, 0.7)'
    ];
    
    const darkColors = [
        'rgba(74, 222, 128, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(22, 163, 74, 0.8)',
        'rgba(134, 239, 172, 0.6)',
        'rgba(187, 247, 208, 0.7)'
    ];
    
    const colors = theme === 'dark' ? darkColors : lightColors;
    
    // Access the global particles instance if it exists
    if (window.particlesInstance && window.particlesInstance.particles) {
        window.particlesInstance.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
}

// Disable particle effects on mobile for performance (use simplified version)
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.getElementById('particle-canvas').style.display = 'none';
}
