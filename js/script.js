// Navegación móvil
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.classList.toggle('nav-open');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.classList.remove('nav-open');
}

navToggle.addEventListener('click', toggleMobileMenu);

// Cerrar menú al hacer click en el overlay
navOverlay.addEventListener('click', closeMobileMenu);

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Cerrar menú al presionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animaciones on scroll
const observeElements = document.querySelectorAll('.skill-category, .project-card, .contact-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

observeElements.forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Typing effect para el hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto de typing al cargar la página
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Contador animado para estadísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Observer para las estadísticas
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                const target = parseInt(statNumber.textContent);
                statNumber.classList.add('animated');
                animateCounter(statNumber, target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
const FORMSPREE_URL = 'https://formspree.io/f/mreboroo';

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener datos del formulario
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Validación básica
    if (!name || !email || !subject || !message) {
        showNotification('Por favor, completa todos los campos.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Por favor, ingresa un email válido.', 'error');
        return;
    }

    // Verificar checkbox de privacidad
    const privacyConsent = document.getElementById('privacy-consent');
    if (!privacyConsent.checked) {
        showNotification('Debes aceptar la Política de Privacidad.', 'error');
        return;
    }

    // Mostrar indicador de carga
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';

    try {
        // Enviar datos a Formspree
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Mostrar mensaje de éxito
            showNotification(currentLanguage === 'es'
                ? '¡Mensaje enviado correctamente! Te contactaré pronto.'
                : 'Message sent successfully! I will contact you soon.', 'success');

            this.reset();
        } else {
            throw new Error('Error en el envío');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification(currentLanguage === 'es'
            ? 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o escríbeme directamente a maximestebanc@gmail.com'
            : 'There was an error sending the message. Please try again or write to me directly at maximestebanc@gmail.com', 'error');
    } finally {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Efecto parallax sutil para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Preloader (opcional)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Highlight active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Lazy loading para imágenes (si las hay)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Tema oscuro/claro (opcional)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Cargar tema guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Protección contra spam del formulario
let lastSubmission = 0;
const SUBMISSION_COOLDOWN = 5000; // 5 segundos

contactForm.addEventListener('submit', function(e) {
    const now = Date.now();
    if (now - lastSubmission < SUBMISSION_COOLDOWN) {
        e.preventDefault();
        showNotification('Por favor, espera unos segundos antes de enviar otro mensaje.', 'error');
        return;
    }
    lastSubmission = now;
});

// Inicialización completa
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio cargado correctamente ✨');
    
    // Agregar clase para animaciones iniciales
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Inicializar funcionalidades legales
    initLegalCompliance();
});

// === FUNCIONALIDADES LEGALES ===

// Gestión de cookies
function initLegalCompliance() {
    // Verificar si ya se aceptaron/rechazaron cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        // Mostrar banner después de 2 segundos
        setTimeout(() => {
            showCookieBanner();
        }, 2000);
    }
}

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('visible');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('visible');
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
    
    // Aquí puedes activar cookies de análisis, etc.
    console.log('Cookies aceptadas ✅');
    
    // Ejemplo: activar Google Analytics
    // gtag('consent', 'update', {
    //     'analytics_storage': 'granted'
    // });
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieBanner();
    
    console.log('Cookies rechazadas ❌');
    
    // Solo cookies técnicas necesarias
    // gtag('consent', 'update', {
    //     'analytics_storage': 'denied'
    // });
}

// Gestión de modales legales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
        
        // Cerrar con Escape
        document.addEventListener('keydown', handleEscapeKey);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        
        // Remover listener de Escape
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        // Cerrar todos los modales abiertos
        document.querySelectorAll('.legal-modal.visible').forEach(modal => {
            modal.classList.remove('visible');
        });
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('legal-modal')) {
        e.target.classList.remove('visible');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscapeKey);
    }
});

// Función para resetear cookies (para testing)
function resetCookieConsent() {
    localStorage.removeItem('cookieConsent');
    location.reload();
}

// Sistema de traducción
let currentLanguage = 'es';

// Cargar idioma guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    switchLanguage(savedLanguage);
    
    // Event listeners para botones de idioma (tanto navbar como flotantes)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
});

function switchLanguage(lang) {
    currentLanguage = lang;

    // Actualizar botones activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    // Traducir elementos con data attributes
    document.querySelectorAll('[data-' + lang + ']').forEach(element => {
        const translation = element.getAttribute('data-' + lang);
        element.textContent = translation;
    });

    // Traducir elementos con HTML
    document.querySelectorAll('[data-' + lang + ']').forEach(element => {
        const translation = element.getAttribute('data-' + lang);
        if (translation.includes('<')) {
            element.innerHTML = translation;
        }
    });

    // Traducir placeholders de inputs
    document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(element => {
        const placeholder = element.getAttribute('data-placeholder-' + lang);
        element.placeholder = placeholder;
    });

    // Actualizar título de la página
    if (lang === 'en') {
        document.title = 'Màxim Esteban | Multidisciplinary Professional';
        document.querySelector('meta[name="description"]').setAttribute('content',
            'Multidisciplinary professional with 9+ years in communication, digital marketing, web development and project management. Specialized in combining creativity, technology and strategy for measurable results.');
    } else {
        document.title = 'Màxim Esteban | Profesional Multidisciplinar';
        document.querySelector('meta[name="description"]').setAttribute('content',
            'Profesional multidisciplinar con 9+ años en comunicación, marketing digital, desarrollo web y gestión de proyectos. Especializado en combinar creatividad, tecnología y estrategia para resultados medibles.');
    }

    // Guardar preferencia
    localStorage.setItem('language', lang);
}

// === GENERACIÓN DE CV EN PDF (DINÁMICO) ===
function generateCV() {
    // Construir CV dinámicamente leyendo desde la web
    const cvHTML = buildDynamicCV();

    // Crear un contenedor temporal para el PDF
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = cvHTML;
    tempContainer.style.display = 'block';
    document.body.appendChild(tempContainer);

    // Configuración del PDF
    const opt = {
        margin: [10, 10, 10, 10],
        filename: currentLanguage === 'es' ? 'CV_Maxim_Esteban.pdf' : 'CV_Maxim_Esteban_EN.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Generar el PDF
    html2pdf().set(opt).from(tempContainer.querySelector('.cv-container')).save().then(() => {
        // Eliminar el contenedor temporal
        document.body.removeChild(tempContainer);
    });

    // Mostrar notificación
    showNotification(
        currentLanguage === 'es'
            ? '¡CV descargado correctamente!'
            : 'CV downloaded successfully!',
        'success'
    );
}

function buildDynamicCV() {
    const lang = currentLanguage;

    // Leer perfil profesional dinámicamente desde la web
    const aboutSection = document.querySelector('#about .about-text');
    const aboutParagraphs = aboutSection.querySelectorAll('p');
    const profileText = Array.from(aboutParagraphs)
        .slice(0, 1) // Solo el primer párrafo para el perfil
        .map(p => p.textContent.trim())
        .join(' ');

    // Leer skills dinámicamente desde la web
    const skillCategories = document.querySelectorAll('.skill-category');
    let skillsHTML = '';

    skillCategories.forEach(category => {
        const categoryTitle = category.querySelector('.category-title').textContent.trim();
        const skillItems = category.querySelectorAll('.skill-item span');
        const skills = Array.from(skillItems).map(skill => `<li>${skill.textContent.trim()}</li>`).join('');

        skillsHTML += `
            <div class="cv-skill-column">
                <h3 class="cv-skill-category">${categoryTitle}</h3>
                <ul class="cv-skill-list">
                    ${skills}
                </ul>
            </div>
        `;
    });

    // Hardcoded: Experiencia profesional (no está en la web con este detalle)
    const experienceHTML = `
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">Operation Head & Customer Success</h3>
                <span class="cv-job-date">${lang === 'es' ? 'Octubre 2024 - Actualidad' : 'October 2024 - Present'}</span>
            </div>
            <p class="cv-company">Placenet - Internet of Places ${lang === 'es' ? '(Startup tecnológica)' : '(Technology Startup)'}</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Dirección de operaciones y optimización de procesos internos' : 'Operations management and internal process optimization'}</li>
                <li>${lang === 'es' ? 'Customer success, onboarding y retención de usuarios' : 'Customer success, onboarding and user retention'}</li>
                <li>${lang === 'es' ? 'Gestión de KPIs, reporting y análisis de métricas operacionales' : 'KPI management, reporting and operational metrics analysis'}</li>
                <li>${lang === 'es' ? 'Coordinación entre equipos técnicos y comerciales' : 'Coordination between technical and commercial teams'}</li>
            </ul>
        </div>
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">Communication, Content & Talent Manager</h3>
                <span class="cv-job-date">${lang === 'es' ? 'Agosto 2023 - Octubre 2024' : 'August 2023 - October 2024'}</span>
            </div>
            <p class="cv-company">Placenet - Internet of Places ${lang === 'es' ? '(Startup tecnológica)' : '(Technology Startup)'}</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Gestión de comunicación corporativa y creación de contenido digital' : 'Corporate communication management and digital content creation'}</li>
                <li>${lang === 'es' ? 'Coordinación de talento, embajadores y relaciones públicas' : 'Talent coordination, ambassadors and public relations'}</li>
                <li>${lang === 'es' ? 'Desarrollo web completo y diseño UI/UX de la app' : 'Complete web development and app UI/UX design'}</li>
                <li>${lang === 'es' ? 'Desarrollo y ejecución de estrategias de marca y posicionamiento' : 'Brand and positioning strategy development and execution'}</li>
            </ul>
        </div>
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">${lang === 'es' ? 'Director de Marketing' : 'Marketing Director'}</h3>
                <span class="cv-job-date">2022 - 2024</span>
            </div>
            <p class="cv-company">CBI Elche</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Diseño y dirección de estrategia de marketing y comunicación del club' : 'Design and direction of club marketing and communication strategy'}</li>
                <li>${lang === 'es' ? 'Gestión de redes sociales, imagen corporativa y relaciones con patrocinadores' : 'Social media management, corporate image and sponsor relations'}</li>
                <li>${lang === 'es' ? 'Coordinación de campañas de comunicación y eventos' : 'Communication campaigns and events coordination'}</li>
            </ul>
        </div>
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">${lang === 'es' ? 'Co-fundador y Director' : 'Co-founder and Director'}</h3>
                <span class="cv-job-date">2022 - 2024</span>
            </div>
            <p class="cv-company">HIPE Basketball & HIPE Agency</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Fundador de agencia de eventos deportivos y representación de talentos' : 'Founder of sports events agency and talent representation'}</li>
                <li>${lang === 'es' ? 'Dirección de marketing, comunicación y estrategia de crecimiento' : 'Marketing direction, communication and growth strategy'}</li>
                <li>${lang === 'es' ? 'Gestión integral de clubes y eventos deportivos' : 'Comprehensive management of clubs and sports events'}</li>
            </ul>
        </div>
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">${lang === 'es' ? 'Prácticas en Comunicación' : 'Communication Internship'}</h3>
                <span class="cv-job-date">2022 - 2023</span>
            </div>
            <p class="cv-company">CB Benicarló</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Creación de contenido gráfico y audiovisual' : 'Graphic and audiovisual content creation'}</li>
                <li>${lang === 'es' ? 'Redacción de notas de prensa y comunicación corporativa' : 'Press release writing and corporate communication'}</li>
            </ul>
        </div>
        <div class="cv-experience-item">
            <div class="cv-job-header">
                <h3 class="cv-job-title">${lang === 'es' ? 'Jugador Profesional de Baloncesto' : 'Professional Basketball Player'}</h3>
                <span class="cv-job-date">${lang === 'es' ? '2016 - Actualidad' : '2016 - Present'}</span>
            </div>
            <p class="cv-company">${lang === 'es' ? 'Diferentes clubes profesionales' : 'Various professional clubs'}</p>
            <ul class="cv-responsibilities">
                <li>${lang === 'es' ? 'Liderazgo, trabajo en equipo y gestión de la presión' : 'Leadership, teamwork and pressure management'}</li>
                <li>${lang === 'es' ? 'Disciplina, competitividad y orientación a resultados' : 'Discipline, competitiveness and results orientation'}</li>
            </ul>
        </div>
    `;

    // Hardcoded: Formación (no está en la web)
    const educationHTML = `
        <div class="cv-education-item">
            <div class="cv-education-header">
                <h3 class="cv-degree">${lang === 'es' ? 'Licencia de Entrenador Nacional Nivel 1 (N1 Coach License)' : 'National Coach License Level 1 (N1 Coach License)'}</h3>
                <span class="cv-year">2024</span>
            </div>
            <p class="cv-institution">${lang === 'es' ? 'FEB (Federación Española de Baloncesto)' : 'FEB (Spanish Basketball Federation)'}</p>
        </div>
        <div class="cv-education-item">
            <div class="cv-education-header">
                <h3 class="cv-degree">${lang === 'es' ? 'Ciclo Formativo de Grado Superior, Marketing y Publicidad' : 'Higher Vocational Training, Marketing and Advertising'}</h3>
                <span class="cv-year">2021 - 2023</span>
            </div>
            <p class="cv-institution">UOC X - Xtended Studies</p>
        </div>
        <div class="cv-education-item">
            <div class="cv-education-header">
                <h3 class="cv-degree">${lang === 'es' ? 'Programa +QESPORT' : '+QESPORT Program'}</h3>
                <span class="cv-year">2019</span>
            </div>
            <p class="cv-institution">ESERP Business & Law School</p>
        </div>
        <div class="cv-education-item">
            <div class="cv-education-header">
                <h3 class="cv-degree">${lang === 'es' ? 'Productor Musical, Música' : 'Music Producer, Music'}</h3>
                <span class="cv-year">2019</span>
            </div>
            <p class="cv-institution">CPA SALDUIE</p>
        </div>
        <div class="cv-education-item">
            <div class="cv-education-header">
                <h3 class="cv-degree">${lang === 'es' ? 'Eines de Comunicació Per a Ser Professional' : 'Communication Tools to Be a Professional'}</h3>
                <span class="cv-year">2018</span>
            </div>
            <p class="cv-institution">${lang === 'es' ? 'Futbol Club Barcelona - Comunicación digital y contenidos multimedia' : 'FC Barcelona - Digital communication and multimedia content'}</p>
        </div>
    `;

    // Construir el HTML completo del CV
    return `
        <div class="cv-container">
            <div class="cv-header">
                <h1>Màxim Esteban Calvo</h1>
                <p class="cv-tagline">${lang === 'es' ? 'Profesional Multidisciplinar' : 'Multidisciplinary Professional'}</p>
            </div>

            <div class="cv-contact">
                <div class="cv-contact-item">
                    <i class="fas fa-envelope"></i> <a href="mailto:maximestebanc@gmail.com" class="cv-link">maximestebanc@gmail.com</a>
                </div>
                <div class="cv-contact-item">
                    <i class="fas fa-phone"></i> <a href="tel:+34623173898" class="cv-link">+34 623 17 38 98</a>
                </div>
                <div class="cv-contact-item">
                    <i class="fab fa-linkedin"></i> <a href="https://linkedin.com/in/maximesteban" class="cv-link">linkedin.com/in/maximesteban</a>
                </div>
                <div class="cv-contact-item">
                    <i class="fab fa-github"></i> <a href="https://github.com/maximesteban" class="cv-link">github.com/maximesteban</a>
                </div>
            </div>

            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'es' ? 'Perfil Profesional' : 'Professional Profile'}</h2>
                <p class="cv-text">${profileText}</p>
            </div>

            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'es' ? 'Habilidades Clave' : 'Key Skills'}</h2>
                <div class="cv-skills-grid">
                    ${skillsHTML}
                </div>
            </div>

            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience'}</h2>
                ${experienceHTML}
            </div>

            <div class="cv-section">
                <h2 class="cv-section-title">${lang === 'es' ? 'Formación Académica' : 'Education'}</h2>
                ${educationHTML}
            </div>

            <div class="cv-section cv-languages-additional">
                <div class="cv-column-half">
                    <h2 class="cv-section-title">${lang === 'es' ? 'Idiomas' : 'Languages'}</h2>
                    <ul class="cv-language-list">
                        <li><strong>${lang === 'es' ? 'Español' : 'Spanish'}</strong>: <span>${lang === 'es' ? 'Nativo' : 'Native'}</span></li>
                        <li><strong>${lang === 'es' ? 'Catalán' : 'Catalan'}</strong>: <span>${lang === 'es' ? 'Nativo' : 'Native'}</span></li>
                        <li><strong>${lang === 'es' ? 'Inglés' : 'English'}</strong>: <span>${lang === 'es' ? 'Profesional' : 'Professional'}</span></li>
                    </ul>
                </div>
                <div class="cv-column-half">
                    <h2 class="cv-section-title">${lang === 'es' ? 'Información Adicional' : 'Additional Information'}</h2>
                    <ul class="cv-additional-list">
                        <li>${lang === 'es' ? 'Carnet de conducir: B' : 'Driving license: B'}</li>
                        <li>${lang === 'es' ? 'Disponibilidad para trabajo remoto' : 'Available for remote work'}</li>
                        <li>${lang === 'es' ? 'Dispuesto a relocalización' : 'Willing to relocate'}</li>
                    </ul>
                </div>
            </div>

            <div class="cv-footer">
                <p class="cv-footer-text">${lang === 'es' ? 'Generado desde maximesteban.com' : 'Generated from maximesteban.com'}</p>
            </div>
        </div>
    `;
}