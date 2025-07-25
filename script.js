// =====================================================================
// FUNCIONES GLOBALES (DEFINIDAS ANTES DE DOMContentLoaded)
// =====================================================================

/**
 * Desplaza la vista suavemente a una sección específica de la página.
 * @param {string} sectionId - El ID de la sección a la que se desea desplazar.
 * @param {boolean} smooth - True para desplazamiento suave, false para instantáneo.
 */
function scrollToSection(sectionId, smooth) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        console.log(`[scrollToSection] Desplazando a: "${sectionId}" (suave: ${smooth})`);
    } else {
        console.warn(`[scrollToSection] Sección con ID "${sectionId}" no encontrada. No se pudo desplazar.`);
    }
}

/**
 * Muestra una sección principal y oculta las demás en index.html.
 * Esta función es para el comportamiento de SPA en la página principal.
 * @param {string} idToShow - El ID de la sección principal a mostrar.
 */
function showMainSection(idToShow) {
    // Solo aplica esta lógica si estamos en index.html
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (!isIndexPage) {
        console.warn('[showMainSection] Esta función solo debe usarse en index.html. Ignorando.');
        return;
    }

    const mainSections = document.querySelectorAll('main section'); // Más específico: solo secciones dentro de <main>
    let targetSectionId = idToShow || 'INICIO'; // Usa 'INICIO' como valor por defecto si idToShow es falsy

    // Verifica si la sección objetivo existe. Si no, usa la por defecto.
    const sectionExists = document.getElementById(targetSectionId);
    if (!sectionExists) {
        console.log(`[showMainSection] Hash "${idToShow}" no válido o sección no encontrada. Mostrando por defecto: "INICIO".`);
        targetSectionId = 'INICIO'; // Asegura que si el hash inicial no existe, volvamos a INICIO
    } else {
        console.log(`[showMainSection] Intentando mostrar sección: "${targetSectionId}".`);
    }

    mainSections.forEach(section => {
        if (section.id === targetSectionId) {
            section.classList.remove('section-hidden'); // Elimina la clase para mostrarla
            // section.classList.add('is-active'); // Opcional: añadir una clase 'is-active' si quieres estilos específicos
            console.log(`[showMainSection] Sección principal activa: ${section.id}`);
        } else {
            section.classList.add('section-hidden'); // Añade la clase para ocultarla
            // section.classList.remove('is-active'); // Opcional: quitar la clase 'is-active'
            console.log(`[showMainSection] Sección principal oculta: ${section.id}`);
        }
    });
}

/**
 * Muestra una sección específica y oculta las demás dentro de servicios.html.
 * Esta función SOLO DEBE SER LLAMADA EN servicios.html.
 * @param {string} idToShow - El ID de la sección de detalle de servicio a mostrar.
 */
function showServiceDetailSection(idToShow) {
    const isServiciosPage = window.location.pathname.endsWith('servicios.html');
    if (!isServiciosPage) {
        console.warn('[showServiceDetailSection] Esta función solo debe usarse en servicios.html. Ignorando.');
        return;
    }

    const serviceDetailSections = document.querySelectorAll('.service-detail-section');
    let targetSectionId = idToShow || 'terapia-individual'; // Sección por defecto si no hay hash o es inválido

    const sectionExists = document.getElementById(targetSectionId);
    if (!sectionExists) {
        console.log(`[showServiceDetailSection] Hash "${idToShow}" no válido o sección no encontrada. Mostrando por defecto: "terapia-individual".`);
        targetSectionId = 'terapia-individual'; // Asegura que si el hash inicial no existe, volvamos a terapia-individual
    } else {
        console.log(`[showServiceDetailSection] Intentando mostrar sección: "${targetSectionId}".`);
    }

    serviceDetailSections.forEach(section => {
        if (section.id === targetSectionId) {
            section.classList.add('is-active'); // Añade la clase para mostrar
            section.classList.remove('section-hidden'); // Asegúrate de quitar section-hidden si lo tenías
            console.log(`[showServiceDetailSection] Sección de servicio activa: ${section.id}`);
        } else {
            section.classList.remove('is-active'); // Quita la clase para ocultar
            section.classList.add('section-hidden'); // Asegúrate de añadir section-hidden
            console.log(`[showServiceDetailSection] Sección de servicio oculta: ${section.id}`);
        }
    });
}


// =====================================================================
// LÓGICA PRINCIPAL AL CARGAR EL CONTENIDO DEL DOM
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Detecta la página actual de manera más robusta
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const isServiciosPage = window.location.pathname.endsWith('servicios.html');

    // Obtiene el hash inicial de la URL
    const initialHash = window.location.hash.substring(1);
    console.log(`[DOMContentLoaded] Iniciando. Hash inicial: "${initialHash}". Página actual: ${isIndexPage ? 'Index' : (isServiciosPage ? 'Servicios' : 'Otra')}.`);

    // Lógica de visualización de secciones según la página
    if (isIndexPage) {
        showMainSection(initialHash);
        // Desplaza instantáneamente al cargar para que el usuario vea la sección correcta sin un "salto" suave inicial
        scrollToSection(initialHash || 'INICIO', false);
    } else if (isServiciosPage) {
        showServiceDetailSection(initialHash);
        // Desplaza instantáneamente al cargar
        scrollToSection(initialHash || 'terapia-individual', false);
    } else {
        // Para cualquier otra página, solo desplázate al top
        window.scrollTo({ top: 0, behavior: 'auto' });
        console.log('[DOMContentLoaded - Otra Página] Desplazando al top de la página.');
    }


    // =====================================================================
    // CÓDIGO DEL MENÚ DE HAMBURGUESA Y NAVEGACIÓN
    // =====================================================================

    const menuToggle = document.querySelector('.menu-toggle');
    const headerBottom = document.querySelector('.header-bottom'); // Menú móvil

    if (menuToggle && headerBottom) {
        menuToggle.addEventListener('click', () => {
            headerBottom.classList.toggle('is-open');
            menuToggle.classList.toggle('active'); // Para cambiar el icono
            menuToggle.setAttribute('aria-expanded', headerBottom.classList.contains('is-open'));
            console.log(`[Menú Hamburguesa] Menú ${headerBottom.classList.contains('is-open') ? 'abierto' : 'cerrado'}.`);
        });
    }

    // Funcionalidad para cerrar el menú y manejar la navegación al hacer clic en un enlace
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            const url = new URL(href, window.location.origin); // Crea una URL completa para una comparación robusta

            // Determina si el enlace es a una página diferente (index.html vs servicios.html)
            const isDifferentPageLink = url.pathname !== window.location.pathname && (url.pathname.endsWith('index.html') || url.pathname.endsWith('servicios.html') || url.pathname === '/');

            // Si es un enlace a una página diferente (ej. de index.html a servicios.html), permite la navegación normal del navegador.
            if (isDifferentPageLink) {
                console.log(`[Navegación] Enlace a página diferente detectado: "${href}". Permitida navegación estándar.`);
                // Asegúrate de que el menú se cierra antes de la navegación si es visible
                if (headerBottom && headerBottom.classList.contains('is-open')) {
                    headerBottom.classList.remove('is-open');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
                return; // No se hace preventDefault, el navegador maneja la recarga.
            }

            // Si es un enlace interno (hash link en la misma página HTML), manejamos con SPA.
            event.preventDefault(); // Previene el comportamiento por defecto SÓLO si es un enlace interno de SPA

            const targetId = url.hash.substring(1); // Obtiene el ID del hash (ej. "INICIO", "terapia-individual")
            console.log(`[Navegación SPA] Enlace interno clicado: "${href}". ID de destino: "${targetId || 'ninguno (ruta base)'}".`);

            // Cierra el menú móvil si está abierto
            if (headerBottom && headerBottom.classList.contains('is-open')) {
                headerBottom.classList.remove('is-open');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                console.log('[Navegación SPA] Menú móvil cerrado.');
            }

            // Lógica para mostrar la sección correcta según la página actual
            if (isIndexPage) {
                showMainSection(targetId);
            } else if (isServiciosPage) {
                showServiceDetailSection(targetId);
            }

            // Actualizar la URL sin recargar la página (para compartir enlaces)
            // Solo actualiza si hay un hash válido para no dejar un '#' vacío
            if (targetId) {
                history.pushState(null, '', `#${targetId}`);
            } else {
                // Si el enlace era a la raíz (ej. index.html#), limpiar el hash de la URL
                history.pushState(null, '', window.location.pathname);
            }


            // Desplázate suavemente a la sección activa después de la navegación de SPA
            scrollToSection(targetId || (isIndexPage ? 'INICIO' : 'terapia-individual'), true); // True para desplazamiento suave
        });
    });

    // =====================================================================
    // Manejo de enlaces específicos fuera del nav principal
    // =====================================================================

    // Manejar el botón "Conóceme más" en #INICIO (asumiendo que está en index.html)
    const internalAboutLink = document.querySelector('.internal-section-link');
    if (internalAboutLink && isIndexPage) {
        internalAboutLink.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('[Enlace Interno] Clic en "Conóceme más".');
            showMainSection('ACERCA-DE-MI');
            history.pushState(null, '', '#ACERCA-DE-MI');
            scrollToSection('ACERCA-DE-MI', true);
            // Cierra el menú móvil si está abierto al hacer clic
            if (headerBottom && headerBottom.classList.contains('is-open')) {
                headerBottom.classList.remove('is-open');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                console.log('[Enlace Interno] Menú móvil cerrado después de clic.');
            }
        });
    }

    // Manejar el botón "Saber Más" en las tarjetas de servicio (en index.html o servicios.html)
    // Asumo que si están en index.html, redirigen a servicios.html#ID
    // Y si están en servicios.html, activan una sección interna de esa misma página.
    const saberMasButtons = document.querySelectorAll('.btn-saber-mas');
    if (saberMasButtons.length > 0) { // Aplicar el listener en ambas páginas
        saberMasButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                const url = new URL(href, window.location.origin);

                // Si el botón lleva a otra página (ej. de index.html a servicios.html)
                if (url.pathname !== window.location.pathname) {
                    // No hacemos preventDefault, permitimos la navegación normal.
                    console.log(`[Botón "Saber Más"] Clic en botón que redirige a página diferente: "${href}".`);
                    return;
                }

                // Si el botón apunta a un hash en la misma página (ej. en servicios.html)
                event.preventDefault(); // Previene el comportamiento por defecto
                const targetServiceId = url.hash.substring(1); // Obtiene el ID del hash
                console.log(`[Botón "Saber Más"] Clic en botón interno. ID de destino: "${targetServiceId}".`);

                if (targetServiceId) {
                    if (isServiciosPage) {
                        showServiceDetailSection(targetServiceId);
                    } else if (isIndexPage) {
                        // Si por alguna razón un botón "saber más" en index.html apunta a un hash
                        // dentro de index.html (menos común para "saber más" pero posible)
                        showMainSection(targetServiceId);
                    }
                    history.pushState(null, '', `#${targetServiceId}`);
                    scrollToSection(targetServiceId, true);
                } else {
                    console.warn('[Botón "Saber Más"] Botón sin hash válido. No se realizó acción.');
                }
            });
        });
    }

    // =====================================================================
    // Manejo de la navegación con el historial del navegador (popstate)
    // Esto es crucial para los botones de atrás/adelante del navegador
    // =====================================================================
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        console.log(`[Popstate] Evento detectado. Hash actual: "${hash || 'ninguno'}".`);
        if (isIndexPage) {
            showMainSection(hash || 'INICIO');
            scrollToSection(hash || 'INICIO', true); // Suave al volver con historial
        } else if (isServiciosPage) {
            showServiceDetailSection(hash || 'terapia-individual');
            scrollToSection(hash || 'terapia-individual', true); // Suave al volver con historial
        }
    });

    // =====================================================================
    // CÓDIGO DE ENVÍO DE FORMULARIO (EmailJS)
    // =====================================================================

    // Inicializa EmailJS - Asegúrate de reemplazar "Ex-FLrxnRjs86Lv0J" con tu PUBLIC KEY REAL de EmailJS
    const EMAILJS_PUBLIC_KEY = "Ex-FLrxnRjs86Lv0J"; // Tu Public Key/User ID
    const EMAILJS_SERVICE_ID = "Psico Luismi";
    const EMAILJS_TEMPLATE_ID = "template_i8e2jgj";

    if (typeof emailjs !== 'undefined' && emailjs.init) { // Asegúrate de que EmailJS y su método init estén disponibles
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY // Usar 'publicKey' en lugar de 'userId'
        });
        console.log('[EmailJS] Inicializado con éxito.');
    } else {
        console.error("EmailJS no está cargado o su método init no está disponible. Asegúrate de incluir el script de EmailJS antes de este script.");
    }

    /**
     * Función genérica para enviar formularios con EmailJS.
     * @param {HTMLFormElement} formElement - El elemento del formulario a enviar.
     * @param {string} formName - Un nombre descriptivo para el formulario (para mensajes de alerta/consola).
     */
    function sendEmailForm(formElement, formName) {
        if (typeof emailjs === 'undefined' || !emailjs.sendForm) {
            alert(`El servicio de EmailJS no está disponible para el formulario de ${formName}.`);
            console.error(`[EmailJS Error] El servicio de EmailJS no está disponible para el formulario de ${formName}.`);
            return;
        }

        console.log(`[EmailJS] Intentando enviar formulario: "${formName}".`);
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formElement)
            .then(function() {
                alert(`¡Tu mensaje ha sido enviado con éxito desde el formulario de ${formName}!`);
                formElement.reset(); // Limpia el formulario
                console.log(`[EmailJS] Formulario de "${formName}" enviado exitosamente.`);
            }, function(error) {
                alert(`¡Oh! Ha ocurrido un error al enviar el mensaje desde el formulario de ${formName}. Por favor, inténtalo de nuevo. Error: ${JSON.stringify(error.text || error)}`);
                console.error(`[EmailJS Error] Error al enviar formulario (${formName} Form):`, error);
            });
    }

    // *** FORMULARIO DE CONTACTO EN index.html (ID: contact-form) ***
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto
            sendEmailForm(this, 'página principal');
        });
    }

    // *** FORMULARIO DE CONTACTO EN servicios.html (ID: contact-form-sidebar) ***
    const contactFormSidebar = document.getElementById('contact-form-sidebar');
    if (contactFormSidebar) {
        contactFormSidebar.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto
            sendEmailForm(this, 'servicios (barra lateral)');
        });
    }
});