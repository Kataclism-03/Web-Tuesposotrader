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

  // Build canonical URL from current path
  let canonicalUrl = $derived(`https://www.tuesposotrader.com${$page.url.pathname}`);
</script>

<!-- SEO METADATA INJECTION -->
<svelte:head>
  <title>{title} | Tu Esposo Trader</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{canonicalUrl}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="{canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Tu Esposo Trader" />
  <meta property="og:image" content="https://www.tuesposotrader.com/assets/photos/og-image.png" />
  <meta name="author" content="{author}" />
  
  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@tuesposotrader" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:image" content="https://www.tuesposotrader.com/assets/photos/og-image.png" />

  <!-- Add JSON-LD Schema for the Article -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{title}",
      "description": "{description}",
      "author": {
        "@type": "Person",
        "name": "{author}",
        "url": "https://www.tuesposotrader.com/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Tu Esposo Trader",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.tuesposotrader.com/assets/photos/logo-512x512.png"
        }
      },
      "image": "https://www.tuesposotrader.com/assets/photos/og-image.png",
      "datePublished": "{date}"
    }
  </script>
</svelte:head>

<!-- This slot renders the Markdown content -->
{@render children?.()}
