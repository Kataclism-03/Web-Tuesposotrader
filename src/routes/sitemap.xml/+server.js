export const prerender = true;

// Dynamic Sitemap Generator — Auto-discovers all blog posts and routes
const DOMAIN = 'https://tuesposotrader.com';

// Static pages with their priorities
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/automatizar-opciones-binarias', changefreq: 'monthly', priority: '0.9' },
  { url: '/bot-copytrading-telegram', changefreq: 'monthly', priority: '0.9' },
];

// LATAM hreflang variants for the homepage
const hreflangCodes = ['es-VE', 'es-CO', 'es-MX', 'es-AR', 'es-419', 'es'];

export async function GET() {
  // Auto-discover all blog posts from the filesystem
  const blogModules = import.meta.glob('/src/routes/blog/*/+page.md', { eager: true });

  const blogPosts = Object.entries(blogModules).map(([path, module]) => {
    const slug = path.split('/').at(-2);
    const metadata = module.metadata || {};
    return {
      url: `/blog/${slug}`,
      lastmod: metadata.date ? new Date(metadata.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    };
  }).sort((a, b) => b.lastmod.localeCompare(a.lastmod));

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Static pages
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
    // Add hreflang only for homepage
    if (page.url === '/') {
      for (const lang of hreflangCodes) {
        xml += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${DOMAIN}/"/>`;
      }
    }
    xml += `
  </url>`;
  }

  // Blog posts (auto-discovered)
  for (const post of blogPosts) {
    xml += `
  <url>
    <loc>${DOMAIN}${post.url}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
}
