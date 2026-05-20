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
  <title>Tu Esposo Trader | Sistema Automático de Copytrading y Señales VIP</title>
  <meta name="description" content="Únete a la academia Tu Esposo Trader (Enmanuel Díaz). Domina los mercados con nuestro sistema automatizado de copytrading IA, señales en vivo y torneos.">
  <meta name="keywords" content="copytrading, trading automático, Tu Esposo Trader, Enmanuel Díaz, bot de trading telegram, opciones binarias, señales de trading, Exnova, Quotex, IQ Option, trading algorítmico, IA trading, cursos, academia, éxito, finanzas, mercado, bolsa de valores">
  
  <meta property="og:title" content="Tu Esposo Trader | Sistema Automático de Copytrading">
  <meta property="og:description" content="Automatiza tus operaciones con la Inteligencia Artificial de Tu Esposo Trader. Copia señales en Exnova y Quotex 24/7 sin esfuerzo.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.tuesposotrader.com/">
  <meta property="og:image" content="https://www.tuesposotrader.com/assets/photos/logo-512x512.png">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tu Esposo Trader | Copytrading IA">
  <meta name="twitter:description" content="Automatiza tus ganancias con nuestro bot de Telegram y estrategia cuántica.">
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
        <a href="#media-gallery">Contenido</a>
        <a href="#benefits">Beneficios</a>
        <a href="#social-links">Comunidad</a>
    </nav>
    <a class="header__cta glow-hover" href="#social-links">Únete al canal</a>
</header>
<main>
<section id="hero" class="hero reveal">
    <div class="bg-glow"></div>
    <div class="hero__content">
        <h1>Domina los mercados con una guía clara y transparente.</h1>
        <p>
            Soy Enmanuel Díaz, conocido como Tu Esposo Trader. Comparto mi proceso, operaciones en vivo y análisis para que puedas operar con confianza.
        </p>
        <div class="hero__actions">
            <a class="btn btn-primary" href="#media-gallery">Ver contenido</a>
            <a class="btn btn-secondary" href="#about">Conocer más</a>
        </div>
    </div>
</section>

<div class="brokers-bar">
    <span>Exnova</span>
    <span>IQ Option</span>
</div>
<section id="about" class="about reveal">
    <header>
        <h2>Más que un trader, un mentor.</h2>
        <p>
            Tras 8 años en los mercados, Enmanuel Díaz —Tu Esposo Trader— ha desarrollado un modelo cuantitativo que equilibra gestión de riesgo y lectura del flujo institucional.
        </p>
    </header>
    <div class="about__grid">
        <article>
            <h3>Transparencia total</h3>
            <p>Operaciones documentadas en tiempo real con bitácora accesible a la comunidad.</p>
        </article>
        <article>
            <h3>Disciplina y métricas</h3>
            <p>Seguimiento semanal de drawdown, win-rate y plan correctivo ante desvíos.</p>
        </article>
        <article>
            <h3>Formación integral</h3>
            <p>Sesiones educativas en análisis técnico, macroeconomía y psicotrading.</p>
        </article>
    </div>
</section>
<section id="media-gallery" class="media-gallery reveal">
    <header>
        <h2>Últimos contenidos</h2>
        <p>Clases magistrales, operaciones destacadas y cápsulas motivacionales.</p>
    </header>
    <div class="media-gallery__grid">
        <div class="media-gallery__column media-gallery__column--photos">
            <h3 class="media-gallery__column-title">Galería fotográfica</h3>
            <div class="media-gallery__carousel" data-carousel="photos">
                <button class="media-gallery__nav" data-carousel-control="prev" type="button" aria-label="Ver contenido anterior">
                    <span aria-hidden="true">&#8249;</span>
                </button>
                <div class="media-gallery__viewport">
                    <div class="media-gallery__track" id="media-gallery-track"></div>
                </div>
                <button class="media-gallery__nav" data-carousel-control="next" type="button" aria-label="Ver contenido siguiente">
                    <span aria-hidden="true">&#8250;</span>
                </button>
            </div>
        </div>
        <div class="media-gallery__column media-gallery__column--videos">
            <h3 class="media-gallery__column-title">Cápsulas en video</h3>
            <div class="media-gallery__carousel" data-carousel="videos">
                <button class="media-gallery__nav" data-carousel-control="prev" type="button" aria-label="Ver video anterior">
                    <span aria-hidden="true">&#8249;</span>
                </button>
                <div class="media-gallery__viewport">
                    <div class="media-gallery__track" id="video-gallery-track"></div>
                </div>
                <button class="media-gallery__nav" data-carousel-control="next" type="button" aria-label="Ver video siguiente">
                    <span aria-hidden="true">&#8250;</span>
                </button>
            </div>
        </div>
    </div>
</section>
<section id="benefits" class="benefits reveal">
  <header>
    <h2>Beneficios de la Academia</h2>
    <p>Potencia tu trading con herramientas exclusivas, soporte constante y retos semanales diseñados para crecer juntos.</p>
  </header>
  <div class="benefits__grid">
    <article class="benefits__item">
      <h3>Indicador de Reversiones</h3>
      <p>
        Detecta giros de tendencia con un algoritmo propio que combina patrones y momentum para alertarte justo antes del cambio de dirección.
      </p>
      <p>
        Recibe señales claras para entrar o salir de operaciones con confianza, maximizando ganancias y limitando el riesgo.
      </p>
    </article>
    <article class="benefits__item">
      <h3>Super Bot IA</h3>
      <p>
        Nuestro bot analiza miles de datos en tiempo real, identifica escenarios de alta probabilidad y ejecuta las operaciones que configures.
      </p>
      <p>
        Se adapta a tu estrategia, gestiona el riesgo y te mantiene informado con alertas y métricas actualizadas.
      </p>
    </article>
    <article class="benefits__item">
      <h3>Señales en Vivo</h3>
      <p>
        Alertas en tiempo real validadas por el equipo y la IA, con una tasa de acierto superior al 90&nbsp;% para aprovechar oportunidades inmediatas.
      </p>
      <p>
        Configura avisos personalizados y accede al análisis detrás de cada operación para aprender mientras operas.
      </p>
    </article>
    <article class="benefits__item">
      <h3>Torneos Semanales</h3>
      <p>
        Compite cada semana con capital virtual, demuestra tu rendimiento y gana premios de hasta $1000 sin arriesgar tu dinero.
      </p>
      <p>
        Mejora tus habilidades en un entorno controlado, comparte tácticas con otros alumnos y recibe feedback experto.
      </p>
    </article>
    <article class="benefits__item">
      <h3>Clases Personalizadas</h3>
      <p>
        Sesiones 1:1 con el Top 1 de opciones binarias en Venezuela, enfocadas en estrategias avanzadas y gestión emocional.
      </p>
      <p>
        Incluye materiales exclusivos, soporte continuo y planes accionables para acelerar tus resultados.
      </p>
    </article>
  </div>
</section>

<section id="social-links" class="social-links reveal">
  <header>
    <h2>Conecta con la comunidad</h2>
    <p>Únete a los canales oficiales para formación, señales y networking.</p>
  </header>
  <div class="social-links__grid" id="social-links-grid"></div>
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
