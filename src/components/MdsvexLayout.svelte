<script>
  import { page } from '$app/stores';
  // MDsveX automatically passes frontmatter properties as exports
  let { 
    title = "Blog | Tu Esposo Trader", 
    description = "Aprende todo sobre opciones binarias y copytrading.", 
    date = "", 
    author = "Tu Esposo Trader",
    children
  } = $props();

  // Build canonical URL from current path (unified domain without www)
  let canonicalUrl = $derived(`https://tuesposotrader.com${$page.url.pathname}`);

  // Build the JSON-LD schema object reactively so Svelte can serialize it
  let schemaData = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": title,
        "description": description,
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

<!-- SEO METADATA INJECTION -->
<svelte:head>
  <title>{title} | Tu Esposo Trader</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{canonicalUrl}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="{canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Tu Esposo Trader" />
  <meta property="og:locale" content="es_VE" />
  <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
  <meta property="article:published_time" content="{date}" />
  <meta property="article:modified_time" content="{date}" />
  <meta property="article:author" content="{author}" />
  <meta name="author" content="{author}" />
  
  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@tuesposotrader" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />

  <!-- JSON-LD Schema (properly serialized via Svelte reactivity) -->
  {@html `<script type="application/ld+json">${schemaData}</script>`}
</svelte:head>

<!-- This slot renders the Markdown content -->
{@render children?.()}
