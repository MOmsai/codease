// ==============================================
// PARTICLES ANIMATION
// ==============================================
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 15}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// ==============================================
// MOBILE NAVIGATION
// ==============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ==============================================
// PARALLAX EFFECT ON SCROLL
// ==============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// ==============================================
// MAGNETIC BUTTON EFFECT
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
});

// ==============================================
// VALIDATION HELPERS
// ==============================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
}

function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

// ==============================================
// UI MESSAGE HELPERS
// ==============================================
function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.className = 'message-popup success';
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #10b981, #34d399);
        color: #fff;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-weight: 600;
        font-size: 1.2rem;
        text-align: center;
        max-width: 90%;
        animation: successPop 0.5s ease-out forwards;
    `;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.animation = 'successPop 0.3s ease-in reverse';
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

function showErrorMessage(message) {
    const div = document.createElement('div');
    div.className = 'message-popup error';
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #ef4444, #f87171);
        color: #fff;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(239, 68, 68, 0.4);
        z-index: 10000;
        font-weight: 600;
        font-size: 1.2rem;
        text-align: center;
        max-width: 90%;
        animation: successPop 0.5s ease-out forwards;
    `;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.animation = 'successPop 0.3s ease-in reverse';
        setTimeout(() => div.remove(), 300);
    }, 2500);
}

function showLoadingSpinner(show = true) {
    let spinner = document.getElementById('loading-spinner');
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            spinner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                border: 4px solid rgba(99, 102, 241, 0.2);
                border-top-color: #6366f1;
                border-radius: 50%;
                z-index: 10000;
                animation: spin 1s linear infinite;
            `;
            document.body.appendChild(spinner);
        }
    } else {
        if (spinner) {
            spinner.remove();
        }
    }
}

// ==============================================
// CONFETTI EFFECT
// ==============================================
function createConfetti() {
    const colors = ['#60a5fa', '#3b82f6', '#1e40af', '#10b981', '#34d399'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10001;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ==============================================
// COURSES MANAGEMENT
// ==============================================
async function loadCourses() {
    const checkboxContainer = document.getElementById('coursesCheckboxes');
    if (!checkboxContainer) return;

    try {
        const res = await fetch('http://localhost:5000/api/courses');
        
        if (!res.ok) {
            throw new Error('Failed to load courses');
        }
        
        const courses = await res.json();

        checkboxContainer.innerHTML = '';
        
        // Course descriptions
        const courseDescriptions = {
            'Web Application Development': 'Build modern, responsive web applications',
            'Front-End Development': 'Master HTML, CSS, JavaScript & frameworks',
            'Backend & API Development': 'Create robust server-side applications',
            'Full-Stack Development': 'Complete end-to-end web development',
            'Full-Stack MERN': 'MongoDB, Express, React, Node.js stack',
            'AI with Data Science': 'Machine learning and data analysis',
            'DevOps Engineering': 'CI/CD, containerization & cloud automation',
            'Software Testing': 'QA, automated testing & test-driven development'
        };

        // Course icons
        const courseIcons = {
            'Web Application Development': 'fa-globe',
            'Front-End Development': 'fa-paint-brush',
            'Backend & API Development': 'fa-server',
            'Full-Stack Development': 'fa-layer-group',
            'Full-Stack MERN': 'fa-code-branch',
            'AI with Data Science': 'fa-brain',
            'DevOps Engineering': 'fa-infinity',
            'Software Testing': 'fa-check-circle'
        };
        
        courses.forEach(course => {
            const item = document.createElement('div');
            item.className = 'course-checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `course-${course.id}`;
            checkbox.value = course.id;
            checkbox.name = 'courses';
            
            const icon = document.createElement('i');
            icon.className = `fas ${courseIcons[course.course_name] || 'fa-code'} course-checkbox-icon`;
            
            const label = document.createElement('label');
            label.className = 'course-checkbox-label';
            label.htmlFor = `course-${course.id}`;
            
            const name = document.createElement('div');
            name.className = 'course-checkbox-name';
            name.textContent = course.course_name;
            
            const desc = document.createElement('div');
            desc.className = 'course-checkbox-desc';
            desc.textContent = courseDescriptions[course.course_name] || course.description || 'Professional training program';
            
            label.appendChild(name);
            label.appendChild(desc);
            
            item.appendChild(checkbox);
            item.appendChild(icon);
            item.appendChild(label);
            
            // Add click handler for the entire item
            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            
            // Add change handler for checkbox
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
            
            checkboxContainer.appendChild(item);
        });

        console.log('Courses loaded successfully:', courses);

    } catch (err) {
        console.error('Error loading courses:', err);
        checkboxContainer.innerHTML = '<p style="color: #ef4444;">Failed to load courses. Please refresh the page.</p>';
    }
}

// ==============================================
// REGISTRATION FORM HANDLER (FIXED)
// ==============================================
function initRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    // Real-time password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            let strengthText = '';
            let strengthColor = '';
            
            // Remove existing strength indicator
            const existingIndicator = document.querySelector('.password-strength');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            if (this.value.length > 0) {
                switch(strength) {
                    case 0:
                    case 1:
                        strengthText = 'Weak';
                        strengthColor = '#ef4444';
                        break;
                    case 2:
                    case 3:
                        strengthText = 'Medium';
                        strengthColor = '#f59e0b';
                        break;
                    case 4:
                    case 5:
                        strengthText = 'Strong';
                        strengthColor = '#10b981';
                        break;
                }
                
                const indicator = document.createElement('div');
                indicator.className = 'password-strength';
                indicator.style.cssText = `
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    color: ${strengthColor};
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-align: center;
                    animation: slideIn 0.3s ease-out;
                `;
                indicator.textContent = `Password Strength: ${strengthText}`;
                passwordInput.parentElement.appendChild(indicator);
            }
        });
    }

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const termsCheckbox = document.getElementById('terms');

        // Get selected courses from checkboxes
        const selectedCourses = Array.from(document.querySelectorAll('input[name="courses"]:checked'))
            .map(checkbox => checkbox.value)
            .filter(val => val && val !== '');

        // Validation: Check required fields
        if (!fullname || !email || !password || !confirmPassword) {
            showErrorMessage('Please fill in all required fields');
            return;
        }

        // Validation: Full name
        if (fullname.length < 3) {
            showErrorMessage('Full name must be at least 3 characters long');
            return;
        }

        // Validation: Email
        if (!validateEmail(email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }

        // Validation: Phone (optional but validate if provided)
        if (phone && !validatePhone(phone)) {
            showErrorMessage('Please enter a valid phone number');
            return;
        }

        // Validation: Password match
        if (password !== confirmPassword) {
            showErrorMessage('Passwords do not match!');
            return;
        }

        // Validation: Password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            showErrorMessage(passwordValidation.errors[0]);
            return;
        }

        // Validation: Course selection
        if (selectedCourses.length === 0) {
            showErrorMessage('Please select at least one course');
            return;
        }

        // Validation: Terms and conditions
        if (termsCheckbox && !termsCheckbox.checked) {
            showErrorMessage('Please accept the Terms & Privacy Policy');
            return;
        }

        showLoadingSpinner(true);

        try {
            // Step 1: Register the user
            const registerRes = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullname,
                    email: email,
                    phone: phone || '',
                    password: password
                })
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                showLoadingSpinner(false);
                showErrorMessage(registerData.message || 'Registration failed. Please try again.');
                return;
            }

            // Step 2: Enroll user in selected courses
            const userId = registerData.user_id;

            if (userId && selectedCourses.length > 0) {
                const enrollRes = await fetch('http://localhost:5000/api/registrations', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        course_ids: selectedCourses
                    })
                });

                const enrollData = await enrollRes.json();

                if (!enrollRes.ok) {
                    console.error('Course enrollment failed:', enrollData);
                    showLoadingSpinner(false);
                    showErrorMessage('Account created but course enrollment failed. Please contact support.');
                    return;
                }
            }

            showLoadingSpinner(false);
            showSuccessMessage('Welcome to Codease! Your account has been created successfully.');
            createConfetti();
            registerForm.reset();
            
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);

        } catch (err) {
            showLoadingSpinner(false);
            console.error('Registration error:', err);
            showErrorMessage('Server error. Please try again later.');
        }
    });
}

// ==============================================
// SIGN IN FORM HANDLER
// ==============================================
function initSignInForm() {
    const signinForm = document.getElementById('signinForm');
    if (!signinForm) return;

    signinForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;
        const remember = document.getElementById('remember')?.checked;

        if (!email || !password) {
            showErrorMessage('Please enter both email and password');
            return;
        }

        if (!validateEmail(email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }

        showLoadingSpinner(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await res.json();
            
            showLoadingSpinner(false);

            if (!res.ok) {
                showErrorMessage(data.message || 'Login failed. Please check your credentials.');
                return;
            }

            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Store user data for dashboard
            const userData = {
                user_id: data.user_id,
                full_name: data.full_name,
                email: data.email,
                created_at: new Date().toISOString()
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            showSuccessMessage('Welcome back! Redirecting to dashboard...');
            
            setTimeout(() => {
                window.location.href = data.redirect || 'dashboard.html';
            }, 1500);

        } catch (err) {
            showLoadingSpinner(false);
            console.error('Login error:', err);
            showErrorMessage('Server error. Please try again later.');
        }
    });
}

// ==============================================
// CONTACT FORM HANDLER
// ==============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim();
        const lastname = document.getElementById('lastname')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const subject = document.getElementById('subject')?.value;
        const message = document.getElementById('message')?.value.trim();
        
        // Validation
        if (!name || !lastname || !email || !subject || !message) {
            showErrorMessage('Please fill in all required fields');
            return;
        }

        if (!validateEmail(email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }

        if (phone && !validatePhone(phone)) {
            showErrorMessage('Please enter a valid phone number');
            return;
        }

        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(135deg, #60a5fa, #a78bfa)';
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    lastname,
                    email,
                    phone,
                    subject,
                    message
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            // Success
            submitBtn.textContent = '✓ Sent Successfully!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            
            showSuccessMessage('Thank you! We will get back to you soon. Check your email for confirmation.');
            createConfetti(); // Add confetti effect
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))';
            }, 3000);

        } catch (error) {
            console.error('Contact form error:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))';
            
            showErrorMessage(error.message || 'Failed to send message. Please try again or contact us directly.');
        }
    });
}

// ==============================================
// CARD HOVER 3D EFFECT
// ==============================================
function init3DCardEffect() {
    document.querySelectorAll('.feature-card, .service-card, .service-detail-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==============================================
// STATS COUNTER ANIMATION
// ==============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const suffix = element.dataset.suffix || '+';
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Stats Bar Counter Animation
function initStatsCounter() {
    const statsBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number-bar');
                statNumbers.forEach(stat => {
                    if (stat.classList.contains('stat-number-bar-static')) return;
                    const target = parseInt(stat.dataset.count);
                    if (isNaN(target)) return;
                    animateCounter(stat, target, 2000);
                });
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.3 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsBarObserver.observe(statsBar);
    }

    // Regular stat cards
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const number = entry.target.querySelector('.stat-number');
                if (number) {
                    const targetValue = parseInt(number.textContent.replace(/[^0-9]/g, ''));
                    const suffix = number.textContent.replace(/[0-9]/g, '');
                    animateCounter(number, targetValue);
                    setTimeout(() => {
                        number.textContent = targetValue + suffix;
                    }, 2100);
                    entry.target.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        statObserver.observe(card);
    });
}

// ==============================================
// IMAGE SLIDESHOW FOR SERVICES PAGE
// ==============================================
function initSlideshows() {
    document.querySelectorAll(".slideshow").forEach(slider => {
        const prefix = slider.dataset.prefix;
        const total = 4;
        let index = 0;
        let slides = [];

        // Create images
        for (let i = 1; i <= total; i++) {
            const img = document.createElement("img");
            img.src = `assets/${prefix}_${String(i).padStart(2, "0")}.jpeg`;
            if (i === 1) img.classList.add("active");
            slider.appendChild(img);
            slides.push(img);
        }

        // Buttons
        const prev = document.createElement("button");
        prev.className = "slide-btn prev";
        prev.innerHTML = "&#10094;";

        const next = document.createElement("button");
        next.className = "slide-btn next";
        next.innerHTML = "&#10095;";

        slider.append(prev, next);

        function show(newIndex, direction) {
            slides[index].classList.remove("active");
            slides[index].classList.add("exit-left");

            slides[newIndex].classList.remove("exit-left");
            slides[newIndex].classList.add("active");

            setTimeout(() => {
                slides[index].classList.remove("exit-left");
                index = newIndex;
            }, 800);
        }

        function nextSlide() {
            const newIndex = (index + 1) % total;
            show(newIndex, "next");
        }

        function prevSlide() {
            const newIndex = (index - 1 + total) % total;
            show(newIndex, "prev");
        }

        next.onclick = () => { nextSlide(); reset(); };
        prev.onclick = () => { prevSlide(); reset(); };

        let timer = setInterval(nextSlide, 3000);

        function reset() {
            clearInterval(timer);
            timer = setInterval(nextSlide, 3000);
        }
    });
}

// ==============================================
// SMOOTH SCROLLING
// ==============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==============================================
// ACTIVE NAV LINK
// ==============================================
function setActiveNavLink() {
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentLocation) {
            link.classList.add('active');
        }
    });
}

// // ==============================================
// // CURSOR TRAIL EFFECT (DESKTOP ONLY)
// // ==============================================
// function initCursorTrail() {
//     let cursorTrail = [];
//     const maxTrailLength = 10;

//     document.addEventListener('mousemove', (e) => {
//         if (window.innerWidth > 768) {
//             const trail = document.createElement('div');
//             trail.style.cssText = `
//                 position: fixed;
//                 width: 8px;
//                 height: 8px;
//                 background: radial-gradient(circle, rgba(96, 165, 250, 0.6), transparent);
//                 border-radius: 50%;
//                 pointer-events: none;
//                 z-index: 9999;
//                 left: ${e.clientX - 4}px;
//                 top: ${e.clientY - 4}px;
//                 animation: trailFade 1s ease-out forwards;
//             `;
//             document.body.appendChild(trail);
            
//             cursorTrail.push(trail);
            
//             if (cursorTrail.length > maxTrailLength) {
//                 const oldTrail = cursorTrail.shift();
//                 oldTrail.remove();
//             }
            
//             setTimeout(() => trail.remove(), 1000);
//         }
//     });
// }

// ==============================================
// LAZY LOADING IMAGES
// ==============================================
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==============================================
// SECTION REVEAL ON SCROLL
// ==============================================
function initSectionReveal() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset + window.innerHeight;
        
        sections.forEach(section => {
            if (scrollPosition > section.offsetTop + 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    });
}

// ==============================================
// DYNAMIC ANIMATIONS STYLESHEET
// ==============================================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                top: 100vh;
                opacity: 0;
                transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
            }
        }
        
        @keyframes successPop {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        @keyframes trailFade {
            to {
                opacity: 0;
                transform: scale(0);
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-100px) translateX(50px);
                opacity: 0.8;
            }
        }

        @keyframes spin {
            0% {
                transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    addAnimationStyles();
    
    // Initialize particles animation
    createParticles();
    
    // Load courses dropdown
    loadCourses();
    
    // Initialize forms
    initRegistrationForm();
    initSignInForm();
    initContactForm();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Initialize slideshows (for services page)
    initSlideshows();
    
    // Initialize 3D card effects
    init3DCardEffect();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Set active nav link
    setActiveNavLink();
    
    // Initialize cursor trail (desktop only)
    initCursorTrail();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize section reveal
    initSectionReveal();
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .service-detail-card, .stat-card, .about-content, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    console.log('✅ All features initialized successfully!');
});

// Load particles on window load as backup
window.addEventListener('load', () => {
    if (!document.getElementById('particles-container')) {
        createParticles();
    }
});