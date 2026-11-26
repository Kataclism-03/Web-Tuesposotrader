<script>
  import { page } from '$app/stores';
  import { TELEGRAM_LINKS, INTERACTIVE_TOOLS, trackTelegramClick } from '$lib/config.js';

  let {
    title = "Blog | Tu Esposo Trader",
    description = "Guías prácticas sobre opciones binarias, forex, gestión de riesgo y copytrading en Latinoamérica.",
    date = "",
    author = "Tu Esposo Trader",
    children
  } = $props();

  let canonicalUrl = $derived(`https://tuesposotrader.com${$page.url.pathname}`);

  // Evita que Google corte títulos mayores a ~60 caracteres en resultados de búsqueda
  let seoTitle = $derived(
    title.length <= 41
      ? `${title} | Tu Esposo Trader`
      : title.length > 62
        ? `${title.slice(0, 59).trimEnd()}…`
        : title
  );

  let cleanDescription = $derived(
    description.replace(/\*\*/g, '').replace(/\*/g, '').trim().slice(0, 158)
  );

  let formattedDate = $derived.by(() => {
    if (!date) return '';
    const parsed = new Date(`${date}T12:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  let schemaData = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": title,
        "description": cleanDescription,
        "author": {
          "@type": "Person",
          "name": author,
          "url": "https://tuesposotrader.com/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Tu Esposo Trader",
          "logo": {
            "@type": "ImageObject",
            "url": "https://tuesposotrader.com/assets/photos/logo-512x512.png"
          }
        },
        "image": "https://tuesposotrader.com/assets/photos/og-image.png",
        "url": canonicalUrl,
        "datePublished": date,
        "dateModified": date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "inLanguage": "es"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tuesposotrader.com/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tuesposotrader.com/blog" },
          { "@type": "ListItem", "position": 3, "name": title }
        ]
      }
    ]
  }));
</script>

<svelte:head>
  <title>{seoTitle}</title>
  <meta name="description" content={cleanDescription} />
  <link rel="canonical" href={canonicalUrl} />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={cleanDescription} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Tu Esposo Trader" />
  <meta property="og:locale" content="es_VE" />
  <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
  {#if date}
    <meta property="article:published_time" content={date} />
    <meta property="article:modified_time" content={date} />
  {/if}
  <meta property="article:author" content={author} />
  <meta name="author" content={author} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@tuesposotrader" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={cleanDescription} />
  <meta name="twitter:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />

  {@html `<script type="application/ld+json">${schemaData}</script>`}
</svelte:head>

<!-- Barra superior rápida de conversión y herramientas antes del texto largo -->
<aside class="article-top-banner" aria-label="Acceso rápido a comunidad y herramientas">
  <div class="article-top-banner__meta">
    {#if formattedDate}
      <span class="article-meta-pill">{formattedDate}</span>
    {/if}
    <span class="article-meta-author">Por {author}</span>
  </div>

  <div class="article-top-banner__cta">
    <div class="article-top-banner__copy">
      <strong>¿Prefieres copiar entradas en vivo o calcular tu gestión antes de operar?</strong>
      <span>Accede gratis al canal oficial en Telegram o usa nuestras calculadoras interactivas.</span>
    </div>
    <a
      class="btn btn-primary article-top-banner__btn"
      href={TELEGRAM_LINKS.blogTop}
      target="_blank"
      rel="noopener noreferrer"
      onclick={() => trackTelegramClick('blog_top')}
    >
      Unirme al Telegram Gratis →
    </a>
  </div>

  <div class="article-tools-strip">
    {#each INTERACTIVE_TOOLS as tool}
      <a href={tool.href} class="article-tool-chip">
        <span class="article-tool-chip__badge">{tool.badge}</span>
        <span class="article-tool-chip__label">{tool.shortTitle} →</span>
      </a>
    {/each}
  </div>
</aside>

<div class="article-body">
  {@render children?.()}
</div>

<section class="article-bottom-tools" aria-label="Herramientas interactivas gratuitas">
  <h2>Herramientas Gratuitas para Tu Operativa</h2>
  <p class="article-bottom-tools__lead">Resuelve cálculos reales de comisiones, gestión diaria y sesiones abiertas en segundos:</p>
  <div class="article-bottom-tools__grid">
    {#each INTERACTIVE_TOOLS as tool}
      <a href={tool.href} class="tool-promo-card">
        <span class="tool-promo-card__badge">{tool.badge}</span>
        <h3>{tool.title}</h3>
        <p>{tool.description}</p>
        <span class="tool-promo-card__action">Abrir herramienta →</span>
      </a>
    {/each}
  </div>
</section>

<style>
  .article-top-banner {
    background: var(--clr-surface, #161A22);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.25rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .article-top-banner__meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    font-size: 0.85rem;
    color: var(--clr-muted, #A0AAB2);
  }

  .article-meta-pill {
    background: rgba(255, 215, 0, 0.1);
    color: var(--clr-accent, #FFD700);
    padding: 0.2rem 0.65rem;
    border-radius: 6px;
    font-weight: 600;
  }

  .article-top-banner__cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .article-top-banner__copy {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .article-top-banner__copy strong {
    color: #fff;
    font-size: 0.98rem;
    line-height: 1.35;
  }

  .article-top-banner__copy span {
    color: var(--clr-muted, #A0AAB2);
    font-size: 0.88rem;
  }

  .article-top-banner__btn {
    white-space: nowrap;
    padding: 0.7rem 1.25rem;
    font-size: 0.92rem;
    text-decoration: none !important;
    color: #fff !important;
    flex-shrink: 0;
  }

  .article-tools-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }

  .article-tool-chip {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    text-decoration: none !important;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .article-tool-chip:hover {
    border-color: rgba(255, 215, 0, 0.45);
    background: rgba(255, 215, 0, 0.05);
  }

  .article-tool-chip__badge {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--clr-muted, #A0AAB2);
  }

  .article-tool-chip__label {
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--clr-accent, #FFD700);
  }

  .article-bottom-tools {
    margin-top: 3.5rem;
    padding-top: 2.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .article-bottom-tools h2 {
    margin-top: 0 !important;
    font-size: 1.5rem !important;
  }

  .article-bottom-tools__lead {
    margin-bottom: 1.25rem !important;
    font-size: 0.98rem !important;
  }

  .article-bottom-tools__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .tool-promo-card {
    background: var(--clr-surface, #161A22);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1.25rem;
    text-decoration: none !important;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .tool-promo-card:hover {
    border-color: rgba(93, 95, 239, 0.55);
    transform: translateY(-2px);
  }

  .tool-promo-card__badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--clr-accent, #FFD700);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .tool-promo-card h3 {
    margin: 0 !important;
    font-size: 1.05rem !important;
    color: #fff !important;
  }

  .tool-promo-card p {
    margin: 0 !important;
    font-size: 0.88rem !important;
    line-height: 1.5 !important;
    color: var(--clr-muted, #A0AAB2) !important;
    flex: 1;
  }

  .tool-promo-card__action {
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--clr-primary, #5D5FEF);
    margin-top: 0.25rem;
  }

  @media (max-width: 720px) {
    .article-top-banner__cta {
      flex-direction: column;
      align-items: stretch;
    }

    .article-top-banner__btn {
      width: 100%;
      text-align: center;
    }

    .article-tools-strip {
      grid-template-columns: 1fr;
    }
  }
</style>
