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
        section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    } else {
        console.warn(`[scrollToSection] Sección con ID "${sectionId}" no encontrada.`);
    }
}

/**
 * Muestra una sección principal y oculta las demás en index.html.
 * Esta función es para el comportamiento de SPA en la página principal.
 * @param {string} idToShow - El ID de la sección principal a mostrar.
 */
function showMainSection(idToShow) {
    // Solo aplica esta lógica si estamos en index.html
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        console.warn('[showMainSection] Esta función solo debe usarse en index.html');
        return;
    }

    const mainSections = document.querySelectorAll('section'); // Todas las etiquetas <section>
    let targetSectionId = idToShow;
    const defaultSectionId = 'INICIO'; // Sección por defecto si no hay hash o es inválido

    // Determine la sección a mostrar
    const sectionExists = document.getElementById(targetSectionId);
    if (!sectionExists || targetSectionId === "" || !targetSectionId) { // Si el hash no existe, está vacío o es nulo
        targetSectionId = defaultSectionId;
        console.log(`[showMainSection] Hash no válido o vacío. Mostrando por defecto: "${targetSectionId}".`);
    } else {
        console.log(`[showMainSection] Mostrando sección del hash: "${targetSectionId}".`);
    }

    mainSections.forEach(section => {
        if (section.id === targetSectionId) {
            section.classList.remove('section-hidden'); // Elimina la clase para mostrarla
            // Opcional: añadir una clase 'is-active' si quieres estilos específicos para la sección activa
            // section.classList.add('is-active');
            console.log(`[showMainSection] Sección principal activa: ${section.id}`);
        } else {
            section.classList.add('section-hidden'); // Añade la clase para ocultarla
            // Opcional: quitar la clase 'is-active'
            // section.classList.remove('is-active');
            console.log(`[showMainSection] Sección principal oculta: ${section.id}`);
        }
    });

    // Desplázate a la sección activa (instantáneo al cargar, suave al navegar)
    requestAnimationFrame(() => {
        // Al cargar la página es instantáneo, al navegar (clic en enlace) se hace suave
        scrollToSection(targetSectionId, false); // Esto es instantáneo al cargar la página. La navegación viaja a través del hash.
    });
}

/**
 * Muestra una sección específica y oculta las demás dentro de servicios.html.
 * Esta función SOLO DEBE SER LLAMADA EN servicios.html.
 * @param {string} idToShow - El ID de la sección de detalle de servicio a mostrar.
 */
function showServiceDetailSection(idToShow) {
    // RE-CAMBIO CLAVE: Volver a 'servicios.html' (en plural) aquí.
    if (!window.location.pathname.includes('servicios.html')) {
        console.warn('[showServiceDetailSection] Esta función solo debe usarse en servicios.html');
        return;
    }

    const serviceDetailSections = document.querySelectorAll('.service-detail-section');
    let targetSectionId = idToShow;
    const defaultSectionId = 'terapia-individual'; // Sección por defecto si no hay hash o es inválido

    // Determine la sección a mostrar
    const sectionExists = document.getElementById(targetSectionId);
    if (!sectionExists || targetSectionId === "") { // Si el hash no existe o está vacío
        targetSectionId = defaultSectionId;
        console.log(`[showServiceDetailSection] Hash no válido o vacío. Mostrando por defecto: "${targetSectionId}".`);
    } else {
        console.log(`[showServiceDetailSection] Mostrando sección del hash: "${targetSectionId}".`);
    }

    let foundSection = false;

    serviceDetailSections.forEach(section => {
        if (section.id === targetSectionId) {
            section.classList.add('is-active'); // Añade la clase para mostrar
            section.classList.remove('section-hidden'); // Asegúrate de quitar section-hidden si lo tenías
            foundSection = true;
            console.log(`[showServiceDetailSection] Sección activa: ${section.id}`);
        } else {
            section.classList.remove('is-active'); // Quita la clase para ocultar
            section.classList.add('section-hidden'); // Asegúrate de añadir section-hidden
            console.log(`[showServiceDetailSection] Sección oculta: ${section.id}`);
        }
    });

    // Desplázate a la sección activa (instantáneo al cargar)
    if (foundSection || document.getElementById(defaultSectionId)) {
        requestAnimationFrame(() => {
            scrollToSection(targetSectionId, false);
        });
    } else {
        console.warn(`[showServiceDetailSection] No se pudo activar ninguna sección. Revisa los IDs de las secciones.`);
    }
}


// =====================================================================
// LÓGICA PRINCIPAL AL CARGAR EL CONTENIDO DEL DOM
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Detecta la página actual
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/'; // Incluye la raíz
    const isServiciosPage = window.location.pathname.includes('servicios.html');

    // Obtiene el hash inicial de la URL
    const initialHash = window.location.hash.substring(1);
    console.log(`[DOMContentLoaded] Hash inicial: "${initialHash}". isIndexPage: ${isIndexPage}, isServiciosPage: ${isServiciosPage}`);

    // Lógica de visualización de secciones según la página
    if (isIndexPage) {
        // Al cargar index.html, muestra la sección según el hash o 'INICIO'
        showMainSection(initialHash);
    } else if (isServiciosPage) {
        // Al cargar servicios.html, muestra la sección de detalle de servicio según el hash
        showServiceDetailSection(initialHash);
    } else {
        // Para cualquier otra página, solo desplázate al top
        window.scrollTo({ top: 0, behavior: 'auto' });
        console.log('[DOMContentLoaded - Otra Página] Desplazando al top.');
    }


    // =====================================================================
    // CÓDIGO DEL MENÚ DE HAMBURGUESA Y NAVEGACIÓN
    // =====================================================================

    const menuToggle = document.querySelector('.menu-toggle');
    // Usamos .header-bottom como en tu CSS para el menú móvil
    const headerBottom = document.querySelector('.header-bottom');

    if (menuToggle && headerBottom) {
        menuToggle.addEventListener('click', () => {
            headerBottom.classList.toggle('is-open'); // Usa 'is-open'
            // Opcional: si quieres que el icono cambie a una 'X'
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', headerBottom.classList.contains('is-open'));
        });
    }

    // Funcionalidad para cerrar el menú al hacer clic en un enlace
    // Seleccionamos todos los enlaces de navegación, estén o no dentro del menú móvil
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1); // Obtiene el ID (ej. "INICIO", "ACERCA-DE-MI")
            const isExternalLink = !targetId || targetId.includes('.html'); // Detecta si es un enlace a otra página o a otra sección de la misma página

            // Si es un enlace a otra página (ej. "servicios.html"), deja que el navegador haga su trabajo normal
            if (isExternalLink && isIndexPage) { // Si estoy en index.html y el link es a servicios.html
                // Deja que el navegador navegue a servicios.html
                return;
            } else if (isExternalLink && isServiciosPage) { // Si estoy en servicios.html y el link es a index.html
                // Deja que el navegador navegue a index.html
                return;
            }

            event.preventDefault(); // Previene el comportamiento por defecto SÓLO si es un enlace interno de SPA

            // Cierra el menú móvil si está abierto
            if (headerBottom && headerBottom.classList.contains('is-open')) {
                headerBottom.classList.remove('is-open');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }

            // Lógica para mostrar la sección correcta según la página actual
            if (isIndexPage) {
                showMainSection(targetId);
            } else if (isServiciosPage) {
                showServiceDetailSection(targetId); // Si tus enlaces de servicios.html apuntan a IDs de secciones
            }

            // Opcional: Actualizar la URL sin recargar la página (para compartir enlaces)
            history.pushState(null, '', `#${targetId}`);

            // Desplázate suavemente a la sección activa después de la navegación de SPA
            scrollToSection(targetId, true); // True para desplazamiento suave
        });
    });

    // =====================================================================
    // Manejo de enlaces específicos
    // =====================================================================

    // Manejar el botón "Conóceme más" en #INICIO
    const internalAboutLink = document.querySelector('.internal-section-link');
    if (internalAboutLink && isIndexPage) {
        internalAboutLink.addEventListener('click', function(event) {
            event.preventDefault();
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
            }
        });
    }

    // Manejar el botón "Saber Más" en las tarjetas de servicio (en index.html si apuntan a servicios.html)
    // Asumo que estos botones redirigen a servicios.html y un hash específico allí.
    const saberMasButtons = document.querySelectorAll('.btn-saber-mas');
    if (saberMasButtons.length > 0 && isIndexPage) {
        saberMasButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                // Aquí, el botón "Saber Más" DEBE tener un href que apunte a servicios.html#ID_DE_SERVICIO
                // No necesitamos event.preventDefault() si estamos haciendo una navegación a otra página HTML.
                // Si el href es, por ejemplo, "servicios.html#terapia-individual"
                // El navegador se encargará de la navegación.
                // Puedes añadir un console.log para verificar el href.
                console.log('Botón "Saber Más" clicado. Redirigiendo a:', this.getAttribute('href'));
            });
        });
    } else if (saberMasButtons.length > 0 && isServiciosPage) {
        // Si estamos en servicios.html y los botones "Saber Más" activan secciones dentro de servicios.html
        saberMasButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Previene el comportamiento por defecto si es una SPA interna
                const targetServiceId = this.getAttribute('data-target-section'); // Asume que tienes un data-target-section
                if (targetServiceId) {
                    showServiceDetailSection(targetServiceId);
                    history.pushState(null, '', `#${targetServiceId}`);
                    scrollToSection(targetServiceId, true);
                } else {
                    console.warn('[saberMasButtons] Botón "Saber Más" en servicios.html sin atributo data-target-section.');
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
        if (isIndexPage) {
            showMainSection(hash || 'INICIO');
        } else if (isServiciosPage) {
            showServiceDetailSection(hash || 'terapia-individual');
        }
    });

    // =====================================================================
    // CÓDIGO DE ENVÍO DE FORMULARIO (EmailJS)
    // =====================================================================

    // Inicializa EmailJS - Asegúrate de reemplazar "Ex-FLrxnRjs86Lv0J" con tu USER ID REAL de EmailJS
    if (typeof emailjs !== 'undefined') { // Asegúrate de que EmailJS se haya cargado
        emailjs.init("Ex-FLrxnRjs86Lv0J"); // Tu Public Key/User ID
    } else {
        console.error("EmailJS no está cargado. Asegúrate de incluir el script de EmailJS antes de este script.");
    }

    // *** FORMULARIO DE CONTACTO EN index.html (ID: contact-form) ***
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto

            if (typeof emailjs !== 'undefined') {
                // Se ha actualizado el Service ID y el Template ID
                emailjs.sendForm('Psico Luismi', 'template_i8e2jgj', this)
                    .then(function() {
                        alert('¡Tu mensaje ha sido enviado con éxito desde la página principal!');
                        contactForm.reset(); // Limpia el formulario
                    }, function(error) {
                        alert('¡Oh! Ha ocurrido un error al enviar el mensaje desde la página principal. Por favor, inténtalo de nuevo. Error: ' + JSON.stringify(error));
                        console.error('EmailJS Error (Main Form):', error);
                    });
            } else {
                alert('El servicio de EmailJS no está disponible para el formulario principal.');
            }
        });
    }

    // *** FORMULARIO DE CONTACTO EN servicios.html (ID: contact-form-sidebar) ***
    const contactFormSidebar = document.getElementById('contact-form-sidebar'); // Selector correcto para el formulario de la barra lateral
    if (contactFormSidebar) {
        contactFormSidebar.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita el envío por defecto

            if (typeof emailjs !== 'undefined') {
                // Se ha actualizado el Service ID y el Template ID
                emailjs.sendForm('Psico Luismi', 'template_i8e2jgj', this) // Asumiendo los mismos IDs que el formulario principal
                    .then(function() {
                        alert('¡Tu mensaje ha sido enviado con éxito desde el formulario de servicios!');
                        contactFormSidebar.reset(); // Limpia el formulario
                    }, function(error) {
                        alert('¡Oh! Ha ocurrido un error al enviar el mensaje desde el formulario de servicios. Por favor, inténtalo de nuevo. Error: ' + JSON.stringify(error));
                        console.error('EmailJS Error (Sidebar Form):', error);
                    });
            } else {
                alert('El servicio de EmailJS no está disponible para el formulario de servicios.');
            }
        });
    }
});
