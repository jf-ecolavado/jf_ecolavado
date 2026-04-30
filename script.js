document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. SCROLL SEQUENCE CANVAS LOGIC (PRIORITY) ---
    const canvas = document.getElementById('scroll-sequence-canvas');
    const canvasMobile = document.getElementById('scroll-sequence-canvas-mobile');

    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 121;
        const currentFrame = index => (
            `./principal/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
        );
        const images = [];
        let imagesLoaded = 0;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(lastDrawnIndex);
        };
        window.addEventListener('resize', resizeCanvas);
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (i === 1) resizeCanvas();
                if (i === frameCount) resizeCanvas();
            };
            images.push(img);
        }
        let lastDrawnIndex = 0;
        const renderFrame = (index) => {
            if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
                const img = images[index];
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio  = Math.max(hRatio, vRatio);
                const cx = (canvas.width - img.width * ratio) / 2;
                const cy = (canvas.height - img.height * ratio) / 2;  
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
                lastDrawnIndex = index;
            }
        };
        let tickingCanvas = false;
        window.addEventListener('scroll', () => {
            if (!tickingCanvas) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    if (maxScroll > 0) {
                        const frac = Math.max(0, Math.min(1, scrollY / maxScroll));
                        renderFrame(Math.floor(frac * (frameCount - 1)));
                    }
                    tickingCanvas = false;
                });
                tickingCanvas = true;
            }
        });
    }

    if (canvasMobile) {
        const ctxM = canvasMobile.getContext('2d');
        const frameCountM = 40;
        const currentFrameM = index => `./principal-movil/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        const imagesM = [];
        let imagesLoadedM = 0;
        let lastDrawnM = 0;
        const resizeCanvasM = () => {
            canvasMobile.width  = window.innerWidth;
            canvasMobile.height = window.innerHeight;
            renderFrameM(lastDrawnM);
        };
        window.addEventListener('resize', resizeCanvasM);
        for (let i = 1; i <= frameCountM; i++) {
            const img = new Image();
            img.src = currentFrameM(i);
            img.onload = () => {
                imagesLoadedM++;
                if (imagesLoadedM === 1) resizeCanvasM();
            }
            imagesM.push(img);
        }
        const renderFrameM = (index) => {
            if (imagesM[index] && imagesM[index].complete && imagesM[index].naturalWidth > 0) {
                const img = imagesM[index];
                const hRatio = canvasMobile.width  / img.width;
                const vRatio = canvasMobile.height / img.height;
                const ratio  = Math.max(hRatio, vRatio);
                const cx = (canvasMobile.width  - img.width  * ratio) / 2;
                const cy = (canvasMobile.height - img.height * ratio) / 2;
                ctxM.clearRect(0, 0, canvasMobile.width, canvasMobile.height);
                ctxM.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
                lastDrawnM = index;
            }
        };
        let tickingM = false;
        window.addEventListener('scroll', () => {
            if (!tickingM) {
                window.requestAnimationFrame(() => {
                    const scrollY   = window.scrollY;
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    if (maxScroll > 0) {
                        const frac = Math.max(0, Math.min(1, scrollY / maxScroll));
                        renderFrameM(Math.floor(frac * (frameCountM - 1)));
                    }
                    tickingM = false;
                });
                tickingM = true;
            }
        });
    }
    
    // --- 1. PRELOADER ---
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    if (loader) {
        // Only show loader if it hasn't been shown in this session
        if (sessionStorage.getItem('jf_loader_shown')) {
            loader.style.display = 'none';
            setTimeout(() => {
                if (typeof revealOnScroll === 'function') revealOnScroll();
            }, 100);
        } else {
            // Wait for kinetic animation to play for a bit
            setTimeout(() => {
                loader.classList.add('fade-out');
                sessionStorage.setItem('jf_loader_shown', 'true');
                setTimeout(() => {
                    if (typeof revealOnScroll === 'function') revealOnScroll();
                }, 500);
            }, 3000); // 3s duration for the cool animation
        }

        // --- SAFETY TIMEOUT ---
        // If anything fails, force hide loader after 5 seconds
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (typeof revealOnScroll === 'function') revealOnScroll();
                }, 500);
            }
        }, 5000);
    } else {
        // If there's no loader (like on subpages), reveal elements immediately
        setTimeout(() => {
            if (typeof revealOnScroll === 'function') revealOnScroll();
        }, 100);
    }

    // --- 1.2 NEWSLETTER SUBSCRIPTION ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const submitBtn = document.getElementById('newsletter-submit');
            const originalText = submitBtn.innerHTML;

            if (!emailInput.value) return;

            submitBtn.innerHTML = 'Uniendo...';
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('Email Suscriptor', emailInput.value);
            formData.append('Tipo de Envío', 'Suscripción Newsletter Ofertas');

            try {
                const response = await fetch('https://getform.io/f/gsgsrq95g39', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.innerHTML = '<span class="btn-text-content">¡Te has unido!</span>';
                    submitBtn.style.background = 'var(--color-green)';
                    emailInput.value = '';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        if (typeof injectStars === 'function') injectStars();
                    }, 4000);
                } else {
                    alert('Hubo un problema. Inténtalo de nuevo.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- 2. STICKY NAV & MOBILE MENU ---
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    });

    // --- 3. SPOTLIGHT EFFECT FOR SERVICE CARDS ---
    const initSpotlightCards = () => {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            // Create spotlight element if it doesn't exist
            let spotlight = card.querySelector('.service-spotlight');
            if (!spotlight) {
                spotlight = document.createElement('div');
                spotlight.className = 'service-spotlight';
                card.appendChild(spotlight);
            }

            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                
                // Update spotlight position
                spotlight.style.opacity = '1';
                spotlight.style.left = `${px * 100}%`;
                spotlight.style.top = `${py * 100}%`;
            });

            card.addEventListener('pointerleave', () => {
                spotlight.style.opacity = '0';
            });
        });
    };
    initSpotlightCards();

    // --- SCROLL REVEAL & CHART ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    const chartBars = document.querySelectorAll('.chart-bar');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Safety check for style attribute
                const styleAttr = bar.getAttribute('style');
                if (styleAttr && styleAttr.includes('width')) {
                    const match = styleAttr.match(/width:\s*(\d+)%/);
                    if (match && match[1]) {
                        const targetWidth = match[1];
                        bar.style.width = targetWidth + '%';
                    }
                }
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    chartBars.forEach(bar => {
        // Inicializar a 0 para que la transición sea visible
        bar.style.width = '0';
        barObserver.observe(bar);
    });

    // --- 4. GLOW CARD POINTER SYNC ---
    const syncPointer = (e) => {
        const x = e.clientX.toFixed(2);
        const y = e.clientY.toFixed(2);
        const xp = (e.clientX / window.innerWidth).toFixed(2);
        const yp = (e.clientY / window.innerHeight).toFixed(2);
        
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--y', y);
        document.documentElement.style.setProperty('--xp', xp);
        document.documentElement.style.setProperty('--yp', yp);
    };

    document.addEventListener('pointermove', syncPointer);



    // --- URL PARAMS HANDLER ---
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        const size = urlParams.get('size');
        const pkg = urlParams.get('pkg');

        if (service) {
            const serviceSelect = document.getElementById('servicio');
            if (serviceSelect) {
                serviceSelect.value = service;
                serviceSelect.dispatchEvent(new Event('change')); // Activa la lógica de mostrar/ocultar
            }
        }

        if (size) {
            const sizeSelect = document.getElementById('medida_colchon');
            if (sizeSelect) {
                sizeSelect.value = size;
                sizeSelect.dispatchEvent(new Event('change'));
            }
        }

        if (pkg) {
            const pkgRadio = document.querySelector(`input[name="paquete_coche"][value="${pkg}"]`);
            if (pkgRadio) {
                pkgRadio.checked = true;
                pkgRadio.dispatchEvent(new Event('change'));
            }
        }
    }

    // Ejecutar después de un pequeño delay para asegurar que otros scripts cargaron
    setTimeout(handleUrlParams, 100);

    // Fallback para elementos reveal en móvil (por si el observer falla o es lento)
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.active)').forEach(el => {
            el.classList.add('active');
        });
    }, 2000);

    // --- 5. SPARKLES EFFECT ---
    async function initSparkles() {
        if (typeof tsParticles === 'undefined') return;

        const options = {
            fullScreen: { enable: false },
            fpsLimit: 120,
            particles: {
                color: { value: "#ffffff" },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    random: true,
                    speed: 0.8,
                    straight: false
                },
                number: {
                    density: { enable: true, width: 800, height: 800 },
                    value: 120
                },
                opacity: {
                    value: { min: 0.2, max: 1 },
                    animation: {
                        enable: true,
                        speed: 3,
                        sync: false
                    }
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 1.5, max: 3.5 },
                    animation: {
                        enable: true,
                        speed: 3,
                        sync: false
                    }
                }
            },
            detectRetina: true
        };

        const containers = document.querySelectorAll('.sparkles-canvas');
        containers.forEach(async (container) => {
            if (container.id) {
                try {
                    await tsParticles.load({ id: container.id, options: options });
                } catch (e) {
                    console.error("Error loading tsParticles for " + container.id, e);
                }
            }
        });
    }
    
    // Ejecutar después de que todo cargue
    window.addEventListener('load', initSparkles);

    // --- 6. PARALLAX HERO EFFECT ---
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    // Only animate if hero is visible
                    if (scrolled < window.innerHeight) {
                        // Move background down as you scroll down
                        heroBg.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- 4. SCROLL REVEAL ---
    window.addEventListener('scroll', revealOnScroll);
    // Initial call to reveal elements already in viewport
    revealOnScroll();

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // --- 4.5 IMAGE SEQUENCE ANIMATION LOGIC ---
    const sequenceContainers = document.querySelectorAll('.sequence-container');

    sequenceContainers.forEach(container => {
        const folder = container.dataset.folder;
        const totalFrames = parseInt(container.dataset.frames);
        
        // Preload and create img tags
        for (let i = 1; i <= totalFrames; i++) {
            const img = document.createElement('img');
            // Format number to 3 digits (e.g., 001, 040, 128)
            const frameNum = i.toString().padStart(3, '0');
            img.src = `${folder}/ezgif-frame-${frameNum}.jpg`;
            img.className = 'sequence-img';
            if (i === 1) img.classList.add('active'); // show first frame
            container.appendChild(img);
        }

        // Animate
        let currentFrame = 0;
        let interval;
        const images = container.querySelectorAll('.sequence-img');

        const playAnimation = () => {
            interval = setInterval(() => {
                images[currentFrame].classList.remove('active');
                currentFrame = (currentFrame + 1) % totalFrames;
                images[currentFrame].classList.add('active');
            }, 60); // approx 16fps
        };

        const stopAnimation = () => {
            clearInterval(interval);
        };

        // Play on hover
        container.parentElement.parentElement.addEventListener('mouseenter', playAnimation);
        container.parentElement.parentElement.addEventListener('mouseleave', stopAnimation);
        
        // Also play if it becomes visible in viewport (IntersectionObserver)
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        playAnimation();
                    } else {
                        stopAnimation();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(container.parentElement.parentElement);
        }
    });

    // --- 5. SCROLL SPY ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // --- 6. FAQ ACCORDION ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            
            // Close others
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // --- 7. COOKIE BANNER (Disabled by user request for cleaner UI) ---
    /*
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');
    const configCookies = document.getElementById('config-cookies');

    // Check if user already acted on cookies
    const cookieConsent = localStorage.getItem('jf_cookie_consent');
    
    if (cookieBanner && acceptCookies && rejectCookies && configCookies) {
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
        }

        const closeBanner = (status) => {
            localStorage.setItem('jf_cookie_consent', status);
            cookieBanner.classList.remove('show');
        };

        acceptCookies.addEventListener('click', () => closeBanner('accepted'));
        rejectCookies.addEventListener('click', () => closeBanner('rejected'));
        configCookies.addEventListener('click', () => {
            window.location.href = "politica-cookies.html";
        });
    }

    // --- 8. FORM SUBMISSION (EMAIL + WHATSAPP) ---
    const form = document.getElementById('presupuesto-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const privacyChecked = document.querySelector('input[name="privacidad"]').checked;
            if (!privacyChecked) {
                alert('Debes aceptar la Política de Privacidad.');
                return;
            }

            const servicio = document.getElementById('servicio').value;
            const fotosInput = document.getElementById('fotos');
            if ((servicio === 'sofas' || servicio === 'alfombras') && (!fotosInput.files || fotosInput.files.length === 0)) {
                alert('Para servicios de Sofás o Alfombras, es obligatorio subir al menos una foto para poder darte un presupuesto exacto.');
                fotosInput.focus();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text-content">Enviando...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const total = document.getElementById('cart-total').textContent;
            formData.append('Precio Estimado', total);

            try {
                // 1. SEND TO GETFORM (EMAIL WITH PHOTOS)
                const response = await fetch('https://getform.io/f/gsgsrq95g39', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 2. BUILD AND OPEN WHATSAPP
                    const nombre = formData.get('nombre');
                    const telefono = formData.get('telefono');
                    const zona = formData.get('zona');
                    const paquete = formData.get('paquete_coche');
                    const tamano = formData.get('tamano_coche');
                    const colchon = formData.get('medida_colchon');
                    const suciedad = formData.get('suciedad');
                    const fecha = formData.get('fecha');
                    const hora = formData.get('hora');
                    const mensaje = formData.get('mensaje');

                    let waMsg = `*SOLICITUD DE PRESUPUESTO - JF ECOLAVADO*%0A%0A`;
                    waMsg += `*Cliente:* ${nombre}%0A`;
                    waMsg += `*Teléfono:* ${telefono}%0A`;
                    waMsg += `*Ubicación:* ${zona}%0A%0A`;
                    
                    waMsg += `*SERVICIO SELECCIONADO:*%0A`;
                    if (servicio === 'vehiculos') {
                        waMsg += `• Lavado de Vehículo (${tamano})%0A`;
                        waMsg += `• Paquete: ${paquete.charAt(0).toUpperCase() + paquete.slice(1)}%0A`;
                    } else if (servicio === 'colchones') {
                        waMsg += `• Limpieza de Colchón (${colchon}cm)%0A`;
                    } else if (servicio === 'sofas') {
                        waMsg += `• Limpieza de Sofás / Butacas%0A`;
                    } else if (servicio === 'alfombras') {
                        waMsg += `• Limpieza de Alfombras%0A`;
                    }

                    let extras = [];
                    if (formData.get('extra_pelos')) extras.push('Eliminación de pelos');
                    if (formData.get('extra_faros')) extras.push('Pulido de faros');
                    if (formData.get('extra_plasticos')) extras.push('Recuperar plásticos');
                    if (formData.get('manchas')) extras.push('Tratamiento de manchas');
                    if (formData.get('mascotas')) extras.push('Pelos de mascota');
                    
                    if (extras.length > 0) {
                        waMsg += `%0A*EXTRAS:*%0A• ${extras.join('%0A• ')}%0A`;
                    }

                    waMsg += `%0A*DETALLES:*%0A`;
                    waMsg += `• Suciedad: ${suciedad}%0A`;
                    if (fecha) waMsg += `• Fecha: ${fecha}%0A`;
                    if (hora) waMsg += `• Hora: ${hora}%0A`;
                    if (mensaje) waMsg += `%0A*Nota:* ${mensaje}%0A`;

                    waMsg += `%0A*PRECIO ESTIMADO:* ${total}%0A%0A`;
                    waMsg += `_Le acabo de enviar las fotos también por correo electrónico._`;

                    const waURL = `https://wa.me/34614423060?text=${waMsg}`;
                    
                    alert('¡Presupuesto enviado correctamente al correo! Ahora te redirigimos a WhatsApp para confirmar.');
                    window.open(waURL, '_blank');
                    form.reset();
                    document.getElementById('fotos-preview').innerHTML = '';
                    updateCart();
                } else {
                    alert('Hubo un problema al enviar el correo. Por favor, inténtalo de nuevo o contáctanos por WhatsApp directamente.');
                }
            } catch (error) {
                alert('Error de conexión. Por favor, revisa tu internet.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- 8.1 PHOTO PREVIEW LOGIC ---
    const fotosInput = document.getElementById('fotos');
    const fotosPreview = document.getElementById('fotos-preview');
    if (fotosInput && fotosPreview) {
        fotosInput.addEventListener('change', function() {
            fotosPreview.innerHTML = '';
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'preview-thumb';
                        fotosPreview.appendChild(img);
                    }
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    // --- 9. CLICK BUBBLE EFFECT LOGIC ---
    document.addEventListener('click', (e) => {
        // Crear partículas de burbuja (50 por clic)
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('bubble-particle');
            
            const size = Math.random() * 15 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.8;
            const distance = Math.random() * maxDistance + 50;
            
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    });

    // --- 11. FORM CONDITIONAL LOGIC ---
    const dateInput = document.getElementById('fecha');
    if (dateInput) {
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        dateInput.addEventListener('input', function(e) {
            const date = new Date(this.value);
            if (date.getUTCDay() === 0) {
                alert('Lo sentimos, los domingos descansamos. Por favor, selecciona otro día para realizar la limpieza.');
                this.value = '';
            }
        });
    }

    const servicioSelect = document.getElementById('servicio');
    const paqueteCocheGroup = document.getElementById('grupo-paquete-coche');
    const medidasColchonGroup = document.getElementById('grupo-medidas-colchon');
    const medidaColchonSelect = document.querySelector('input[name="medida_colchon"]:checked');
    const fotosGroup = document.getElementById('grupo-fotos');
    
    if (servicioSelect) {
        servicioSelect.addEventListener('change', function() {
            // Lógica para vehículos
            if (paqueteCocheGroup) {
                const radios = document.querySelectorAll('input[name="paquete_coche"]');
                if (this.value === 'vehiculos') {
                    paqueteCocheGroup.style.display = 'flex';
                    radios.forEach(r => r.required = true);
                } else {
                    paqueteCocheGroup.style.display = 'none';
                    radios.forEach(r => { r.required = false; r.checked = false; });
                }
            }
            
            // Lógica para colchones
            if (medidasColchonGroup) {
                const radios = document.querySelectorAll('input[name="medida_colchon"]');
                if (this.value === 'colchones') {
                    medidasColchonGroup.style.display = 'block';
                    radios.forEach(r => r.required = true);
                } else {
                    medidasColchonGroup.style.display = 'none';
                    radios.forEach(r => { r.required = false; r.checked = false; });
                }
            }

            // Lógica para Fotos (Sofás y Alfombras) - Managed in updateCart for consistency
        });
    }

    // --- 12. AUTO-SELECT SERVICE FROM BUTTONS ---
    const serviceButtons = document.querySelectorAll('a[data-service]');
    if (servicioSelect) {
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // The default behavior will scroll to #presupuesto
                const serviceToSelect = this.getAttribute('data-service');
                if (servicioSelect.querySelector(`option[value="${serviceToSelect}"]`)) {
                    servicioSelect.value = serviceToSelect;
                    // Trigger the change event to show/hide the car packages
                    servicioSelect.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    // --- 16. WHATSAPP CHAT WIDGET ---
    const waFab    = document.getElementById('wa-fab');
    const waBubble = document.getElementById('wa-chat-bubble');
    const waClose  = document.getElementById('wa-close-bubble');
    const waBadge  = document.getElementById('wa-fab-badge');

    if (waFab && waBubble) {
        let bubbleOpen = false;

        const openBubble = () => {
            waBubble.classList.add('visible');
            waBadge && waBadge.classList.add('hidden');
            bubbleOpen = true;
        };

        const closeBubble = () => {
            waBubble.classList.remove('visible');
            bubbleOpen = false;
        };

        // Auto-show after 10 seconds (only once per session)
        if (!sessionStorage.getItem('jf_wa_shown')) {
            setTimeout(() => {
                openBubble();
                sessionStorage.setItem('jf_wa_shown', 'true');
            }, 20000);
        } else {
            // Badge stays but bubble doesn't auto-open
        }

        // Toggle on FAB click
        waFab.addEventListener('click', () => {
            bubbleOpen ? closeBubble() : openBubble();
        });

        // Close button
        if (waClose) {
            waClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeBubble();
            });
        }
    }
    const comparisonSliders = document.querySelectorAll('.comparison-slider');
    comparisonSliders.forEach(slider => {
        const input = slider.querySelector('.slider-input');
        input.addEventListener('input', (e) => {
            slider.style.setProperty('--position', `${e.target.value}%`);
        });
    });



    // --- 15. PRE-FILL FORM FROM URL PARAMETERS ---
    const urlParams = new URLSearchParams(window.location.search);
    const pkgParam = urlParams.get('pkg');
    if (pkgParam && servicioSelect) {
        // First select 'Vehículos'
        servicioSelect.value = 'vehiculos';
        servicioSelect.dispatchEvent(new Event('change'));
        
        // Use a small timeout to let the change event display the car packages
        setTimeout(() => {
            // Select the radio button
            const pkgRadio = document.getElementById(`pkg_${pkgParam}`);
            if (pkgRadio) {
                pkgRadio.checked = true;
            }
            
            // Handle Extras
            if (urlParams.get('extra_pelos') === 'si') {
                const cb = document.querySelector('input[name="extra_pelos"]');
                if (cb) cb.checked = true;
            }
            if (urlParams.get('extra_faros') === 'si') {
                const cb = document.querySelector('input[name="extra_faros"]');
                if (cb) cb.checked = true;
            }
            if (urlParams.get('extra_plasticos') === 'si') {
                const cb = document.querySelector('input[name="extra_plasticos"]');
                if (cb) cb.checked = true;
            }
        }, 300);
    }
    // --- 17. SHOPPING CART CALCULATION LOGIC ---
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const tamanoCocheGroup = document.getElementById('grupo-tamano-coche');
    const formFields = form.querySelectorAll('input, select');

    const pricing = {
        vehiculos: {
            estandar: { pequeno: 40, mediano: 45, grande: 50 },
            premium: { pequeno: 115, mediano: 130, grande: 145 },
            tapiceria: { pequeno: 60, mediano: 80, grande: 100 }
        },
        colchones: {
            '90': 50, '135': 55, '150': 60, '180': 65, '200': 75
        },
        sofas: 30, // por plaza/butaca (base)
        alfombras: 15, // base
        extras: {
            extra_pelos: 15,
            extra_faros: 30,
            extra_plasticos: 20
        },
        suplementos: {
            '0': 0, '1': 5, '2': 10, '3': 15, '4': 20, '5': 25, '6': 30
        }
    };

    const updateCart = () => {
        if (!cartItems || !cartTotal) return;

        let total = 0;
        let html = '';
        const formData = new FormData(form);

        const servicio = formData.get('servicio');
        const municipioSelect = document.getElementById('zona');
        const zone = municipioSelect.options[municipioSelect.selectedIndex]?.dataset.zone;
        
        // 1. Travel Supplement
        if (zone !== undefined && pricing.suplementos[zone] > 0) {
            const supplement = pricing.suplementos[zone];
            total += supplement;
            html += `<div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-name">Desplazamiento</span>
                            <span class="cart-item-detail">${municipioSelect.value} (Zona ${zone})</span>
                        </div>
                        <span class="cart-item-price">+${supplement}€</span>
                    </div>`;
        }

        // 2. Main Service & Dynamic Fields
        const fotosGroup = document.getElementById('grupo-fotos');
        if (fotosGroup) {
            if (servicio === 'sofas' || servicio === 'alfombras') {
                fotosGroup.style.display = 'block';
            } else {
                fotosGroup.style.display = 'none';
            }
        }

        if (servicio === 'vehiculos') {
            if (tamanoCocheGroup) tamanoCocheGroup.style.display = 'block';
            const paquete = formData.get('paquete_coche');
            const tamano = formData.get('tamano_coche') || 'mediano';
            
            if (paquete && pricing.vehiculos[paquete]) {
                const price = pricing.vehiculos[paquete][tamano];
                total += price;
                html += `<div class="cart-item">
                            <div class="cart-item-info">
                                <span class="cart-item-name">Lavado ${paquete.charAt(0).toUpperCase() + paquete.slice(1)}</span>
                                <span class="cart-item-detail">Vehículo ${tamano}</span>
                            </div>
                            <span class="cart-item-price">${price}€</span>
                        </div>`;
            }
        } else if (servicio === 'colchones') {
            if (tamanoCocheGroup) tamanoCocheGroup.style.display = 'none';
            const medida = formData.get('medida_colchon');
            if (medida && pricing.colchones[medida]) {
                const price = pricing.colchones[medida];
                total += price;
                html += `<div class="cart-item">
                            <div class="cart-item-info">
                                <span class="cart-item-name">Limpieza Colchón</span>
                                <span class="cart-item-detail">Medida ${medida}cm</span>
                            </div>
                            <span class="cart-item-price">${price}€</span>
                        </div>`;
            }
        } else if (servicio === 'sofas' || servicio === 'alfombras') {
            if (tamanoCocheGroup) tamanoCocheGroup.style.display = 'none';
            const price = pricing[servicio];
            total += price;
            html += `<div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-name">Limpieza de ${servicio === 'sofas' ? 'Butaca / Sofá' : 'Alfombra'}</span>
                            <span class="cart-item-detail">${servicio === 'sofas' ? 'Precio por plaza/butaca' : 'Precio base (según medidas)'}</span>
                        </div>
                        <span class="cart-item-price">${price}€</span>
                    </div>`;
        } else {
            if (tamanoCocheGroup) tamanoCocheGroup.style.display = 'none';
        }

        // 3. Extras
        for (const [extra, price] of Object.entries(pricing.extras)) {
            if (formData.get(extra) === 'si' || formData.get(extra) === 'on') {
                total += price;
                const name = extra.replace('extra_', '').replace('_', ' ');
                html += `<div class="cart-item">
                            <div class="cart-item-info">
                                <span class="cart-item-name">Extra: ${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                            </div>
                            <span class="cart-item-price">+${price}€</span>
                        </div>`;
            }
        }

        if (html === '') {
            cartItems.innerHTML = '<p class="empty-cart">Completa el formulario para ver el resumen.</p>';
            cartTotal.textContent = '0€';
        } else {
            cartItems.innerHTML = html;
            cartTotal.textContent = total + '€';
        }
    };

    // Add listeners to all relevant fields
    formFields.forEach(field => {
        field.addEventListener('change', updateCart);
        field.addEventListener('input', updateCart);
    });

    // Special trigger for service changes to ensure layout updates
    if (servicioSelect) {
        servicioSelect.addEventListener('change', updateCart);
    }

    // Initial update
    updateCart();

    // --- 18. MAGIC STAR INJECTION LOGIC ---
    function injectStars() {
        const buttons = document.querySelectorAll('.btn, .btn-solid, .btn-outline, .btn-text, .newsletter-btn, .package-btn, .wa-reply-btn');
        const starSvg = `
            <svg viewBox="0 0 784.11 815.53" class="btn-star">
                <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
            </svg>`;

        buttons.forEach(btn => {
            // Evitar inyectar múltiples veces
            if (btn.querySelector('.btn-star')) return;

            // Inyectar 6 estrellas con clases secuenciales
            for (let i = 1; i <= 6; i++) {
                const starWrap = document.createElement('div');
                starWrap.className = `btn-star star-${i}`;
                starWrap.innerHTML = starSvg;
                btn.appendChild(starWrap);
            }
        });
    }

    // Ejecutar al cargar y cada vez que cambie el DOM (por si aparecen botones nuevos)
    injectStars();
    
    // Observer para manejar botones que aparecen dinámicamente (como en el modal de extras)
    const observer = new MutationObserver((mutations) => {
        injectStars();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
