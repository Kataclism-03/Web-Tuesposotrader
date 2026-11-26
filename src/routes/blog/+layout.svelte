<script>
    import '../../styles/layout.css';
    import { TELEGRAM_LINKS, trackTelegramClick } from '$lib/config.js';
    let { children } = $props();
</script>

<div class="blog-layout">
    <header class="blog-header">
        <a href="/" class="blog-header__brand">
            <img src="/assets/photos/logo-512x512.png" alt="Tu Esposo Trader" width="34" height="34" />
            <span>Tu Esposo Trader</span>
        </a>

        <nav class="blog-header__nav" aria-label="Navegación de herramientas y academia">
            <a href="/blog">Artículos</a>
            <a href="/calculadora-retiro-exnova-binance">Retiros P2P</a>
            <a href="/calculadora-interes-compuesto">Interés Compuesto</a>
            <a href="/horarios-mercado-forex-otc">Horarios en Vivo</a>
        </nav>

        <a
            href={TELEGRAM_LINKS.blogTop}
            target="_blank"
            rel="noopener noreferrer"
            class="blog-header__cta"
            onclick={() => trackTelegramClick('blog_header')}
        >
            Comunidad Gratis →
        </a>
    </header>

    <main class="blog-article">
        {@render children?.()}
    </main>

    <div class="blog-mobile-sticky" role="region" aria-label="Unirse al canal oficial de Telegram">
        <a
            class="btn btn-primary blog-mobile-sticky__btn"
            href={TELEGRAM_LINKS.blogSticky}
            target="_blank"
            rel="noopener noreferrer"
            onclick={() => trackTelegramClick('blog_sticky')}
        >
            🚀 Señales y Copytrading Gratis en Telegram
        </a>
    </div>
</div>

<style>
    .blog-layout {
        min-height: 100vh;
        background-color: var(--clr-bg);
        color: var(--clr-text);
        padding-bottom: 6rem;
    }

    .blog-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(11, 14, 20, 0.9);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        padding: 0.85rem clamp(1rem, 4vw, 3rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .blog-header__brand {
        color: var(--clr-text);
        text-decoration: none;
        font-weight: 700;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.65rem;
        flex-shrink: 0;
    }

    .blog-header__brand img {
        border-radius: 8px;
    }

    .blog-header__nav {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .blog-header__nav a {
        color: var(--clr-muted);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .blog-header__nav a:hover {
        color: #fff;
    }

    .blog-header__cta {
        background: var(--clr-primary);
        color: #fff;
        text-decoration: none;
        font-size: 0.86rem;
        font-weight: 700;
        padding: 0.55rem 1rem;
        border-radius: 8px;
        white-space: nowrap;
        transition: background 0.2s ease;
    }

    .blog-header__cta:hover {
        background: #4B4DDF;
    }

    :global(.blog-article) {
        max-width: 840px;
        margin: 2.5rem auto;
        padding: 0 1.25rem;
        font-family: var(--font-body);
        line-height: 1.8;
    }

    :global(.blog-article h1) {
        font-size: clamp(1.85rem, 4vw, 2.75rem);
        line-height: 1.22;
        margin-bottom: 1.5rem;
        color: #fff;
    }

    :global(.blog-article h2) {
        font-size: 1.65rem;
        margin-top: 2.75rem;
        margin-bottom: 1rem;
        color: #fff;
    }

    :global(.blog-article h3) {
        font-size: 1.3rem;
        margin-top: 1.85rem;
        margin-bottom: 0.75rem;
        color: #e8edf2;
    }

    :global(.blog-article p) {
        margin-bottom: 1.35rem;
        color: var(--clr-muted);
        font-size: 1.06rem;
    }

    :global(.blog-article a) {
        color: var(--clr-accent);
        text-decoration: underline;
    }

    :global(.blog-article ul), :global(.blog-article ol) {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
        color: var(--clr-muted);
    }

    :global(.blog-article li) {
        margin-bottom: 0.5rem;
    }

    :global(.blog-article strong) {
        color: #fff;
    }

    :global(.blog-article blockquote) {
        border-left: 3px solid var(--clr-accent);
        margin: 1.75rem 0;
        background: rgba(255, 215, 0, 0.05);
        padding: 1rem 1.25rem;
        border-radius: 0 10px 10px 0;
    }

    :global(.blog-article table) {
        width: 100%;
        border-collapse: collapse;
        margin: 1.75rem 0;
        background: var(--clr-surface);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.95rem;
        display: block;
        overflow-x: auto;
    }

    :global(.blog-article th),
    :global(.blog-article td) {
        padding: 0.8rem 1rem;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    :global(.blog-article th) {
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
        font-weight: 700;
    }

    :global(.blog-article td) {
        color: var(--clr-muted);
    }

    .blog-mobile-sticky {
        display: none;
    }

    @media (max-width: 860px) {
        .blog-header__nav {
            display: none;
        }

        .blog-mobile-sticky {
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

        .blog-mobile-sticky__btn {
            width: 100%;
            padding: 0.85rem 1rem;
            font-size: 0.95rem;
            text-decoration: none;
        }
    }
</style>
