document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DEFINICIÓN DE FUNCIONES GLOBALES & REVEAL LOGIC ---
    
    // Función de revelado de elementos al hacer scroll (Intersection Observer - Más eficiente)
    const initRevealObserver = () => {
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
                    const style = bar.getAttribute('style');
                    if (style) {
                        const match = style.match(/width:\s*(\d+)%/);
                        if (match) {
                            bar.style.width = match[1] + '%';
                        }
                    }
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });

        chartBars.forEach(bar => {
            bar.style.width = '0';
            barObserver.observe(bar);
        });
    };

    // Función manual para forzar el revelado (útil para el preloader o fallbacks)
    const forceReveal = () => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    };

    // --- 2. PRELOADER ---
    const loader = document.getElementById('loader');
    if (loader) {
        if (sessionStorage.getItem('jf_loader_shown')) {
            loader.style.display = 'none';
            setTimeout(forceReveal, 100);
        } else {
            setTimeout(() => {
                loader.classList.add('fade-out');
                sessionStorage.setItem('jf_loader_shown', 'true');
                setTimeout(forceReveal, 800);
            }, 3000); // 3s para la animación cinética
        }
    } else {
        setTimeout(forceReveal, 100);
    }

    // --- 3. UNIFICACIÓN DE PARÁMETROS URL ---
    const handleUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        const pkg = urlParams.get('pkg');
        const size = urlParams.get('size');
        
        const servicioSelect = document.getElementById('servicio');
        
        if (service && servicioSelect) {
            servicioSelect.value = service;
            servicioSelect.dispatchEvent(new Event('change'));
        }

        if (pkg && servicioSelect) {
            servicioSelect.value = 'vehiculos';
            servicioSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const pkgRadio = document.getElementById(`pkg_${pkg}`) || document.querySelector(`input[name="paquete_coche"][value="${pkg}"]`);
                if (pkgRadio) {
                    pkgRadio.checked = true;
                    pkgRadio.dispatchEvent(new Event('change'));
                }
                
                // Extras desde URL
                const extras = ['pelos', 'faros', 'plasticos'];
                extras.forEach(extra => {
                    if (urlParams.get(`extra_${extra}`) === 'si') {
                        const cb = document.querySelector(`input[name="extra_${extra}"]`);
                        if (cb) {
                            cb.checked = true;
                            cb.dispatchEvent(new Event('change'));
                        }
                    }
                });
            }, 300);
        }

        if (size) {
            setTimeout(() => {
                const sizeRadio = document.querySelector(`input[name="medida_colchon"][value="${size}"]`);
                if (sizeRadio) {
                    sizeRadio.checked = true;
                    sizeRadio.dispatchEvent(new Event('change'));
                }
            }, 300);
        }
    };

    // --- 4. NAVEGACIÓN STICKY & MENÚ MÓVIL ---
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    });

    // --- 5. SPOTLIGHT EFFECT (TARJETAS DE SERVICIO) ---
    const initSpotlightCards = () => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
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
                spotlight.style.opacity = '1';
                spotlight.style.left = `${px * 100}%`;
                spotlight.style.top = `${py * 100}%`;
            });

            card.addEventListener('pointerleave', () => {
                spotlight.style.opacity = '0';
            });
        });
    };

    // --- 6. POINTER SYNC (CSS VARIABLES) ---
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

    // --- 7. TSPARTICLES SPARKLES ---
    async function initSparkles() {
        if (typeof tsParticles === 'undefined') return;
        const options = {
            fullScreen: { enable: false },
            fpsLimit: 120,
            particles: {
                color: { value: "#ffffff" },
                move: { enable: true, speed: 0.8, random: true },
                number: { density: { enable: true, width: 800, height: 800 }, value: 120 },
                opacity: { value: { min: 0.2, max: 1 }, animation: { enable: true, speed: 3 } },
                size: { value: { min: 1.5, max: 3.5 }, animation: { enable: true, speed: 3 } }
            },
            detectRetina: true
        };
        const containers = document.querySelectorAll('.sparkles-canvas');
        containers.forEach(async (container) => {
            if (container.id) await tsParticles.load({ id: container.id, options: options });
        });
    }

    // --- 8. PARALLAX HERO ---
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
            }
        });
    }

    // --- 9. FAQ ACCORDION ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            item.classList.toggle('active');
            answer.style.maxHeight = item.classList.contains('active') ? answer.scrollHeight + 'px' : null;
        });
    });

    // --- 10. COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner && !localStorage.getItem('jf_cookie_consent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('jf_cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });
        document.getElementById('reject-cookies').addEventListener('click', () => {
            localStorage.setItem('jf_cookie_consent', 'rejected');
            cookieBanner.classList.remove('show');
        });
        document.getElementById('config-cookies').addEventListener('click', () => {
            window.location.href = "politica-cookies.html";
        });
    }

    // --- 11. NEWSLETTER ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const submitBtn = document.getElementById('newsletter-submit');
            if (!emailInput.value) return;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Uniendo...';
            submitBtn.disabled = true;
            
            const formData = new FormData();
            formData.append('Email Suscriptor', emailInput.value);
            formData.append('Tipo de Envío', 'Suscripción Newsletter Ofertas');

            try {
                const res = await fetch('https://getform.io/f/gsgsrq95g39', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    submitBtn.innerHTML = '¡Te has unido!';
                    emailInput.value = '';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 4000);
                }
            } catch (err) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- 12. WHATSAPP CHAT WIDGET ---
    const waFab = document.getElementById('wa-fab');
    const waBubble = document.getElementById('wa-chat-bubble');
    const waClose = document.getElementById('wa-close-bubble');
    if (waFab && waBubble) {
        const toggleBubble = () => waBubble.classList.toggle('visible');
        waFab.addEventListener('click', toggleBubble);
        if (waClose) waClose.addEventListener('click', (e) => {
            e.stopPropagation();
            waBubble.classList.remove('visible');
        });
        if (!sessionStorage.getItem('jf_wa_shown')) {
            setTimeout(() => {
                waBubble.classList.add('visible');
                sessionStorage.setItem('jf_wa_shown', 'true');
            }, 20000);
        }
    }

    // --- 13. COMPARISON SLIDERS (RESULTADOS) ---
    const comparisonSliders = document.querySelectorAll('.comparison-slider');
    comparisonSliders.forEach(slider => {
        const input = slider.querySelector('.slider-input');
        if (input) {
            input.addEventListener('input', (e) => {
                slider.style.setProperty('--position', `${e.target.value}%`);
            });
        }
    });

    // --- 14. BUBBLE CLICK EFFECT (INTENSIFICADO) ---
    document.addEventListener('mousedown', (e) => {
        // Solo en escritorio o con ratón para no molestar en scroll móvil
        if (window.matchMedia("(hover: hover)").matches) {
            const colors = ['#8AC34A', '#6AC1C5', '#FFFFFF'];
            for (let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.className = 'bubble-particle';
                
                const size = Math.random() * 15 + 8;
                p.style.width = p.style.height = size + 'px';
                
                // Color aleatorio de la paleta
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                p.style.left = e.clientX + 'px';
                p.style.top = e.clientY + 'px';
                
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 250 + 100; // Más distancia
                
                p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
                p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
                
                document.body.appendChild(p);
                // Tiempo de vida coincide con la animación CSS
                setTimeout(() => p.remove(), 1200);
            }
        }
    });

    // --- 15. SCROLL SEQUENCE CANVAS (DESKTOP) ---
    const canvas = document.getElementById('scroll-sequence-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 121;
        const images = [];
        let imagesLoaded = 0;
        let lastDrawnIndex = 0;

        const renderFrame = (index) => {
            const img = images[index];
            if (img && img.complete) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const cx = (canvas.width - img.width * ratio) / 2;
                const cy = (canvas.height - img.height * ratio) / 2;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
                lastDrawnIndex = index;
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(lastDrawnIndex);
        };
        window.addEventListener('resize', resize);

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `principal/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            img.onload = () => {
                imagesLoaded++;
                if (i === 1) resize();
            };
            images.push(img);
        }

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const frac = Math.max(0, Math.min(1, window.scrollY / maxScroll));
            renderFrame(Math.floor(frac * (frameCount - 1)));
        });
    }

    // --- 16. SCROLL SEQUENCE CANVAS (MOBILE) ---
    const canvasMobile = document.getElementById('scroll-sequence-canvas-mobile');
    if (canvasMobile) {
        const ctxM = canvasMobile.getContext('2d');
        const frameCountM = 40;
        const imagesM = [];
        let lastDrawnM = 0;

        const renderFrameM = (index) => {
            const img = imagesM[index];
            if (img && img.complete) {
                const hRatio = canvasMobile.width / img.width;
                const vRatio = canvasMobile.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const cx = (canvasMobile.width - img.width * ratio) / 2;
                const cy = (canvasMobile.height - img.height * ratio) / 2;
                ctxM.clearRect(0, 0, canvasMobile.width, canvasMobile.height);
                ctxM.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
                lastDrawnM = index;
            }
        };

        const resizeM = () => {
            canvasMobile.width = window.innerWidth;
            canvasMobile.height = window.innerHeight;
            renderFrameM(lastDrawnM);
        };
        window.addEventListener('resize', resizeM);

        for (let i = 1; i <= frameCountM; i++) {
            const img = new Image();
            img.src = `principal%20movil/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            img.onload = () => { if (i === 1) resizeM(); };
            imagesM.push(img);
        }

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const frac = Math.max(0, Math.min(1, window.scrollY / maxScroll));
            renderFrameM(Math.floor(frac * (frameCountM - 1)));
        });
    }

    // --- 17. PRESUPUESTO & CARRITO LOGIC ---
    const form = document.getElementById('presupuesto-form');
    if (form) {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const pricing = {
            vehiculos: {
                estandar: { pequeno: 40, mediano: 45, grande: 50 },
                premium: { pequeno: 115, mediano: 130, grande: 145 },
                tapiceria: { pequeno: 60, mediano: 80, grande: 100 }
            },
            colchones: { '90': 50, '135': 55, '150': 60, '180': 65, '200': 75 },
            sofas: 30, alfombras: 15,
            extras: { extra_pelos: 15, extra_faros: 30, extra_plasticos: 20 },
            suplementos: { '0': 0, '1': 5, '2': 10, '3': 15, '4': 20, '5': 25, '6': 30 }
        };

        const updateCart = () => {
            if (!cartItems || !cartTotal) return;
            let total = 0;
            let html = '';
            const formData = new FormData(form);
            const servicio = formData.get('servicio');
            
            // Suplemento Zona
            const munSelect = document.getElementById('zona');
            const zone = munSelect.options[munSelect.selectedIndex]?.dataset.zone;
            if (zone !== undefined && pricing.suplementos[zone] > 0) {
                total += pricing.suplementos[zone];
                html += `<div class="cart-item"><div class="cart-item-info"><span class="cart-item-name">Desplazamiento</span><span class="cart-item-detail">${munSelect.value}</span></div><span class="cart-item-price">+${pricing.suplementos[zone]}€</span></div>`;
            }

            // Lógica por servicio
            if (servicio === 'vehiculos') {
                document.getElementById('grupo-tamano-coche').style.display = 'block';
                document.getElementById('grupo-paquete-coche').style.display = 'block';
                document.getElementById('grupo-medidas-colchon').style.display = 'none';
                const pkg = formData.get('paquete_coche');
                const size = formData.get('tamano_coche') || 'mediano';
                if (pkg && pricing.vehiculos[pkg]) {
                    const p = pricing.vehiculos[pkg][size];
                    total += p;
                    html += `<div class="cart-item"><div class="cart-item-info"><span class="cart-item-name">Lavado ${pkg}</span><span class="cart-item-detail">${size}</span></div><span class="cart-item-price">${p}€</span></div>`;
                }
            } else if (servicio === 'colchones') {
                document.getElementById('grupo-tamano-coche').style.display = 'none';
                document.getElementById('grupo-paquete-coche').style.display = 'none';
                document.getElementById('grupo-medidas-colchon').style.display = 'block';
                const m = formData.get('medida_colchon');
                if (m && pricing.colchones[m]) {
                    total += pricing.colchones[m];
                    html += `<div class="cart-item"><div class="cart-item-info"><span class="cart-item-name">Colchón</span><span class="cart-item-detail">${m}cm</span></div><span class="cart-item-price">${pricing.colchones[m]}€</span></div>`;
                }
            } else if (servicio === 'sofas' || servicio === 'alfombras') {
                document.getElementById('grupo-tamano-coche').style.display = 'none';
                document.getElementById('grupo-paquete-coche').style.display = 'none';
                document.getElementById('grupo-medidas-colchon').style.display = 'none';
                total += pricing[servicio];
                html += `<div class="cart-item"><div class="cart-item-info"><span class="cart-item-name">Limpieza ${servicio}</span><span class="cart-item-detail">Precio base</span></div><span class="cart-item-price">${pricing[servicio]}€</span></div>`;
            }

            // Extras
            for (const [key, val] of Object.entries(pricing.extras)) {
                if (formData.get(key) === 'on' || formData.get(key) === 'si') {
                    total += val;
                    html += `<div class="cart-item"><div class="cart-item-info"><span class="cart-item-name">Extra: ${key.split('_')[1]}</span></div><span class="cart-item-price">+${val}€</span></div>`;
                }
            }

            cartItems.innerHTML = html || '<p class="empty-cart">Completa el formulario para ver el resumen.</p>';
            cartTotal.textContent = total + '€';
            
            // Mostrar/Ocultar fotos
            const fGroup = document.getElementById('grupo-fotos');
            if (fGroup) fGroup.style.display = (servicio === 'sofas' || servicio === 'alfombras') ? 'block' : 'none';
        };

        form.addEventListener('input', updateCart);
        form.addEventListener('change', updateCart);
        
        // WhatsApp Submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Enviando...';
            
            const formData = new FormData(form);
            const total = cartTotal.textContent;
            const servicio = formData.get('servicio');
            
            let waMsg = `*SOLICITUD DE PRESUPUESTO - JF ECOLAVADO*%0A%0A`;
            waMsg += `*Cliente:* ${formData.get('nombre')}%0A`;
            waMsg += `*Teléfono:* ${formData.get('telefono')}%0A`;
            waMsg += `*Ubicación:* ${formData.get('zona')}%0A%0A`;
            
            waMsg += `*SERVICIO SELECCIONADO:*%0A`;
            if (servicio === 'vehiculos') {
                waMsg += `• Lavado de Vehículo (${formData.get('tamano_coche')})%0A`;
                waMsg += `• Paquete: ${formData.get('paquete_coche')}%0A`;
            } else if (servicio === 'colchones') {
                waMsg += `• Limpieza de Colchón (${formData.get('medida_colchon')}cm)%0A`;
            } else {
                waMsg += `• Limpieza de ${servicio.charAt(0).toUpperCase() + servicio.slice(1)}%0A`;
            }

            let extras = [];
            if (formData.get('extra_pelos')) extras.push('Pelos de mascota');
            if (formData.get('extra_faros')) extras.push('Pulido de faros');
            if (formData.get('extra_plasticos')) extras.push('Hidratación plásticos');
            if (formData.get('manchas')) extras.push('Tratamiento manchas');
            
            if (extras.length > 0) {
                waMsg += `%0A*EXTRAS:*%0A• ${extras.join('%0A• ')}%0A`;
            }

            waMsg += `%0A*DETALLES:*%0A`;
            waMsg += `• Suciedad: ${formData.get('suciedad')}%0A`;
            if (formData.get('fecha')) waMsg += `• Fecha: ${formData.get('fecha')}%0A`;
            if (formData.get('mensaje')) waMsg += `%0A*Nota:* ${formData.get('mensaje')}%0A`;

            waMsg += `%0A*PRECIO ESTIMADO:* ${total}%0A%0A`;
            waMsg += `_Enviado desde la web jfecolavado.es_`;

            window.open(`https://wa.me/34614423060?text=${waMsg}`, '_blank');
            
            btn.disabled = false;
            btn.innerHTML = originalText;
        });
    }

    // --- 18. MAGIC STAR INJECTION ---
    const injectStars = () => {
        const starSvg = `<svg viewBox="0 0 784.11 815.53" class="btn-star"><path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" /></svg>`;
        document.querySelectorAll('.btn, .btn-solid, .btn-outline, .newsletter-btn').forEach(btn => {
            if (!btn.querySelector('.btn-star')) {
                for (let i = 1; i <= 6; i++) {
                    const div = document.createElement('div');
                    div.className = `btn-star star-${i}`;
                    div.innerHTML = starSvg;
                    btn.appendChild(div);
                }
            }
        });
    };

    // --- 19. INITIALIZATION ---
    initRevealObserver();
    initSpotlightCards();
    initSparkles();
    handleUrlParams();
    injectStars();
    
    // Observer para elementos dinámicos
    new MutationObserver(injectStars).observe(document.body, { childList: true, subtree: true });
});
