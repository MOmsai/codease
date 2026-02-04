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
        `;
        particlesContainer.appendChild(particle);
    }
}

// ==============================================
// VALIDATION HELPERS
// ==============================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.length >= 10;
}

// ==============================================
// UI MESSAGE HELPERS
// ==============================================
function showSuccessMessage(message) {
    alert(message);
}

function showErrorMessage(message) {
    alert(message);
}

// ==============================================
// CONTACT FORM HANDLER
// ==============================================
function initContactForm() {

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {

        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !lastname || !email || !subject || !message) {
            return showErrorMessage('Please fill all fields');
        }

        if (!validateEmail(email)) {
            return showErrorMessage('Invalid email');
        }

        try {

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    lastname,
                    email,
                    phone,
                    subject,
                    message
                })
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(text);
            }

            if (!response.ok) {
                throw new Error(data.message || "Server Error");
            }

            showSuccessMessage("Message sent successfully!");
            contactForm.reset();

        } catch (error) {
            console.error(error);
            showErrorMessage(error.message);
        }

    });
}

// ==============================================
// REGISTRATION
// ==============================================
function initRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullname,
                    email,
                    phone,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            showSuccessMessage('Registration Successful');
            registerForm.reset();

        } catch (err) {
            showErrorMessage(err.message);
        }
    });
}

// ==============================================
// LOGIN
// ==============================================
function initSignInForm() {
    const signinForm = document.getElementById('signinForm');
    if (!signinForm) return;

    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);

            showSuccessMessage('Login Successful');

        } catch (err) {
            showErrorMessage(err.message);
        }
    });
}

// ==============================================
// LOAD COURSES
// ==============================================
async function loadCourses() {
    const container = document.getElementById('coursesCheckboxes');
    if (!container) return;

    try {
        const res = await fetch('/api/courses');
        const courses = await res.json();

        container.innerHTML = '';

        courses.forEach(course => {
            const div = document.createElement('div');
            div.innerHTML = `
                <input type="checkbox" value="${course.id}">
                ${course.course_name}
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

function animateCounter(element, target, suffix = "", duration = 2000) {

    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {

        start += increment;

        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }

    }, 16);
}

function initStatsCounter() {

    const statElements = document.querySelectorAll('[data-count]');

    statElements.forEach(stat => {

        const target = parseInt(stat.dataset.count);
        const suffix = stat.dataset.suffix || "";

        animateCounter(stat, target, suffix);
    });
}


function initMobileNavbar() {

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {

        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-menu a').forEach(link => {

        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });

    });
}


// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {

    createParticles();
    initContactForm();
    initRegistrationForm();
    initSignInForm();
    loadCourses();
     initSlideshows(); 
    initStatsCounter();
    initMobileNavbar();


    console.log('All Features Loaded');
});

// ==============================================
// IMAGE SLIDESHOW FOR SERVICES PAGE
// ==============================================
function initSlideshows() {
    document.querySelectorAll(".slideshow").forEach(slider => {

        const prefix = slider.dataset.prefix;
        const total = 4;
        let index = 0;
        let slides = [];

        for (let i = 1; i <= total; i++) {

            const img = document.createElement("img");

            img.src = `/assets/${prefix}_${String(i).padStart(2, "0")}.jpeg`;

            if (i === 1) img.classList.add("active");

            slider.appendChild(img);
            slides.push(img);
        }

        const prev = document.createElement("button");
        prev.className = "slide-btn prev";
        prev.innerHTML = "&#10094;";

        const next = document.createElement("button");
        next.className = "slide-btn next";
        next.innerHTML = "&#10095;";

        slider.append(prev, next);

        function show(newIndex) {
            slides[index].classList.remove("active");
            slides[newIndex].classList.add("active");
            index = newIndex;
        }

        function nextSlide() {
            show((index + 1) % total);
        }

        function prevSlide() {
            show((index - 1 + total) % total);
        }

        next.onclick = nextSlide;
        prev.onclick = prevSlide;

        setInterval(nextSlide, 3000);
    });
}

