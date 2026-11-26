<script lang="ts">
    import { INTERACTIVE_TOOLS } from '$lib/config.js';

    interface MdsvexModule {
        metadata?: {
            title?: string;
            description?: string;
            date?: string;
            author?: string;
        };
    }

    const allPosts = import.meta.glob<MdsvexModule>('./*/+page.md', { eager: true });

    const posts = Object.entries(allPosts).map(([path, module]) => {
        const slug = path.split('/')[1];
        const metadata = module.metadata || {};
        return {
            slug,
            title: metadata.title || 'Artículo sin título',
            description: (metadata.description || '').replace(/\*\*/g, ''),
            date: metadata.date || 'Reciente',
            author: metadata.author || 'Tu Esposo Trader'
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let query = $state('');
    let filteredPosts = $derived(
        query.trim() === ''
            ? posts
            : posts.filter((p) => {
                  const needle = query.trim().toLowerCase();
                  return (
                      p.title.toLowerCase().includes(needle) ||
                      p.description.toLowerCase().includes(needle) ||
                      p.slug.includes(needle)
                  );
              })
    );
</script>

<svelte:head>
    <title>Blog Oficial | Tu Esposo Trader</title>
    <meta name="description" content="Artículos, guías y tutoriales sobre opciones binarias, forex, copytrading y brokers en Venezuela y LATAM." />
    <link rel="canonical" href="https://tuesposotrader.com/blog" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    
    <meta property="og:title" content="Blog de Trading | Tu Esposo Trader" />
    <meta property="og:description" content="Artículos, guías y tutoriales sobre opciones binarias, forex, copytrading y brokers en Venezuela y LATAM." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tuesposotrader.com/blog" />
    <meta property="og:site_name" content="Tu Esposo Trader" />
    <meta property="og:locale" content="es_VE" />
    <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@tuesposotrader" />
    <meta name="twitter:title" content="Blog de Trading | Tu Esposo Trader" />
    <meta name="twitter:description" content="Artículos, guías y tutoriales sobre opciones binarias, forex, copytrading y brokers." />
    <meta name="twitter:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />

    {@html `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "name": "Blog de Trading — Tu Esposo Trader",
          "description": "Artículos, guías y tutoriales sobre opciones binarias, forex, copytrading y brokers en Venezuela y LATAM.",
          "url": "https://tuesposotrader.com/blog",
          "isPartOf": { "@type": "WebSite", "name": "Tu Esposo Trader", "url": "https://tuesposotrader.com/" },
          "inLanguage": "es"
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tuesposotrader.com/" },
            { "@type": "ListItem", "position": 2, "name": "Blog" }
          ]
        }
      ]
    })}</script>`}
</svelte:head>

<section class="blog-index">
    <div class="blog-hero">
        <div class="blog-hero-content">
            <h1>La Academia de <span class="highlight">Trading</span></h1>
            <p class="subtitle">Artículos élite, estrategias de IQ Option y Exnova, y secretos para no quemar tu cuenta.</p>
        </div>
    </div>

    <div class="blog-tools-row" aria-label="Calculadoras y herramientas">
        {#each INTERACTIVE_TOOLS as tool}
            <a href={tool.href} class="blog-tool-card">
                <span class="blog-tool-card__badge">{tool.badge}</span>
                <strong>{tool.title}</strong>
                <span>Usar herramienta gratis →</span>
            </a>
        {/each}
    </div>

    <div class="blog-search-bar">
        <label for="blog-search" class="sr-only">Buscar guía o tema</label>
        <input
            id="blog-search"
            type="search"
            placeholder="Buscar guía (ej. Exnova, retirar a Binance, gestión de riesgo, horarios)..."
            bind:value={query}
        />
        <span class="blog-search-count">{filteredPosts.length} guías</span>
    </div>

    <div class="posts-grid">
        {#each filteredPosts as post}
            <a href="/blog/{post.slug}" class="post-card glow-hover">
                <div class="post-card__content">
                    <span class="post-date">{new Date(post.date).toLocaleDateString('es-VE')}</span>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <span class="read-more">Leer artículo →</span>
                </div>
            </a>
        {/each}
    </div>
</section>

<style>
    .blog-index {
        text-align: center;
        padding: 0 5%;
    }
    
    .blog-hero {
        position: relative;
        padding: 6rem 2rem;
        margin: 0 calc(-50vw + 50%) 4rem;
        width: 100vw;
        background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
        border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        overflow: hidden;
    }

    .blog-hero::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=');
        z-index: 1;
        opacity: 0.5;
    }

    .blog-hero-content {
        position: relative;
        z-index: 2;
        max-width: 800px;
        margin: 0 auto;
    }

    .blog-hero h1 {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        margin-bottom: 1rem;
    }

    .highlight {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
    }
    
    .subtitle {
        font-size: 1.3rem;
        color: var(--clr-muted);
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    
    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2.5rem;
        text-align: left;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .post-card {
        background: rgba(15, 20, 25, 0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 2.5rem;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        position: relative;
        overflow: hidden;
    }
    
    .post-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 4px;
        background: linear-gradient(90deg, #FFD700, #FFA500);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .post-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: rgba(255, 215, 0, 0.4);
        box-shadow: 0 20px 40px rgba(255, 215, 0, 0.15);
    }
    
    .post-card:hover::before {
        opacity: 1;
    }

    .post-date {
        font-size: 0.85rem;
        color: var(--clr-accent);
        font-weight: 700;
        margin-bottom: 1rem;
        display: inline-block;
        background: rgba(255, 215, 0, 0.1);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
    }
    
    .post-card h2 {
        font-size: 1.6rem;
        color: #fff;
        margin-bottom: 1rem;
        line-height: 1.3;
        font-weight: 800;
    }
    
    .post-card p {
        font-size: 1.05rem;
        color: var(--clr-muted);
        margin-bottom: 2rem;
        flex-grow: 1;
        line-height: 1.6;
    }
    
    .read-more {
        font-weight: 700;
        color: var(--clr-accent);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .post-card:hover .read-more {
        text-decoration: underline;
    }

    .blog-tools-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        text-align: left;
    }

    .blog-tool-card {
        background: var(--clr-surface);
        border: 1px solid rgba(255, 215, 0, 0.25);
        border-radius: 12px;
        padding: 1rem 1.15rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        text-decoration: none !important;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .blog-tool-card:hover {
        transform: translateY(-2px);
        border-color: var(--clr-accent);
    }

    .blog-tool-card__badge {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--clr-accent);
    }

    .blog-tool-card strong {
        color: #fff;
        font-size: 0.98rem;
    }

    .blog-tool-card span:last-child {
        font-size: 0.84rem;
        color: var(--clr-primary);
        font-weight: 600;
    }

    .blog-search-bar {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        margin-bottom: 2.25rem;
    }

    .blog-search-bar input {
        flex: 1;
        background: var(--clr-surface);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        font-size: 0.98rem;
        font-family: inherit;
    }

    .blog-search-bar input:focus {
        outline: 2px solid var(--clr-primary);
        border-color: transparent;
    }

    .blog-search-count {
        font-size: 0.86rem;
        color: var(--clr-muted);
        white-space: nowrap;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>
