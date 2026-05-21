<script>
    import '../../styles/layout.css';
    let { children } = $props();
</script>

<style>
    .blog-layout {
        min-height: 100vh;
        background-color: var(--clr-bg);
        color: var(--clr-text);
        padding-bottom: 4rem;
    }

    .blog-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(11, 14, 20, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1rem 5%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blog-header a {
        color: var(--clr-text);
        text-decoration: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s;
    }

    .blog-header a:hover {
        color: var(--clr-accent);
    }

    .back-arrow {
        font-size: 1.2rem;
    }

    /* Global Markdown Article Styles */
    :global(.blog-article) {
        max-width: 800px;
        margin: 3rem auto;
        padding: 0 1.5rem;
        font-family: var(--font-base);
        line-height: 1.8;
    }

    :global(.blog-article h1) {
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.2;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    :global(.blog-article h2) {
        font-size: 1.8rem;
        margin-top: 3rem;
        margin-bottom: 1rem;
        color: #fff;
    }

    :global(.blog-article h3) {
        font-size: 1.4rem;
        margin-top: 2rem;
        margin-bottom: 0.8rem;
        color: #e0e0e0;
    }

    :global(.blog-article p) {
        margin-bottom: 1.5rem;
        color: var(--clr-muted);
        font-size: 1.1rem;
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
        border-left: 4px solid var(--clr-accent);
        padding-left: 1rem;
        margin: 2rem 0;
        font-style: italic;
        background: rgba(255, 215, 0, 0.05);
        padding: 1rem;
        border-radius: 0 8px 8px 0;
    }
</style>

<div class="blog-layout">
    <header class="blog-header">
        <a href="/">
            <span class="back-arrow">←</span>
            Volver a la Academia
        </a>
    </header>

    <main class="blog-article">
        {@render children?.()}
    </main>
</div>
