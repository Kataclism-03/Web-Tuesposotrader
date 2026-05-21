<script>
    import { onMount } from 'svelte';
    
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
    });
</script>

<svelte:head>
  <title>Tu Esposo Trader | Academia de Trading, Finanzas y Copytrading</title>
  <meta name="description" content="Únete a la academia VIP de Tu Esposo Trader. Aprende finanzas, accede a cursos gratis, clases en vivo, copytrading automático y obtén la libertad financiera que buscas.">
  <meta name="keywords" content="trading, finanzas, trabajos remotos, ganar dinero online, cursos de trading gratis, academia de trading, copytrading automático, señales en vivo, bot de trading, Tu Esposo Trader, opciones binarias">
  
  <meta property="og:title" content="Tu Esposo Trader | Academia de Trading y Finanzas VIP">
  <meta property="og:description" content="Accede gratis hoy. Aprende a operar con nuestros cursos y copia nuestras alertas en automático.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.tuesposotrader.com/">
  <meta property="og:image" content="https://www.tuesposotrader.com/assets/photos/logo-512x512.png">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tu Esposo Trader | Oportunidad VIP">
  <meta name="twitter:description" content="Acceso gratuito a nuestra academia de trading y copytrading.">
  
  <!-- SEO JSON-LD: Organization, EducationalOrganization & JobPosting -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "name": "Academia Tu Esposo Trader",
        "description": "Cursos de trading, finanzas, y herramientas automáticas para generar ingresos.",
        "url": "https://www.tuesposotrader.com/",
        "logo": "https://www.tuesposotrader.com/assets/photos/logo-512x512.png"
      },
      {
        "@type": "Course",
        "name": "Programa VIP de Trading y Finanzas",
        "description": "Aprende a operar en los mercados financieros, utiliza scripts y señales en vivo. Únete gratis a la promoción de 100 cupos.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Tu Esposo Trader"
        }
      }
    ]
  }
  </script>
</svelte:head>

<div id="background-rotator" class="background-rotator"></div>
<div id="page-wrapper" class="page-wrapper">
<header class="header">
    <div class="header__brand">
        <img class="header__logo" src="" alt="Tu Esposo Trader" loading="lazy" decoding="async" />
        <div>
            <p class="header__title">Tu Esposo Trader</p>
            <p class="header__subtitle">Enmanuel Díaz · Estrategias reales y consistentes.</p>
        </div>
    </div>
    <nav class="header__nav">
        <a href="#about">Sobre mí</a>
        <a href="#benefits">Servicios VIP</a>
        <a href="#testimonios">Testimonios</a>
        <a href="#social-links">Comunidad</a>
    </nav>
    <a class="header__cta glow-hover" href="https://t.me/tuesposotrader" target="_blank" rel="noopener" data-sveltekit-reload>Acceso VIP</a>
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
            
            <h1>Tu oportunidad real en el <span>Mundo de las Finanzas</span>.</h1>
            <p class="hero-promo__subtitle">
                Accede <strong>100% GRATIS</strong> a nuestra comunidad VIP. Cursos, Copytrading Automático, Clases en vivo y Scripts. No tienes que hacer nada más que unirte.
            </p>
            
            <div class="urgency-tracker">
                <div class="tracker-info">
                    <span>Plazas VIP Reclamadas Hoy</span>
                    <span class="tracker-numbers">87 / 100</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 87%;"></div>
                </div>
            </div>

            <div class="hero__actions">
                <a class="btn btn-primary btn-pulse" href="https://t.me/tuesposotrader" target="_blank" rel="noopener" data-sveltekit-reload>
                    Reclamar Acceso Gratis
                </a>
            </div>
        </div>
        
        <div class="hero-promo__video-wrapper glow-hover">
            <video class="promo-video" autoplay loop muted playsinline poster="/assets/photos/logo-512x512.png">
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

<section id="about" class="about reveal">
    <header>
        <h2>Más que un trabajo, una profesión.</h2>
        <p>
            Tras 8 años en los mercados, Enmanuel Díaz —Tu Esposo Trader— ha desarrollado un ecosistema financiero completo para que operes con confianza, sin importar tu experiencia.
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
  <div class="social-links__grid" id="social-links-grid">
        <a href="https://t.me/tuesposotrader" class="social-card telegram glow-hover" target="_blank" rel="noopener" data-sveltekit-reload>
            <span class="social-card__icon">📱</span>
            <h3>Telegram VIP</h3>
            <p>Señales, análisis y torneos semanales</p>
        </a>
        <a href="https://www.tiktok.com/@tuesposotrader" class="social-card tiktok glow-hover" target="_blank" rel="noopener" data-sveltekit-reload>
            <span class="social-card__icon">🎵</span>
            <h3>TikTok</h3>
            <p>Tips rápidos, humor trader y psicotrading en 60s</p>
        </a>
        <a href="https://www.youtube.com/@TuEsposoTrader" class="social-card youtube glow-hover" target="_blank" rel="noopener" data-sveltekit-reload>
            <span class="social-card__icon">▶️</span>
            <h3>YouTube</h3>
            <p>Clases magistrales, estrategias completas y análisis</p>
        </a>
        <a href="https://instagram.com/tuesposotrader" class="social-card instagram glow-hover" target="_blank" rel="noopener" data-sveltekit-reload>
            <span class="social-card__icon">📸</span>
            <h3>Instagram</h3>
            <p>Lifestyle, motivación y el día a día del trading</p>
        </a>
  </div>
</section>

<section class="benefits reveal" id="testimonios">
  <header>
    <h2>Traders trust us</h2>
    <p>Lo que dice nuestra comunidad sobre el copytrading automático.</p>
  </header>
  <div class="benefits__grid">
    <article class="benefits__item">
      <div class="stars">★★★★★</div>
      <p>"Nunca pensé que el copytrading pudiera ser tan desatendido. Literalmente conecté mi cuenta y el bot de Telegram hace el resto."</p>
      <p><strong>Carlos M.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item">
      <div class="stars">★★★★★</div>
      <p>"El nivel de soporte y la precisión de las entradas son increíbles. No tengo tiempo para analizar gráficos, esta es la solución."</p>
      <p><strong>Elena R.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item">
      <div class="stars">★★★★★</div>
      <p>"La IA tiene un filtro de noticias que evita pérdidas tontas. Muy profesional y transparente."</p>
      <p><strong>Javier T.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
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
  <p>© 2025 Tu Esposo Trader · Enmanuel Díaz. Todos los derechos reservados.</p>
  <p class="footer__credit">Desarrollado por KATACLISM</p>
  <small>Operar en mercados financieros implica riesgos. Gestiona tu capital con responsabilidad.</small>
</footer>
</div>
