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
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEFeuqPmqmoUpFejYuHEWy9qvjEC-RUTozw8RWMUAjbDpnc6H_dKRLPiSMVCiTUKdDUg/exec';

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
        // Enviar datos a Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            showNotification(currentLanguage === 'es'
                ? '¡Mensaje enviado correctamente! Te contactaré pronto.'
                : 'Message sent successfully! I will contact you soon.', 'success');
            this.reset();
        } else {
            throw new Error(result.message || 'Error al enviar el mensaje');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification(currentLanguage === 'es'
            ? 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo o escríbeme directamente a maxim@maximesteban.com'
            : 'There was an error sending the message. Please try again or write to me directly at maxim@maximesteban.com', 'error');
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
        document.title = 'Maxim Esteban | Digital Marketing & Web Development';
        document.querySelector('meta[name="description"]').setAttribute('content', 
            'Màxim Esteban - Professional portfolio. Specialist in Digital Marketing, Frontend Web Development and UI/UX. Digital consulting services. Barcelona, Spain.');
    } else {
        document.title = 'Maxim Esteban | Marketing Digital & Desarrollo Web';
        document.querySelector('meta[name="description"]').setAttribute('content', 
            'Màxim Esteban - Portfolio profesional. Especialista en Marketing Digital, Desarrollo Web Frontend y UI/UX. Servicios de consultoría digital. Barcelona, España.');
    }
    
    // Actualizar enlaces del CV (tanto navbar como flotante)
    document.querySelectorAll('.btn-cv, .floating-cv').forEach(cvButton => {
        if (lang === 'en') {
            cvButton.href = 'cv/CV_Maxim_Esteban_EN.pdf';
        } else {
            cvButton.href = 'cv/Maxim_Esteban_CV.pdf';
        }
    });
    
    // Guardar preferencia
    localStorage.setItem('language', lang);
}