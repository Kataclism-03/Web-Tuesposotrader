<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../styles/layout.css';
  import { TELEGRAM_LINKS, INTERACTIVE_TOOLS, trackTelegramClick } from '$lib/config.js';

  interface FaqItem {
    q: string;
    a: string;
  }

  interface Props {
    currentPath?: string;
    badge?: string;
    title?: string;
    subtitle?: string;
    children?: Snippet;
    faqs?: FaqItem[];
  }

  let {
    currentPath = '',
    badge = 'Herramienta Gratuita',
    title = '',
    subtitle = '',
    children,
    faqs = []
  }: Props = $props();
</script>

<div class="tool-page">
  <header class="tool-header">
    <a href="/" class="tool-header__brand">
      <img src="/assets/photos/logo-512x512.png" alt="Tu Esposo Trader" width="36" height="36" />
      <div>
        <span class="tool-header__name">Tu Esposo Trader</span>
        <span class="tool-header__sub">Herramientas Interactivas</span>
      </div>
    </a>

    <nav class="tool-header__nav" aria-label="Navegación principal">
      <a href="/">Inicio</a>
      {#each INTERACTIVE_TOOLS as item}
        <a href={item.href} aria-current={currentPath === item.href ? 'page' : undefined}>
          {item.shortTitle}
        </a>
      {/each}
      <a href="/blog">Blog</a>
    </nav>

    <a
      class="tool-header__cta"
      href={TELEGRAM_LINKS.tools}
      target="_blank"
      rel="noopener noreferrer"
      onclick={() => trackTelegramClick(`header_${currentPath}`)}
    >
      Canal Gratis →
    </a>
  </header>

  <main class="tool-main">
    <nav class="tool-breadcrumb" aria-label="Ruta de navegación">
      <a href="/">Inicio</a>
      <span aria-hidden="true">/</span>
      <span>{title}</span>
    </nav>

    <header class="tool-hero">
      <span class="tool-hero__badge">{badge}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>

    {@render children?.()}

    <!-- Acceso cruzado a las otras herramientas -->
    <section class="tool-cross-nav" aria-label="Otras herramientas gratuitas">
      <h2>Más Herramientas para Operadores</h2>
      <div class="tool-cross-nav__grid">
        {#each INTERACTIVE_TOOLS.filter((t) => t.href !== currentPath) as other}
          <a href={other.href} class="tool-cross-card">
            <span class="tool-cross-card__badge">{other.badge}</span>
            <h3>{other.title}</h3>
            <p>{other.description}</p>
            <span class="tool-cross-card__link">Usar ahora →</span>
          </a>
        {/each}
        <a
          href={TELEGRAM_LINKS.tools}
          target="_blank"
          rel="noopener noreferrer"
          class="tool-cross-card tool-cross-card--vip"
          onclick={() => trackTelegramClick(`card_${currentPath}`)}
        >
          <span class="tool-cross-card__badge">Comunidad Oficial</span>
          <h3>Señales en Vivo y Copytrading en Telegram</h3>
          <p>Recibe alertas gratuitas, sesiones educativas y configuración guiada paso a paso.</p>
          <span class="tool-cross-card__link">Entrar al grupo oficial →</span>
        </a>
      </div>
    </section>

    {#if faqs.length > 0}
      <section class="tool-faq" aria-label="Preguntas frecuentes">
        <h2>Preguntas Frecuentes</h2>
        <div class="tool-faq__list">
          {#each faqs as faq}
            <details class="tool-faq__item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          {/each}
        </div>
      </section>
    {/if}
  </main>

  <footer class="footer">
    <div class="tool-footer__links">
      <a href="/">Inicio</a>
      <a href="/calculadora-retiro-exnova-binance">Calculadora Retiro a Binance</a>
      <a href="/calculadora-interes-compuesto">Calculadora Interés Compuesto</a>
      <a href="/horarios-mercado-forex-otc">Horarios de Mercado</a>
      <a href="/bot-copytrading-telegram">Bot Copytrading</a>
      <a href="/blog">Blog</a>
    </div>
    <p>© 2026 Tu Esposo Trader · Enmanuel Díaz. Todos los derechos reservados.</p>
    <small>Operar en mercados financieros implica riesgos. Gestiona tu capital con responsabilidad.</small>
  </footer>

  <div class="tool-mobile-sticky">
    <a
      class="btn btn-primary tool-mobile-sticky__btn"
      href={TELEGRAM_LINKS.tools}
      target="_blank"
      rel="noopener noreferrer"
      onclick={() => trackTelegramClick(`sticky_${currentPath}`)}
    >
      🚀 Unirme al Canal Oficial de Señales Gratis
    </a>
  </div>
</div>

<style>
  .tool-page {
    min-height: 100vh;
    background: var(--clr-bg);
    color: var(--clr-text);
    display: flex;
    flex-direction: column;
    padding-bottom: 5rem;
  }

  .tool-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(11, 14, 20, 0.9);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    padding: 0.85rem clamp(1rem, 4vw, 3rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .tool-header__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #fff;
  }

  .tool-header__brand img {
    border-radius: 8px;
  }

  .tool-header__name {
    display: block;
    font-weight: 700;
    font-size: 0.98rem;
    line-height: 1.2;
  }

  .tool-header__sub {
    display: block;
    font-size: 0.75rem;
    color: var(--clr-muted);
  }

  .tool-header__nav {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .tool-header__nav a {
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--clr-muted);
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .tool-header__nav a:hover,
  .tool-header__nav a[aria-current='page'] {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }

  .tool-header__cta {
    background: var(--clr-primary);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    white-space: nowrap;
  }

  .tool-main {
    max-width: 1080px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem clamp(1rem, 4vw, 2rem) 3rem;
    flex: 1;
  }

  .tool-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.84rem;
    color: var(--clr-muted);
    margin-bottom: 1.25rem;
  }

  .tool-breadcrumb a:hover {
    color: #fff;
  }

  .tool-hero {
    margin-bottom: 2rem;
    max-width: 760px;
  }

  .tool-hero__badge {
    display: inline-block;
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--clr-accent);
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.22);
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }

  .tool-hero h1 {
    font-size: clamp(1.75rem, 3.8vw, 2.5rem);
    line-height: 1.18;
    margin-bottom: 0.75rem;
  }

  .tool-hero p {
    font-size: 1.02rem;
    color: var(--clr-muted);
    line-height: 1.6;
  }

  .tool-cross-nav {
    margin-top: 3.5rem;
    padding-top: 2.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .tool-cross-nav h2,
  .tool-faq h2 {
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }

  .tool-cross-nav__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .tool-cross-card {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .tool-cross-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .tool-cross-card--vip {
    border-color: rgba(93, 95, 239, 0.4);
    background: linear-gradient(180deg, rgba(93, 95, 239, 0.12) 0%, rgba(22, 26, 34, 1) 100%);
  }

  .tool-cross-card__badge {
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--clr-accent);
  }

  .tool-cross-card h3 {
    font-size: 1.05rem;
  }

  .tool-cross-card p {
    font-size: 0.88rem;
    line-height: 1.5;
    flex: 1;
  }

  .tool-cross-card__link {
    font-size: 0.86rem;
    font-weight: 600;
    color: #fff;
    margin-top: 0.25rem;
  }

  .tool-faq {
    margin-top: 3rem;
  }

  .tool-faq__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tool-faq__item {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    padding: 1rem 1.25rem;
  }

  .tool-faq__item summary {
    cursor: pointer;
    font-weight: 600;
    color: #fff;
    font-size: 0.98rem;
  }

  .tool-faq__item p {
    margin-top: 0.75rem;
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .tool-footer__links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
  }

  .tool-footer__links a {
    color: var(--clr-muted);
  }

  .tool-footer__links a:hover {
    color: #fff;
  }

  .tool-mobile-sticky {
    display: none;
  }

  @media (max-width: 900px) {
    .tool-header__nav {
      display: none;
    }

    .tool-mobile-sticky {
      display: block;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 120;
      padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
      background: rgba(11, 14, 20, 0.94);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tool-mobile-sticky__btn {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 0.95rem;
    }
  }
</style>
