<script>
    import { onMount } from 'svelte';

    // ── FOMO Counter (dynamic, persisted per visitor) ──
    let claimedSpots = $state(87);
    const TOTAL_SPOTS = 100;
    const STORAGE_KEY = 'tet_spots_v1';
    const STORAGE_TS_KEY = 'tet_spots_ts_v1';

    
    // Fallback/resilient IntersectionObserver via Svelte Action
    function reveal(node) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    node.classList.add('is-visible');
                    observer.unobserve(node);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(node);
        return {
            destroy() {
                observer.disconnect();
            }
        };
    }

    onMount(async () => {
        // ── FOMO Counter Logic ──
        const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        const storedTs = parseInt(localStorage.getItem(STORAGE_TS_KEY) || '0', 10);
        const now = Date.now();

        // Base: random between 82-87 for first visit, keeps growing after
        let base = stored >= 82 ? stored : (82 + Math.floor(Math.random() * 6));

        // Advance counter based on time elapsed since last visit
        if (storedTs > 0) {
            const hoursElapsed = (now - storedTs) / (1000 * 60 * 60);
            if (hoursElapsed >= 12) {
                // Credibility Reset: 12+ hours passed, drop back to 82-87
                base = 82 + Math.floor(Math.random() * 6);
            } else {
                // Less than 12 hours: bump up slightly (1 per ~8 min, max +5)
                const minutesElapsed = Math.floor((now - storedTs) / 60000);
                const bump = Math.min(Math.floor(minutesElapsed / 8), 5);
                base = Math.min(base + bump, 99);
            }
        }

        claimedSpots = base;
        localStorage.setItem(STORAGE_KEY, String(base));
        localStorage.setItem(STORAGE_TS_KEY, String(now));

        // Tick: increment by 1 every 4-9 minutes randomly (live feel)
        const tick = () => {
            if (claimedSpots >= 99) return;
            claimedSpots = Math.min(claimedSpots + 1, 99);
            localStorage.setItem(STORAGE_KEY, String(claimedSpots));
            const nextMs = (4 + Math.floor(Math.random() * 5)) * 60 * 1000;
            setTimeout(tick, nextMs);
        };
        const firstTick = (4 + Math.floor(Math.random() * 5)) * 60 * 1000;
        setTimeout(tick, firstTick);

        // Load main.js dynamically so it runs after DOM is ready
        try {
            const { init } = await import('../scripts/main.js');
            await init();
        } catch(e) {
            console.error("Error loading main.js", e);
        }
        
        // Failsafe: force reveal on anything that was missed
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
                el.classList.add('is-visible');
            });
        }, 1500);

        // Mobile sticky CTA — slide in after 1.8s
        setTimeout(() => {
            const stickyCta = document.getElementById('mobile-sticky-cta');
            if (stickyCta) stickyCta.classList.add('is-visible');
        }, 1800);

        // ── Hamburger menu ──
        const btn = document.getElementById('hamburger-btn');
        const nav = document.getElementById('main-nav');
        if (btn && nav) {
            const header = btn.closest('.header');
            btn.addEventListener('click', () => {
                const isOpen = nav.classList.toggle('is-open');
                if (header) header.classList.toggle('is-open', isOpen);
                btn.setAttribute('aria-expanded', String(isOpen));
                btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
            // Close on nav link click
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('is-open');
                    if (header) header.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }
    });
</script>

<svelte:head>
  <!-- PRIMARY SEO -->
  <title>Curso de Trading + Psicotrading Gratis | Tu Esposo Trader</title>
  <meta name="description" content="Señales forex gratis, copytrading automático con IA y Academia VIP de trading. Comunidad Telegram — 100 cupos gratuitos para Venezuela y LATAM.">
  <meta name="keywords" content="curso de trading gratis, psicotrading, copytrading Venezuela, señales opciones binarias, academia de trading">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="author" content="Enmanuel Díaz — Tu Esposo Trader">
  <link rel="canonical" href="https://tuesposotrader.com/">

  <!-- OPEN GRAPH -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tu Esposo Trader">
  <meta property="og:locale" content="es_VE">
  <meta property="og:url" content="https://tuesposotrader.com/">
  <meta property="og:title" content="Academia de Trading y Copytrading Gratis | Tu Esposo Trader">
  <meta property="og:description" content="Señales forex gratis, copytrading automático con IA y Academia VIP de trading. Comunidad Telegram — 100 cupos gratuitos para Venezuela y LATAM.">
  <meta property="og:image" content="https://www.tuesposotrader.com/assets/photos/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Logo Tu Esposo Trader — Academia de Trading y Copytrading">
  <meta property="og:image:type" content="image/png">
  <meta property="og:updated_time" content="2026-05-21T00:00:00+00:00">

  <!-- TWITTER / X CARDS -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@tuesposotrader">
  <meta name="twitter:creator" content="@tuesposotrader">
  <meta name="twitter:title" content="Curso de Trading Gratis + Copytrading IA | Tu Esposo Trader">
  <meta name="twitter:description" content="Señales forex, copytrading automático y academia VIP. 100 cupos gratis disponibles. Únete al canal de Telegram ahora.">
  <meta name="twitter:image" content="https://www.tuesposotrader.com/assets/photos/logo-512x512.png">
  <meta name="twitter:image:alt" content="Logo Tu Esposo Trader — Academia de Trading y Copytrading">

  <!-- JSON-LD SCHEMA.ORG COMPLETO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.tuesposotrader.com/#website",
        "url": "https://www.tuesposotrader.com/",
        "name": "Tu Esposo Trader",
        "description": "Academia de trading, señales forex gratis y copytrading automático con IA.",
        "inLanguage": "es",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.tuesposotrader.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Person",
        "@id": "https://www.tuesposotrader.com/#enmanuel-diaz",
        "name": "Enmanuel Díaz",
        "alternateName": "Tu Esposo Trader",
        "description": "Trader profesional con 8 años de experiencia. Fundador de la Academia Tu Esposo Trader.",
        "url": "https://www.tuesposotrader.com/",
        "sameAs": [
          "https://t.me/+MMsbQZq6tAMzYTIx",
          "https://www.tiktok.com/@tuesposotrader",
          "https://youtube.com/@tuesposotraderoficial",
          "https://www.instagram.com/tuesposotraderoficial"
        ],
        "jobTitle": "Trader Profesional & Educador Financiero"
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://www.tuesposotrader.com/#organization",
        "name": "Academia Tu Esposo Trader",
        "url": "https://www.tuesposotrader.com/",
        "logo": { "@type": "ImageObject", "url": "https://www.tuesposotrader.com/assets/photos/logo-512x512.png", "width": 512, "height": 512 },
        "description": "Academia VIP de trading, finanzas y copytrading automático con IA. Cursos gratis, señales forex y comunidad en Telegram.",
        "founder": { "@id": "https://www.tuesposotrader.com/#enmanuel-diaz" }
      },
      {
        "@type": "Course",
        "name": "Programa VIP de Trading, Finanzas y Copytrading",
        "description": "Aprende trading desde cero. Incluye señales forex en vivo, copytrading automático con IA, scripts exclusivos y clases en directo. Acceso 100% gratuito para los primeros 100 cupos.",
        "url": "https://www.tuesposotrader.com/",
        "isAccessibleForFree": true,
        "inLanguage": "es",
        "provider": { "@id": "https://www.tuesposotrader.com/#organization" },
        "instructor": { "@id": "https://www.tuesposotrader.com/#enmanuel-diaz" },
        "hasCourseInstance": { "@type": "CourseInstance", "courseMode": ["online"], "inLanguage": "es" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/LimitedAvailability",
          "eligibleQuantity": { "@type": "QuantitativeValue", "value": 100 },
          "validFrom": "2025-11-19"
        }
      },
      {
        "@type": "VideoObject",
        "name": "Video Promocional — Academia VIP Tu Esposo Trader",
        "description": "Conoce el programa VIP de trading: cursos gratis, copytrading automático con IA, señales forex y clases en vivo.",
        "duration": "PT2M30S",
        "thumbnailUrl": "https://www.tuesposotrader.com/assets/photos/logo-512x512.png",
        "contentUrl": "https://www.tuesposotrader.com/assets/videos/promocion_vip.mp4",
        "uploadDate": "2025-11-19T00:00:00+00:00",
        "publisher": { "@id": "https://www.tuesposotrader.com/#organization" }
      },
      {
        "@type": "AggregateRating",
        "@id": "https://www.tuesposotrader.com/#rating",
        "itemReviewed": { "@id": "https://www.tuesposotrader.com/#organization" },
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "3"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.tuesposotrader.com/" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "¿Es gratis unirse a la academia de Tu Esposo Trader?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. Los primeros 100 cupos tienen acceso 100% gratuito a todos los beneficios VIP: cursos de trading, señales forex en vivo, copytrading automático, scripts exclusivos y clases en directo." } },
          { "@type": "Question", "name": "¿Qué es el copytrading automático?", "acceptedAnswer": { "@type": "Answer", "text": "El copytrading automático es un sistema donde nuestra IA copia las operaciones de trading institucional directamente a tu cuenta, sin que tengas que hacer nada. El bot de Telegram gestiona todo 24/7." } },
          { "@type": "Question", "name": "¿Puedo ganar dinero desde casa con el copytrading?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. El copytrading es ideal para generar ingresos pasivos desde casa. El sistema funciona automáticamente 24/7 mientras tú te dedicas a tus actividades diarias." } },
          { "@type": "Question", "name": "¿Necesito experiencia previa para aprender trading?", "acceptedAnswer": { "@type": "Answer", "text": "No. Nuestros cursos van desde cero hasta nivel avanzado. Enmanuel Díaz explica cada concepto de forma simple con 8 años de experiencia en los mercados." } },
          { "@type": "Question", "name": "¿Qué es el psicotrading?", "acceptedAnswer": { "@type": "Answer", "text": "El psicotrading es la disciplina que estudia cómo las emociones afectan las decisiones de trading. Aprender a controlar el miedo, la codicia y el FOMO es clave para ser un trader rentable. Nuestro curso de psicotrading te da herramientas reales para dominar tu mentalidad en el mercado." } },
          { "@type": "Question", "name": "¿Cuándo sale el curso de psicotrading?", "acceptedAnswer": { "@type": "Answer", "text": "El curso de psicotrading de Tu Esposo Trader está próximamente disponible. Únete a nuestra comunidad VIP en Telegram para obtener acceso anticipado exclusivo y ser el primero en saber cuando se lance." } }
        ]
      }
    ]
  }
  </script>
</svelte:head>

<div id="background-rotator" class="background-rotator"></div>
<div id="page-wrapper" class="page-wrapper">
<header class="header">
    <div class="header__brand">
        <img class="header__logo" src="/assets/photos/logo-512x512.png" alt="Tu Esposo Trader — Academia de Trading y Copytrading" loading="eager" decoding="async" width="40" height="40" />
        <div>
            <p class="header__title">Tu Esposo Trader</p>
            <p class="header__subtitle">Enmanuel Díaz · Estrategias reales y consistentes.</p>
        </div>
    </div>
    <nav id="main-nav" class="header__nav" aria-label="Navegación principal">
        <a href="/blog">Blog & Academia</a>
        <a href="#about">Sobre mí</a>
        <a href="#benefits">Servicios VIP</a>
        <a href="#psicotrading">Psicotrading</a>
        <a href="#testimonios">Testimonios</a>
        <a href="#social-links">Comunidad</a>
    </nav>
    <a class="header__cta glow-hover" href="https://t.me/+MMsbQZq6tAMzYTIx" target="_blank" rel="noopener" data-sveltekit-reload>🔥 Quiero Acceso Gratis</a>
    <button id="hamburger-btn" class="hamburger-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
    </button>
</header>
<main>

<section id="hero-promo" class="hero-promo reveal">
    <div class="bg-glow"></div>
    <div class="hero-promo__container">
        <div class="hero-promo__content">
            <div class="urgency-badge">
                <span class="pulse-dot"></span>
                <strong>Promoción Especial:</strong> Buscamos a 100 personas hoy.
            </div>
            
            <h1>Academia de <span>Trading y Copytrading</span> Gratis — Venezuela y LATAM.</h1>
            <p class="hero-promo__subtitle">
                Accede <strong>100% GRATIS</strong> a nuestra comunidad VIP de trading. Señales forex, binarias y copytrading automático con IA para traders de Venezuela, Colombia, México y toda Latinoamérica.
            </p>
            
            <div class="urgency-tracker">
                <div class="tracker-info">
                    <span>Plazas VIP Reclamadas Hoy</span>
                    <span class="tracker-numbers">{claimedSpots} / {TOTAL_SPOTS}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {claimedSpots}%;"></div>
                </div>
            </div>

            <p class="hero__social-proof">🟢 <strong>+400 traders</strong> ya copian señales automáticamente — únete hoy gratis.</p>
            <div class="hero__actions">
                <a class="btn btn-primary btn-pulse" href="https://t.me/+MMsbQZq6tAMzYTIx" target="_blank" rel="noopener" data-sveltekit-reload>
                    🚀 Quiero Copiar Tus Señales Ahora
                </a>
            </div>
        </div>
        
        <div class="hero-promo__video-wrapper glow-hover">
            <video class="promo-video" autoplay loop muted playsinline preload="metadata" poster="/assets/photos/logo-512x512.png"
                   title="Video Promocional — Academia VIP Tu Esposo Trader"
                   aria-label="Video de presentación del programa VIP de trading y copytrading automático">
                <source src="/assets/videos/promocion_vip.mp4" type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>
        </div>
    </div>
</section>

<div class="brokers-bar">
    <span>Cursos Premium</span>
    <span>Copytrading IA</span>
    <span>Scripts Personalizados</span>
    <span>Clases en Vivo</span>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PSICOTRADING COURSE SECTION                    -->
<!-- ═══════════════════════════════════════════════ -->
<section class="psicotrading reveal" id="psicotrading">
  <div class="psicotrading__container">
    <div class="psicotrading__badge">
      <span class="pulse-dot"></span>
      <strong>Próximamente</strong> — Acceso anticipado exclusivo
    </div>

    <div class="psicotrading__content">
      <div class="psicotrading__text">
        <h2>Curso de <span class="psicotrading__highlight">Psicotrading</span></h2>
        <p class="psicotrading__subtitle">Domina tu Mente, Domina el Mercado</p>
        <p class="psicotrading__desc">
          El 90% de los traders pierden por emociones, no por falta de estrategia.
          Aprende a controlar el miedo, la codicia y el FOMO con técnicas reales
          usadas por traders institucionales.
        </p>

        <div class="psicotrading__modules">
          <div class="psico-module">
            <span class="psico-module__icon">🧠</span>
            <div>
              <span class="psico-module__label">Módulo 1</span>
              <p>Psicología del riesgo y gestión emocional</p>
            </div>
          </div>
          <div class="psico-module">
            <span class="psico-module__icon">🎯</span>
            <div>
              <span class="psico-module__label">Módulo 2</span>
              <p>Disciplina y ejecución sin sesgos cognitivos</p>
            </div>
          </div>
          <div class="psico-module">
            <span class="psico-module__icon">⚡</span>
            <div>
              <span class="psico-module__label">Módulo 3</span>
              <p>Mindset ganador y rutinas de alto rendimiento</p>
            </div>
          </div>
          <div class="psico-module">
            <span class="psico-module__icon">🔒</span>
            <div>
              <strong>Módulo 4</strong>
              <p>Control del FOMO, revenge trading y over-trading</p>
            </div>
          </div>
        </div>

        <a class="btn btn-primary btn-pulse" href="https://t.me/+MMsbQZq6tAMzYTIx" target="_blank" rel="noopener noreferrer">
          🔔 Quiero Acceso Anticipado
        </a>
      </div>

      <div class="psicotrading__preview glow-hover">
        <div class="psico-preview__badge">Preview del Curso</div>
        <picture>
          <source srcset="/assets/photos/psicotrading-preview.webp" type="image/webp" />
          <img
            src="/assets/photos/psicotrading-preview.png"
            alt="Preview del Curso de Psicotrading — Tu Esposo Trader"
            loading="lazy"
            decoding="async"
            width="560"
            height="420"
          />
        </picture>
        <div class="psico-preview__overlay">
          <span class="psico-preview__lock">🔒 Contenido en preparación</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="about" class="about reveal">
    <header>
        <h2>Más que un trabajo, una profesión.</h2>
        <p>
            Tras 8 años en los mercados financieros, Enmanuel Díaz —Tu Esposo Trader— ha desarrollado el ecosistema de trading más completo de Venezuela y LATAM. Señales forex en vivo, copytrading automático con IA y señales de opciones binarias para que operes con confianza desde cualquier país.
        </p>
    </header>
    <div class="about__grid">
        <article>
            <h3>Transparencia Total</h3>
            <p>Mostramos resultados reales y operamos en vivo contigo. Sin falsas promesas, solo análisis institucional puro.</p>
        </article>
        <article>
            <h3>Sistema Cuantitativo</h3>
            <p>Usamos herramientas avanzadas para leer el mercado y maximizar la rentabilidad de las señales.</p>
        </article>
        <article>
            <h3>Comunidad y Mentoría</h3>
            <p>Soporte continuo, análisis compartidos y respuestas directas a tus dudas en el canal VIP.</p>
        </article>
    </div>
</section>

<section id="benefits" class="benefits reveal">
  <header>
    <h2>Ecosistema de Beneficios VIP (Todo Incluido)</h2>
    <p>Al unirte hoy a los 100 cupos gratuitos, obtienes acceso de por vida a todas nuestras herramientas.</p>
  </header>
  <div class="benefits__grid">
    <article class="benefits__item">
      <h3>📚 Cursos y Academia</h3>
      <p>Desde cero hasta experto. Aprende acción del precio, estructura de mercado y psicología del trading.</p>
    </article>
    <article class="benefits__item">
      <h3>🤖 Copytrading Automático</h3>
      <p>Conecta tu cuenta y deja que nuestra Inteligencia Artificial copie las operaciones institucionales 24/7 sin que muevas un dedo.</p>
    </article>
    <article class="benefits__item">
      <h3>💻 Scripts Propios</h3>
      <p>Te damos nuestros indicadores y scripts exclusivos diseñados para plataformas líderes, mejorando tus puntos de entrada.</p>
    </article>
    <article class="benefits__item">
      <h3>🔴 Clases y Sesiones en Vivo</h3>
      <p>Opera en directo con nosotros, resuelve dudas y comprende el "por qué" de cada movimiento en tiempo real.</p>
    </article>
  </div>
</section>

<section id="social-links" class="social-links reveal">
  <header>
    <h2>Conecta con la Comunidad VIP</h2>
    <p>Únete a los canales oficiales para recibir las alertas gratuitas y material educativo.</p>
  </header>
  <div class="social-links__grid">

    <a class="social-card social-card--telegram glow-hover reveal"
       href="https://t.me/+MMsbQZq6tAMzYTIx"
       target="_blank" rel="noopener noreferrer">
      <span class="social-card__platform-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      </span>
      <div class="social-card__body">
        <strong>Telegram VIP</strong>
        <p>Señales, análisis y acceso gratuito al grupo oficial.</p>
      </div>
    </a>

    <a class="social-card social-card--tiktok glow-hover reveal"
       href="https://www.tiktok.com/@tuesposotrader?_r=1&_t=ZN-91ZXtcXDFZb"
       target="_blank" rel="noopener noreferrer">
      <span class="social-card__platform-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
      </span>
      <div class="social-card__body">
        <strong>TikTok</strong>
        <p>Tips rápidos de trading y psicología financiera en 60s.</p>
      </div>
    </a>

    <a class="social-card social-card--youtube glow-hover reveal"
       href="https://youtube.com/@tuesposotraderoficial?si=FFVDgHCzc08U9ulB"
       target="_blank" rel="noopener noreferrer">
      <span class="social-card__platform-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </span>
      <div class="social-card__body">
        <strong>YouTube</strong>
        <p>Lives semanales, clases y análisis en profundidad.</p>
      </div>
    </a>

    <a class="social-card social-card--instagram glow-hover reveal"
       href="https://www.instagram.com/tuesposotraderoficial?igsh=ZzI2cjRyODhjdGpl"
       target="_blank" rel="noopener noreferrer">
      <span class="social-card__platform-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
      </span>
      <div class="social-card__body">
        <strong>Instagram</strong>
        <p>Highlights, lifestyle y motivación del mundo trader.</p>
      </div>
    </a>

  </div>
</section>

<section class="benefits reveal" id="testimonios">
  <header>
    <h2>Lo que dicen nuestros traders</h2>
    <p>Lo que dice nuestra comunidad sobre el copytrading automático.</p>
  </header>
  <div class="benefits__grid" itemscope itemtype="https://schema.org/ItemList">
    <article class="benefits__item" itemscope itemtype="https://schema.org/Review">
      <div itemprop="itemReviewed" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="Tu Esposo Trader" /></div>
      <div class="stars" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
        <span itemprop="ratingValue" content="5">★★★★★</span>
        <meta itemprop="bestRating" content="5" />
      </div>
      <p itemprop="reviewBody">"Nunca pensé que el copytrading pudiera ser tan desatendido. Literalmente conecté mi cuenta y el bot de Telegram hace el resto. Lo recomiendo a todos en Venezuela."</p>
      <p><strong itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">Carlos M.</span></strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item" itemscope itemtype="https://schema.org/Review">
      <div itemprop="itemReviewed" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="Tu Esposo Trader" /></div>
      <div class="stars" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
        <span itemprop="ratingValue" content="5">★★★★★</span>
        <meta itemprop="bestRating" content="5" />
      </div>
      <p itemprop="reviewBody">"El nivel de soporte y la precisión de las entradas son increíbles. No tengo tiempo para analizar gráficos, esta es la solución para ganar en forex desde casa."</p>
      <p><strong itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">Elena R.</span></strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item" itemscope itemtype="https://schema.org/Review">
      <div itemprop="itemReviewed" itemscope itemtype="https://schema.org/Organization"><meta itemprop="name" content="Tu Esposo Trader" /></div>
      <div class="stars" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
        <span itemprop="ratingValue" content="5">★★★★★</span>
        <meta itemprop="bestRating" content="5" />
      </div>
      <p itemprop="reviewBody">"La IA tiene un filtro de noticias que evita pérdidas tontas. Las señales binarias también son muy precisas. Muy profesional y transparente."</p>
      <p><strong itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">Javier T.</span></strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
  </div>
</section>

<section class="benefits reveal" id="servicios">
  <header>
    <h2>Servicios de Copytrading</h2>
    <p>Accede a nuestro sistema automatizado de IA y opera sin estrés 24/7.</p>
  </header>
  <div class="benefits__grid">
    <article class="benefits__item">
      <h3>Plan Gratuito</h3>
      <p>Prueba nuestro sistema gratis bajo broker asociado.</p>
      <p>
        ✅ Copia exacta de señales<br>
        ✅ Soporte comunitario<br>
        ✅ Setup en 5 minutos
      </p>
    </article>
    <article class="benefits__item">
      <h3>Plan Premium</h3>
      <p>Operación en cualquier broker compatible y beneficios VIP.</p>
      <p>
        ✅ Sin restricciones de broker<br>
        ✅ Filtro de alta volatilidad (IA)<br>
        ✅ Soporte 1 a 1 prioritario
      </p>
    </article>
  </div>
</section>

</main>
<footer class="footer">
  <div style="margin-bottom: 2rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
    <a href="/bot-copytrading-telegram" style="color: var(--clr-primary); text-decoration: none;">Bot Copytrading Telegram</a>
    <a href="/automatizar-opciones-binarias" style="color: var(--clr-primary); text-decoration: none;">Automatizar Opciones Binarias</a>
  </div>
  <p>© 2026 Tu Esposo Trader · Enmanuel Díaz. Todos los derechos reservados.</p>
  <p class="footer__credit">Desarrollado por KATACLISM</p>
  <small>Operar en mercados financieros implica riesgos. Gestiona tu capital con responsabilidad.</small>
</footer>

<!-- Mobile Sticky CTA Bar (solo visible en móvil) -->
<div id="mobile-sticky-cta" class="mobile-sticky-cta" aria-hidden="true">
    <a class="btn btn-primary mobile-sticky-cta__btn" href="https://t.me/+MMsbQZq6tAMzYTIx" target="_blank" rel="noopener" data-sveltekit-reload>
        🚀 Quiero Copiar Tus Señales — Gratis
    </a>
</div>

</div>

