// Elementos del DOM
const modal = document.getElementById('affiliateModal'); // Modal de afiliación
const form = document.getElementById('affiliateForm'); // Formulario de afiliación
const menuToggle = document.querySelector('.menu-toggle'); // Botón de menú móvil
const navLinks = document.querySelector('.nav-links'); // Enlaces de navegación
const body = document.body; // Elemento body
const closeMenu = document.querySelector('.close-menu'); // Botón para cerrar menú

// Configuración de constantes
const CONFIG = {
    ANIMATION_DURATION: 300, // Duración de animaciones en ms
    DEBOUNCE_DELAY: 500, // Retraso para debounce en ms
    MIN_PHONE_LENGTH: 8, // Longitud mínima para números telefónicos
    MAX_PHONE_LENGTH: 15, // Longitud máxima para números telefónicos
    EMAIL_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Regex para validar emails
    PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ // Regex para validar teléfonos
};

// Objeto con utilidades y funciones helper
const utils = {
    // Función debounce para limitar la frecuencia de ejecución
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Valida formato de email
    validateEmail: (email) => CONFIG.EMAIL_REGEX.test(email),
    
    // Valida formato de teléfono
    validatePhone: (phone) => CONFIG.PHONE_REGEX.test(phone),
    
    // Muestra mensaje de error
    showError: (element, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message animate-fade-up';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
        element.classList.add('error');
        
        setTimeout(() => errorDiv.remove(), 5000);
    },
    
    // Muestra mensaje de éxito
    showSuccess: (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification success animate-fade-up';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    },
    
    // Formatea datos del formulario
    formatFormData: (formData) => {
        return Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value
            ])
        );
    }
};

// Inicialización y manejo del menú móvil
document.addEventListener('DOMContentLoaded', function() {
    let menuOverlay;
    let isMenuOpen = false;

    // Crea el overlay del menú
    function createOverlay() {
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            document.body.appendChild(menuOverlay);
        }
    }

    // Abre el menú móvil
    function openMenu(e) {
        if (e) e.stopPropagation();
        if (isMenuOpen) return;
        
        isMenuOpen = true;
        createOverlay();
        navLinks.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Cierra el menú móvil
    function closeMenuHandler(e) {
        if (e) e.stopPropagation();
        if (!isMenuOpen) return;

        isMenuOpen = false;
        navLinks.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            menuOverlay.remove();
            menuOverlay = null;
        }
        document.body.style.overflow = '';
    }

    // Event listeners para el menú
    menuToggle.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuHandler);

    // Cierra el menú al hacer clic en un enlace
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMenuHandler();
        }
    });

    // Cierra el menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen && (e.target === menuOverlay || !navLinks.contains(e.target))) {
            closeMenuHandler();
        }
    });

    // Cierra el menú al redimensionar la ventana
    window.addEventListener('resize', utils.debounce(() => {
        if (window.innerWidth > 992 && isMenuOpen) {
            closeMenuHandler();
        }
    }, 250));
});

// Manejo del modal de afiliación
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    modal.classList.add('fade-in');
}

// Cierra el modal con animación
function closeModal() {
    modal.classList.remove('fade-in');
    modal.classList.add('fade-out');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Cierra el modal al hacer clic fuera
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Maneja el envío del formulario de afiliación
async function submitForm(event) {
    event.preventDefault();

    // Valida campos del formulario
    if (!validateForm()) {
        return;
    }

    // Recopila datos del formulario
    const formData = {
        fullName: document.getElementById('fullName').value,
        country: document.getElementById('country').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        motivation: document.getElementById('motivation').value
    };

    try {
        // Actualiza UI durante el envío
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        // Prepara cuerpo del email
        const emailBody = `
            Nuevo registro de Partner Q10:
            
            Nombre: ${formData.fullName}
            País: ${formData.country}
            Email: ${formData.email}
            Teléfono: ${formData.phone}
            Empresa: ${formData.company}
            Motivación: ${formData.motivation}
        `;

        // Simula envío al servidor
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Datos que se enviarían:', emailBody);
        
        // Muestra confirmación
        showNotification('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Limpia y cierra el formulario
        closeModal();
        form.reset();
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showNotification('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
    } finally {
        // Restaura el botón
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Valida campos del formulario
function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'Este campo es requerido');
        } else if (field.type === 'email' && !validateEmail(field.value)) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'Por favor, ingresa un email válido');
        } else if (field.id === 'phone' && !validatePhone(field.value)) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'Por favor, ingresa un número de teléfono válido');
        }
    });

    return isValid;
}

// Funciones de validación de campos
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?[\d\s-]{8,}$/.test(phone);
}

// Muestra mensajes de error en campos
function showFieldError(field, message) {
    const errorDiv = field.parentElement.querySelector('.error-message') || 
                    document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!field.parentElement.querySelector('.error-message')) {
        field.parentElement.appendChild(errorDiv);
    }
}

// Sistema de notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Inicialización de animaciones y efectos visuales
document.addEventListener('DOMContentLoaded', () => {
    // Scroll suave para navegación
    document.querySelectorAll('a[href^="#"], button[onclick^="location"]').forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href') || this.onclick.toString().match(/'#.*?'/)[0].replace(/'/g, '');
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación de contadores en estadísticas
    const statsNumbers = document.querySelectorAll('.stats-number');
    const animateNumber = (element) => {
        const number = element.innerText.match(/\d+/)[0];
        const prefix = element.innerText.match(/[^\d]*/)[0];
        const suffix = element.innerText.match(/[^\d]*$/)[0];
        let start = 0;
        const end = parseInt(number);
        const duration = 2000;
        const step = end / (duration / 16);
        
        const updateNumber = () => {
            start += step;
            if (start < end) {
                element.innerText = prefix + Math.floor(start).toLocaleString() + suffix;
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = prefix + end.toLocaleString() + suffix;
            }
        };
        
        updateNumber();
    };

    // Observer para animación de estadísticas
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stats-number').forEach(animateNumber);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Efectos hover en tarjetas de beneficios
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Validación en tiempo real de campos
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.benefit-card, .hero-content, .hero-image').forEach(el => {
        observer.observe(el);
    });

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const errorMessages = contactForm.querySelector('.error-messages');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpia errores anteriores
        errorMessages.innerHTML = '';
        errorMessages.classList.remove('show');
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        let errors = [];
        let isValid = true;

        // Validación de campos requeridos
        contactForm.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                if (field.type === 'checkbox') {
                    errors.push('Debes autorizar el tratamiento de datos personales');
                } else {
                    errors.push(`El campo ${field.placeholder} es requerido`);
                }
            }
        });

        // Validación de email
        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField.value.trim() && !validateEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            errors.push('Por favor, ingresa un email válido');
        }

        // Validación de teléfono
        const phoneField = contactForm.querySelector('input[type="tel"]');
        if (phoneField.value.trim() && !validatePhone(phoneField.value)) {
            isValid = false;
            phoneField.classList.add('error');
            errors.push('Por favor, ingresa un número de teléfono válido');
        }

        // Muestra errores si existen
        if (!isValid) {
            errorMessages.innerHTML = errors.map(error => `<div>${error}</div>`).join('');
            errorMessages.classList.add('show');
            return;
        }

        try {
            // Prepara UI para envío
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            // Recopila datos del formulario
            const formData = {
                nombres: contactForm.querySelector('input[placeholder="Nombres"]').value,
                institucion_ciudad: contactForm.querySelector('input[placeholder="Institución - Ciudad"]').value,
                telefono: contactForm.querySelector('input[placeholder="Teléfono - Celular"]').value,
                correo: contactForm.querySelector('input[placeholder="Correo"]').value,
                comentarios: contactForm.querySelector('textarea[placeholder="Comentarios"]').value,
                autorizacion: contactForm.querySelector('#privacy').checked
            };

            // Simula envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const emailBody = `
            Nuevo mensaje de contacto:
            
            Nombre: ${formData.nombres}
            Institución - Ciudad: ${formData.institucion_ciudad}
            Teléfono: ${formData.telefono}
            Correo: ${formData.correo}
            Comentarios: ${formData.comentarios}
            Autoriza tratamiento de datos: ${formData.autorizacion ? 'Sí' : 'No'}
            `;

            console.log('Datos del formulario de contacto:', emailBody);

            // Limpia formulario y muestra confirmación
            contactForm.reset();
            showNotification('¡Gracias por contactarnos! Te responderemos pronto.', 'success');

            // Restaura botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showNotification('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
            
            // Restaura botón en caso de error
            if (submitButton) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }
    });
}); 