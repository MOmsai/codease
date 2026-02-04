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

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {

    createParticles();
    initContactForm();
    initRegistrationForm();
    initSignInForm();
    loadCourses();

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

