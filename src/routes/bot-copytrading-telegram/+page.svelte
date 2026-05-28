<script>
    import { onMount } from 'svelte';
    
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
        return { destroy() { observer.disconnect(); } };
    }
</script>

<svelte:head>
  <title>El Mejor Bot Copytrading para Telegram | Tu Esposo Trader</title>
  <meta name="description" content="Descubre cómo funciona nuestro bot de copytrading automático por Telegram. Copia operaciones de expertos 24/7 sin complicaciones.">
  <meta name="keywords" content="bot copytrading telegram, copytrading telegram gratis, señales automatizadas telegram, bot telegram opciones binarias">
  <link rel="canonical" href="https://www.tuesposotrader.com/bot-copytrading-telegram">
</svelte:head>

<section class="hero-promo reveal" use:reveal>
    <div class="bg-glow"></div>
    <div class="hero-promo__container">
        <div class="hero-promo__content">
            <div class="urgency-badge">
                <span class="pulse-dot"></span>
                <strong>Tecnología Exclusiva</strong> — 100% Automatizado
            </div>
            
            <h1>El Mejor <span>Bot Copytrading</span> para Telegram.</h1>
            <p class="hero-promo__subtitle">
                ¿Cansado de perder entradas por no estar pegado a la pantalla? Nuestro <strong>bot de copytrading en Telegram</strong> se conecta directamente a tu broker y ejecuta nuestras señales VIP en tiempo real, incluso mientras duermes.
            </p>
            
            <div class="benefits__grid" style="margin: 2rem 0; text-align: left;">
                <article class="benefits__item" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--clr-primary);">⚡ Ejecución en Milisegundos</h3>
                    <p style="font-size: 0.9rem;">El bot recibe la alerta por Telegram y lanza la orden en tu broker sin demoras.</p>
                </article>
                <article class="benefits__item" style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--clr-primary);">🔒 Control Total</h3>
                    <p style="font-size: 0.9rem;">Tú defines tu importe y tu gestión de riesgo. El bot solo copia la dirección y el tiempo.</p>
                </article>
            </div>

            <div class="hero__actions">
                <a class="btn btn-primary btn-pulse" href="https://t.me/+_X-l-DBTBqY3MGQ5" target="_blank" rel="noopener">
                    Conectar Bot Gratis Ahora
                </a>
            </div>
        </div>
        
        <div class="hero-promo__video-wrapper glow-hover">
            <video class="promo-video" autoplay loop muted playsinline preload="none" poster="/assets/photos/logo-512x512.png"
                   title="Video Promocional — Academia VIP Tu Esposo Trader">
                <source src="/assets/videos/promocion_vip.mp4" type="video/mp4" />
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

<section class="benefits reveal" id="testimonios" use:reveal>
  <header>
    <h2>Lo que dicen nuestros traders</h2>
    <p>Lo que dice nuestra comunidad sobre el bot de Telegram.</p>
  </header>
  <div class="benefits__grid">
    <article class="benefits__item">
      <div class="stars"><span style="color:#f5b041">★★★★★</span></div>
      <p>"Nunca pensé que el copytrading pudiera ser tan desatendido. Literalmente conecté mi cuenta y el bot de Telegram hace el resto. Lo recomiendo a todos en Venezuela."</p>
      <p><strong>Carlos M.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item">
      <div class="stars"><span style="color:#f5b041">★★★★★</span></div>
      <p>"El nivel de soporte y la precisión de las entradas son increíbles. No tengo tiempo para analizar gráficos, esta es la solución perfecta."</p>
      <p><strong>Elena R.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
    <article class="benefits__item">
      <div class="stars"><span style="color:#f5b041">★★★★★</span></div>
      <p>"La IA tiene un filtro de noticias que evita pérdidas tontas. Muy profesional y transparente. Funciona de maravilla por Telegram."</p>
      <p><strong>Javier T.</strong> <span style="color:var(--clr-muted)">✔ Verificado</span></p>
    </article>
  </div>
</section>

<section class="about reveal" use:reveal style="margin-bottom: 5rem;">
    <header>
        <h2>Preguntas Frecuentes sobre el Bot</h2>
    </header>
    <div class="about__grid">
        <article>
            <h3 style="color: var(--clr-primary);">¿Cómo funciona el bot de Telegram?</h3>
            <p>Nuestro sistema lee las operaciones enviadas al canal VIP de Telegram y las ejecuta instantáneamente en tu cuenta del broker, replicando la operación en tiempo real.</p>
        </article>
        <article>
            <h3 style="color: var(--clr-primary);">¿Necesito dejar mi PC encendida?</h3>
            <p>¡No! Todo el sistema está alojado en la nube. Una vez que configuras tu cuenta, el bot funciona 24/7 sin que necesites internet o batería en tu teléfono.</p>
        </article>
        <article>
            <h3 style="color: var(--clr-primary);">¿Es seguro para mi capital?</h3>
            <p>Totalmente. El bot nunca tiene acceso a retirar tus fondos, solo tiene permiso para abrir y cerrar operaciones según el límite de riesgo que tú mismo configures.</p>
        </article>
    </div>
</section>
