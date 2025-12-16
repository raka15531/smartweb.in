/**
 * NextGen Web Solutions - Main JavaScript File
 * Complete functionality with mobile scrolling fixes
 * @version 2.1.0
 */

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NextGen Web Solutions Initialized');
    
    // Initialize mobile fixes first
    initMobileFixes();
    
    // Initialize all components
    initThreeJS();
    initThemeSwitcher();
    initMobileMenu();
    initChatbot();
    initSmoothScroll();
    initFormValidation();
    initScrollAnimations();
    initWhatsAppButton();
    initCurrentYear();
    initGoogleAnalytics();
    initServiceFilters();
    initTestimonialSlider();
    
    // Initialize SEO tracking
    initSEOTracking();
});

/**
 * ============================================
 * MOBILE SCROLLING FIXES - ADDED FIRST
 * ============================================
 */
function initMobileFixes() {
    console.log('📱 Initializing mobile fixes...');
    
    // Fix for iOS 100vh issue
    function fixViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        console.log('📏 Viewport height fixed:', vh);
    }
    
    // Set initial viewport height
    fixViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', function() {
        setTimeout(fixViewportHeight, 100);
    });
    
    // Prevent iOS bounce/overscroll
    document.body.addEventListener('touchmove', function(e) {
        // Allow scrolling in scrollable elements
        if (e.target.classList.contains('scrollable') || 
            e.target.closest('.scrollable')) {
            return;
        }
        
        // Prevent bounce on body
        if (document.body.scrollTop === 0) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Fix for iOS safari 100vh issue with address bar
    window.addEventListener('load', fixViewportHeight);
    
    // Fix for mobile keyboard pushing content
    if ('visualViewport' in window) {
        const visualViewport = window.visualViewport;
        
        visualViewport.addEventListener('resize', function() {
            // Adjust fixed elements when keyboard appears
            const fixedElements = document.querySelectorAll('.header, .whatsapp-float, .chatbot-toggle, .theme-switcher');
            fixedElements.forEach(el => {
                el.style.transform = `translateY(${visualViewport.offsetTop}px)`;
            });
        });
    }
    
    // Enable smooth scrolling on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Prevent zoom on double tap (only for non-input elements)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            // Don't prevent zoom on inputs
            if (!event.target.matches('input, textarea, select, [contenteditable="true"]')) {
                event.preventDefault();
            }
        }
        lastTouchEnd = now;
    }, false);
    
    console.log('✅ Mobile fixes initialized');
}

/**
 * ============================================
 * THREE.JS PARTICLE BACKGROUND
 * ============================================
 */
function initThreeJS() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded. Skipping particle background.');
        return;
    }

    const canvasContainer = document.getElementById('particles-canvas');
    if (!canvasContainer) return;

    try {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);

        // Blue theme particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = window.innerWidth < 768 ? 800 : 1500;
        const posArray = new Float32Array(particlesCount * 3);

        // Create random particle positions
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Get theme for particle color
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        const particleColor = isDarkTheme ? 0x4dabff : 0x007bff;

        // Particle material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: particleColor,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        // Create particles mesh
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Camera position
        camera.position.z = 5;

        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        let mouseMoved = false;

        document.addEventListener('mousemove', (event) => {
            mouseMoved = true;
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Touch support for mobile
        document.addEventListener('touchmove', (event) => {
            mouseMoved = true;
            const touch = event.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            event.preventDefault();
        }, { passive: false });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate particles
            particlesMesh.rotation.x += 0.0003;
            particlesMesh.rotation.y += 0.0003;
            
            // Mouse interaction
            if (mouseMoved) {
                particlesMesh.rotation.y += mouseX * 0.0003;
                particlesMesh.rotation.x += mouseY * 0.0003;
                
                // Reset mouse effect slowly
                mouseX *= 0.95;
                mouseY *= 0.95;
                
                if (Math.abs(mouseX) < 0.001 && Math.abs(mouseY) < 0.001) {
                    mouseMoved = false;
                }
            }
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Update particle color on theme change
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            particlesMaterial.color.setHex(isDark ? 0x4dabff : 0x007bff);
        }

        window.addEventListener('resize', debounce(onWindowResize, 250));
        
        // Watch for theme changes
        const observer = new MutationObserver(() => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            particlesMaterial.color.setHex(isDark ? 0x4dabff : 0x007bff);
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
        
        // Start animation
        animate();
        
        console.log('✅ Three.js Particle Background Initialized');
    } catch (error) {
        console.error('❌ Three.js initialization failed:', error);
    }
}

/**
 * ============================================
 * THEME SWITCHER
 * ============================================
 */
function initThemeSwitcher() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    try {
        // Check for saved theme or prefer-color-scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('nextgen-theme') || (prefersDark ? 'dark' : 'light');
        
        // Apply saved theme
        document.body.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Update theme with smooth transition
            document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('nextgen-theme', newTheme);
            
            // Track theme change
            trackEvent('theme_change', newTheme);
            
            // Remove transition after animation
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
            
            console.log(`Theme changed to: ${newTheme}`);
        });
        
        console.log('✅ Theme Switcher Initialized');
    } catch (error) {
        console.error('❌ Theme switcher failed:', error);
    }
}

/**
 * ============================================
 * MOBILE MENU - UPDATED FOR SCROLLING
 * ============================================
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!menuToggle || !navLinks) return;

    try {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (navLinks.classList.contains('active')) {
                // Close menu
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto'; // Re-enable scrolling
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                // Open menu
                navLinks.classList.add('active');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                body.style.overflow = 'hidden'; // Prevent body scrolling
                menuToggle.setAttribute('aria-expanded', 'true');
            }
            
            // Track menu toggle
            trackEvent('menu_toggle', navLinks.classList.contains('active') ? 'open' : 'close');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
                menuToggle.setAttribute('aria-expanded', 'false');
                trackEvent('nav_click', link.textContent.trim());
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = 'auto';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        console.log('✅ Mobile Menu Initialized');
    } catch (error) {
        console.error('❌ Mobile menu failed:', error);
    }
}

/**
 * ============================================
 * CHATBOT
 * ============================================
 */
function initChatbot() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const sendButton = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const messagesContainer = document.querySelector('.chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    if (!chatbotToggle || !chatbotContainer) return;

    try {
        // Chatbot responses database
        const responses = {
            'pricing': 'We offer packages starting from ₹4,999 for basic websites up to ₹45,000+ for custom applications. Check our pricing section for details! Would you like me to help you choose the right package?',
            'development time': 'Basic websites take 5-7 days, e-commerce sites 10-15 days, and custom applications 3-4 weeks depending on requirements. We provide regular updates throughout the process.',
            'support': 'Yes! We provide lifetime after-sales support for all our packages. You can reach us anytime on WhatsApp for immediate assistance.',
            'india coverage': 'We serve clients across all of India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, and 50+ other cities. Where are you located?',
            'payment': 'We accept multiple payment methods including UPI, bank transfer, credit/debit cards, and online payment gateways. We require 50% advance to start the project.',
            'portfolio': 'You can view our portfolio at https://nextgenwebsolutions.in/portfolio-india.html. We have worked with 500+ clients across India.',
            'contact': 'You can contact us via WhatsApp at +91 95993 72553, email at akashsing1553@gmail.com, or call us anytime between 9 AM to 9 PM.',
            'default': 'I can help with pricing, development timelines, support queries, and general information about our services. What would you like to know? You can also visit our website for detailed information.'
        };

        // Open/close chatbot
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            chatbotToggle.style.opacity = '0';
            chatbotToggle.style.pointerEvents = 'none';
            trackEvent('chatbot_open', 'manual');
        });
        
        if (chatbotClose) {
            chatbotClose.addEventListener('click', () => {
                chatbotContainer.classList.remove('active');
                chatbotToggle.style.opacity = '1';
                chatbotToggle.style.pointerEvents = 'auto';
                trackEvent('chatbot_close', 'manual');
            });
        }

        // Send message function
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate typing delay
            setTimeout(() => {
                hideTypingIndicator();
                
                // Find appropriate response
                let response = responses.default;
                const lowerMessage = message.toLowerCase();
                
                if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('₹')) {
                    response = responses.pricing;
                } else if (lowerMessage.includes('time') || lowerMessage.includes('delivery') || lowerMessage.includes('duration')) {
                    response = responses['development time'];
                } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
                    response = responses.support;
                } else if (lowerMessage.includes('india') || lowerMessage.includes('city') || lowerMessage.includes('location')) {
                    response = responses['india coverage'];
                } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('advance')) {
                    response = responses.payment;
                } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('project')) {
                    response = responses.portfolio;
                } else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
                    response = responses.contact;
                }
                
                addMessage(response, 'bot');
                trackEvent('chatbot_message', 'user_query');
            }, 1000 + Math.random() * 1000);
        }

        // Add message to chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing';
            typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            typingDiv.id = 'typingIndicator';
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Send button click
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }

        // Enter key in input
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }

        // Quick questions
        quickQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                if (chatInput) {
                    chatInput.value = question;
                    sendMessage();
                }
                trackEvent('chatbot_quick_question', question);
            });
        });

        // Auto-open chatbot after 30 seconds on homepage
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            setTimeout(() => {
                if (!chatbotContainer.classList.contains('active')) {
                    addMessage('Hi! I\'m your NextGen assistant. Need help with website development? Ask me anything!', 'bot');
                    trackEvent('chatbot_auto_open', 'homepage');
                }
            }, 30000);
        }
        
        console.log('✅ Chatbot Initialized');
    } catch (error) {
        console.error('❌ Chatbot failed:', error);
    }
}

/**
 * ============================================
 * SMOOTH SCROLL - MOBILE FIXED
 * ============================================
 */
function initSmoothScroll() {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const extraOffset = window.innerWidth <= 768 ? 20 : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - extraOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Track internal link clicks
                    trackEvent('smooth_scroll', targetId);
                }
            });
        });
        
        console.log('✅ Smooth Scroll Initialized');
    } catch (error) {
        console.error('❌ Smooth scroll failed:', error);
    }
}

/**
 * ============================================
 * FORM VALIDATION
 * ============================================
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[id]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Skip if form already has Formspree action
            if (this.action.includes('formspree.io')) return;
            
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    field.classList.remove('error');
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showFormError(field, 'Please enter a valid email address');
                    }
                }
                
                // Phone validation
                if (field.type === 'tel' && field.value.trim()) {
                    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
                    if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                        isValid = false;
                        field.classList.add('error');
                        showFormError(field, 'Please enter a valid phone number');
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                
                // Scroll to first invalid field
                if (firstInvalidField) {
                    firstInvalidField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    firstInvalidField.focus();
                }
                
                showFormMessage('Please fill all required fields correctly', 'error');
                trackEvent('form_validation_failed', form.id);
                return false;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Reset after 5 seconds if form doesn't submit
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
            
            trackEvent('form_submit', form.id);
            return true;
        });
        
        // Real-time validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    });
    
    console.log('✅ Form Validation Initialized');
}

// Show form error message
function showFormError(field, message) {
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Show form message
function showFormMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    });
}

/**
 * ============================================
 * SCROLL ANIMATIONS
 * ============================================
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    try {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Track element visibility
                    const elementType = entry.target.classList[0] || entry.target.tagName.toLowerCase();
                    trackEvent('element_view', elementType);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.service-card, .price-card, .why-card, .highlight-item, .portfolio-item, .testimonial-card, .city-card, .industry-card').forEach(el => {
            observer.observe(el);
        });
        
        console.log('✅ Scroll Animations Initialized');
    } catch (error) {
        console.error('❌ Scroll animations failed:', error);
    }
}

/**
 * ============================================
 * WHATSAPP BUTTON
 * ============================================
 */
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (!whatsappButton) return;

    try {
        // Track WhatsApp clicks
        whatsappButton.addEventListener('click', () => {
            trackEvent('whatsapp_click', 'floating_button');
            trackConversion('whatsapp_conversion');
        });
        
        // Show/hide based on scroll
        let lastScrollTop = 0;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 500;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > heroHeight / 2 && scrollTop > lastScrollTop) {
                // Scrolling down past half hero
                whatsappButton.style.transform = 'translateY(100px)';
            } else {
                // Scrolling up or in hero section
                whatsappButton.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        console.log('✅ WhatsApp Button Initialized');
    } catch (error) {
        console.error('❌ WhatsApp button failed:', error);
    }
}

/**
 * ============================================
 * CURRENT YEAR
 * ============================================
 */
function initCurrentYear() {
    try {
        const yearElements = document.querySelectorAll('#currentYear');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
        
        console.log('✅ Current Year Updated');
    } catch (error) {
        console.error('❌ Current year update failed:', error);
    }
}

/**
 * ============================================
 * SERVICE FILTERS
 * ============================================
 */
function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.service-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!filterButtons.length || !serviceCards.length) return;

    try {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter service cards
                serviceCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                trackEvent('service_filter', filterValue);
            });
        });
        
        console.log('✅ Service Filters Initialized');
    } catch (error) {
        console.error('❌ Service filters failed:', error);
    }
}

/**
 * ============================================
 * TESTIMONIAL SLIDER
 * ============================================
 */
function initTestimonialSlider() {
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (!sliderContainer) return;

    try {
        const slides = sliderContainer.querySelectorAll('.testimonial-card');
        const prevBtn = sliderContainer.querySelector('.slider-prev');
        const nextBtn = sliderContainer.querySelector('.slider-next');
        const dotsContainer = sliderContainer.querySelector('.slider-dots');
        
        if (slides.length < 2) return;
        
        let currentSlide = 0;
        
        // Create dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
                slide.classList.toggle('active', index === currentSlide);
            });
            
            // Update dots
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            
            trackEvent('testimonial_slide', currentSlide + 1);
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto slide every 5 seconds
        let autoSlideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        console.log('✅ Testimonial Slider Initialized');
    } catch (error) {
        console.error('❌ Testimonial slider failed:', error);
    }
}

/**
 * ============================================
 * GOOGLE ANALYTICS
 * ============================================
 */
function initGoogleAnalytics() {
    // This is a placeholder for Google Analytics
    // Replace with your actual GA4 measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    if (typeof gtag !== 'undefined') {
        gtag('config', GA_MEASUREMENT_ID);
        console.log('✅ Google Analytics Initialized');
    } else {
        console.log('⚠️ Google Analytics not loaded');
    }
}

/**
 * ============================================
 * SEO TRACKING
 * ============================================
 */
function initSEOTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`📊 Page loaded in ${loadTime}ms`);
            
            // Send to analytics if needed
            if (typeof gtag !== 'undefined' && loadTime > 0) {
                gtag('event', 'performance_metric', {
                    'event_category': 'performance',
                    'event_label': 'page_load',
                    'value': loadTime
                });
            }
        }
    });
    
    // Track time on page
    let pageLoadTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - pageLoadTime;
        console.log(`⏱️ Time spent on page: ${Math.round(timeSpent / 1000)} seconds`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_spent', {
                'event_category': 'engagement',
                'event_label': 'page_time',
                'value': Math.round(timeSpent / 1000)
            });
        }
    });
    
    // Track clicks on service links
    document.querySelectorAll('.service-card, .price-card .btn, .city-link, .industry-link').forEach(element => {
        element.addEventListener('click', () => {
            const elementType = element.classList.contains('service-card') ? 'service_card' :
                              element.classList.contains('btn') ? 'price_button' :
                              element.classList.contains('city-link') ? 'city_link' :
                              'industry_link';
            
            trackEvent('service_click', elementType);
        });
    });
    
    console.log('✅ SEO Tracking Initialized');
}

/**
 * ============================================
 * EVENT TRACKING
 * ============================================
 */
function trackEvent(action, label = '', value = null) {
    console.log(`📈 Event: ${action}, Label: ${label}, Value: ${value}`);
    
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'engagement',
            'event_label': label,
            'value': value
        });
    }
    
    // Store in localStorage for offline tracking
    try {
        const events = JSON.parse(localStorage.getItem('nextgen_events') || '[]');
        events.push({
            action,
            label,
            value,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        
        // Keep only last 100 events
        localStorage.setItem('nextgen_events', JSON.stringify(events.slice(-100)));
    } catch (error) {
        console.error('Event storage failed:', error);
    }
}

function trackConversion(type) {
    trackEvent('conversion', type);
    
    // Store conversion
    try {
        const conversions = JSON.parse(localStorage.getItem('nextgen_conversions') || '[]');
        conversions.push({
            type,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        
        localStorage.setItem('nextgen_conversions', JSON.stringify(conversions.slice(-50)));
    } catch (error) {
        console.error('Conversion storage failed:', error);
    }
}

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

// Debounce function for resize events
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

// Throttle function for scroll events
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

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Get current page URL
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

/**
 * ============================================
 * ERROR HANDLING
 * ============================================
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    // Send to error tracking service if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': event.error?.message || 'Unknown error',
            'fatal': true
        });
    }
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/**
 * ============================================
 * PERFORMANCE OPTIMIZATION
 * ============================================
 */
// Optimize images on load
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(img);
    });
}

// Initialize image optimization
if (document.readyState === 'complete') {
    optimizeImages();
} else {
    window.addEventListener('load', optimizeImages);
}

/**
 * ============================================
 * SERVICE WORKER REGISTRATION
 * ============================================
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('✅ ServiceWorker registered:', registration);
        }).catch(err => {
            console.log('❌ ServiceWorker registration failed:', err);
        });
    });
}

/**
 * ============================================
 * OFFLINE DETECTION
 * ============================================
 */
window.addEventListener('offline', () => {
    console.log('⚠️ You are offline');
    showFormMessage('You are currently offline. Some features may not work.', 'warning');
});

window.addEventListener('online', () => {
    console.log('✅ You are back online');
    showFormMessage('You are back online!', 'success');
});

console.log('🎉 All JavaScript components loaded successfully!');
