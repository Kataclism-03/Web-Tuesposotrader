import { registerRevealElements } from "./ui-effects.js";
import galleryEntries from "../data/gallery.json";

// Logo asset resolve via Vite
const logoUrl = new URL('../assets/photos/logo-512x512.png', import.meta.url).href;

const photoAssets = import.meta.glob("../assets/photos/*.{avif,gif,jpeg,jpg,png,webp}", {
    eager: true,
    import: "default"
});

// Background images via glob (Vite can statically analyze this)
const bgModules = import.meta.glob("../assets/photos/background-*.jpg", { eager: true, import: "default" });
const backgroundImages = Object.values(bgModules);

let mediaLightboxInstance = null;

function getMediaLightbox() {
    if (mediaLightboxInstance) {
        return mediaLightboxInstance;
    }

    const overlay = document.createElement("div");
    overlay.className = "media-lightbox";
    overlay.innerHTML = `
        <div class="media-lightbox__content">
            <button class="media-lightbox__close" type="button" aria-label="Cerrar imagen ampliada">
                <span aria-hidden="true">&times;</span>
            </button>
            <img class="media-lightbox__image" src="" alt="" />
        </div>
    `;

    document.body.appendChild(overlay);

    const image = overlay.querySelector(".media-lightbox__image");
    const closeButton = overlay.querySelector(".media-lightbox__close");

    if (!(image instanceof HTMLImageElement) || !(closeButton instanceof HTMLButtonElement)) {
        mediaLightboxInstance = { open: () => {}, close: () => {} };
        return mediaLightboxInstance;
    }

    const dispatchState = (state) => {
        document.dispatchEvent(
            new CustomEvent("mediaLightboxState", {
                detail: { state }
            })
        );
    };

    const close = () => {
        overlay.classList.remove("is-open");
        image.src = "";
        dispatchState("closed");
    };

    const open = ({ src, alt }) => {
        image.src = src;
        image.alt = alt;
        overlay.classList.add("is-open");
        closeButton.focus();
        dispatchState("opened");
    };

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            close();
        }
    });

    mediaLightboxInstance = { open, close };
    return mediaLightboxInstance;
}



// Social links are now hardcoded in +page.svelte — no dynamic rendering needed

async function initMediaGallery() {
    const track = document.getElementById("media-gallery-track");
    const carousel = track?.closest('[data-carousel="photos"]');
    const viewport = carousel?.querySelector(".media-gallery__viewport");
    const prevButton = carousel?.querySelector('[data-carousel-control="prev"]');
    const nextButton = carousel?.querySelector('[data-carousel-control="next"]');

    if (!track || !viewport) {
        return;
    }

    try {
        const photos = galleryEntries.map((item, index) => {
            const resolvedSrc = photoAssets[item.src];

            if (!resolvedSrc) {
                throw new Error(`Recurso de galería no encontrado: ${item.src}`);
            }

            return {
                src: resolvedSrc,
                alt: item.alt || `Contenido Tu Esposo Trader ${String(index + 1).padStart(2, "0")}`
            };
        });

        track.innerHTML = photos
            .map(
                (photo, index) => `
            <button class="media-card glow-hover reveal" type="button" aria-label="Ampliar imagen ${index + 1}">
                <span class="media-card__thumb photo">
                    <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async" />
                </span>
            </button>`
            )
            .join("");

        const cards = Array.from(track.querySelectorAll(".media-card"));
        if (cards.length === 0) {
            registerRevealElements(track);
            return;
        }

        const lightbox = getMediaLightbox();
        const itemsPerView = 2;
        const autoplayDelay = 3200;

        let currentIndex = 0;
        let autoplayTimer = null;

        const getPaddingStart = () => {
            const styles = window.getComputedStyle(track);
            const raw = styles.paddingInlineStart || styles.paddingLeft || "0";
            const parsed = Number.parseFloat(raw);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        const getMaxStartIndex = () => Math.max(0, cards.length - itemsPerView);

        const updateNavState = () => {
            const maxStartIndex = getMaxStartIndex();
            const atStart = currentIndex <= 0;
            const atEnd = currentIndex >= maxStartIndex;
            const hasOverflow = maxStartIndex > 0;

            if (prevButton) {
                prevButton.disabled = !hasOverflow || atStart;
            }

            if (nextButton) {
                nextButton.disabled = !hasOverflow || atEnd;
            }
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                window.clearTimeout(autoplayTimer);
                autoplayTimer = null;
            }
        };

        const scrollToIndex = (index, behavior = "smooth") => {
            const maxStartIndex = getMaxStartIndex();
            const clampedIndex = Math.max(0, Math.min(index, maxStartIndex));
            const card = cards[clampedIndex];

            if (!card) {
                return;
            }

            currentIndex = clampedIndex;

            const paddingLeft = getPaddingStart();
            // Centrar la tarjeta en el viewport: desplazar para que el centro del card coincida con el centro del viewport
            const cardCenter = card.offsetLeft - paddingLeft + card.offsetWidth / 2;
            const left = Math.max(0, Math.floor(cardCenter - viewport.clientWidth / 2));

            viewport.scrollTo({ left, behavior });
            updateNavState();
        };

        const scheduleAutoplay = () => {
            stopAutoplay();

            if (document.hidden || cards.length <= itemsPerView) {
                return;
            }

            autoplayTimer = window.setTimeout(() => {
                const maxStartIndex = getMaxStartIndex();
                const nextIndex = currentIndex + itemsPerView;
                const targetIndex = nextIndex > maxStartIndex ? 0 : nextIndex;
                scrollToIndex(targetIndex);
                scheduleAutoplay();
            }, autoplayDelay);
        };

        const restartAutoplay = () => {
            stopAutoplay();
            scheduleAutoplay();
        };

        prevButton?.addEventListener("click", () => {
            scrollToIndex(currentIndex - itemsPerView);
            restartAutoplay();
        });

        nextButton?.addEventListener("click", () => {
            scrollToIndex(currentIndex + itemsPerView);
            restartAutoplay();
        });

        cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                stopAutoplay();
                lightbox.open(photos[index]);
            });
        });

        viewport.addEventListener("scroll", () => {
            const paddingLeft = getPaddingStart();
            const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
            let closestIndex = currentIndex;
            let smallestDistance = Number.POSITIVE_INFINITY;

            cards.forEach((card, cardIndex) => {
                const cardCenter = card.offsetLeft - paddingLeft + card.offsetWidth / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestIndex = cardIndex;
                }
            });

            const normalizedIndex = Math.max(0, Math.min(closestIndex, getMaxStartIndex()));

            if (normalizedIndex !== currentIndex) {
                currentIndex = normalizedIndex;
                updateNavState();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
                return;
            }

            scheduleAutoplay();
        });

        document.addEventListener("mediaLightboxState", (event) => {
            const state = event.detail?.state;
            if (state === "opened") {
                stopAutoplay();
            }

            if (state === "closed") {
                scheduleAutoplay();
            }
        });

        window.addEventListener("resize", () => {
            scrollToIndex(currentIndex, "auto");
        });

        scrollToIndex(0, "auto");
        scheduleAutoplay();
        registerRevealElements(track);
    } catch (error) {
        console.error("Error al cargar la galería multimedia:", error);
    }
}

async function initVideoGallery() {
    const track = document.getElementById("video-gallery-track");
    const carousel = track?.closest('[data-carousel="videos"]');
    const viewport = carousel?.querySelector(".media-gallery__viewport");
    const prevButton = carousel?.querySelector('[data-carousel-control="prev"]');
    const nextButton = carousel?.querySelector('[data-carousel-control="next"]');

    if (!track || !viewport) {
        return;
    }

    const resolveAsset = (value) => {
        if (!value) {
            return "";
        }

        return value.startsWith("http") ? value : new URL(value, import.meta.url).href;
    };

    try {
        // Detectar automáticamente todos los videos en la carpeta de assets usando Vite
        const modules = import.meta.glob("../assets/videos/*.{mp4,webm}", {
            eager: true,
            import: "default"
        });
        const discovered = Object.values(modules || {});


        const videos = discovered
            .map((url, index) => ({ src: url, poster: "", title: `Video Tu Esposo Trader ${String(index + 1).padStart(2, "0")}` }))
            .sort()
            .slice(0, 4); // Show only the first 4 videos for performance and layout cleanups

        videos.forEach((v, i) => console.debug(`video[${i}] src=`, v.src));

        // Crear slides programáticamente para evitar problemas de parseo con innerHTML
        track.innerHTML = "";
        videos.forEach((video) => {
            const card = document.createElement("div");
            card.className = "media-card media-card--video glow-hover reveal";

            const vid = document.createElement("video");
            vid.className = "media-card__video";
            vid.src = video.src;
            vid.title = video.title;
            vid.preload = "metadata";
            vid.playsInline = true;
            vid.controls = true;
            if (video.poster) vid.poster = video.poster;

            card.appendChild(vid);
            track.appendChild(card);
        });

        const slides = Array.from(track.querySelectorAll(".media-card"))
            .map((card) => {
                const video = card.querySelector("video");
                if (!(video instanceof HTMLVideoElement)) {
                    return null;
                }

                return { card, video };
            })
            .filter((item) => item !== null);

        slides.forEach(({ video }, idx) => {
            video.addEventListener("error", (ev) => {
                console.error(`initVideoGallery: video load error [${idx}]`, video.currentSrc || video.src, ev);
            });

            video.addEventListener("loadedmetadata", () => {
                // metadata loaded
            });
        });

        if (slides.length === 0) {
            registerRevealElements(track);
            return;
        }

        // Diagnostics: comprobar dimensiones de viewport/track y forzar mínimo si no hay overflow
        const computeMetrics = () => {
            const viewportScrollWidth = viewport.scrollWidth;
            const viewportClientWidth = viewport.clientWidth;
            const trackScrollWidth = track.scrollWidth;
            const trackClientWidth = track.clientWidth;
            const firstCard = slides[0]?.card;
            const cardWidth = firstCard ? firstCard.offsetWidth : 0;
            const styles = window.getComputedStyle(track);
            const gapRaw = styles.gap || styles.columnGap || "0px";
            const gap = Number.parseFloat(gapRaw) || 0;

            if (viewportScrollWidth <= viewportClientWidth && slides.length > 1) {
                const needed = slides.length * (cardWidth + gap) + 4;
                track.style.minWidth = `${needed}px`;
            }
        };

        // Ejecutar una vez tras montaje y también en resize
        computeMetrics();
        window.addEventListener("resize", computeMetrics);

        const itemsPerView = 1;
        let currentIndex = 0;

        const ensureVideoDefaults = (video) => {
            video.controls = true;
            video.autoplay = false;
            video.loop = false;
            video.muted = false;
            video.playsInline = true;
            video.removeAttribute("muted");
            video.setAttribute("playsinline", "");
            video.setAttribute("preload", video.getAttribute("preload") || "metadata");
        };

        slides.forEach(({ video }) => {
            ensureVideoDefaults(video);
        });

        const getPaddingStart = () => {
            const styles = window.getComputedStyle(track);
            const raw = styles.paddingInlineStart || styles.paddingLeft || "0";
            const parsed = Number.parseFloat(raw);
            return Number.isFinite(parsed) ? parsed : 0;
        };

        const getMaxStartIndex = () => Math.max(0, slides.length - itemsPerView);

        const updateNavState = () => {
            const maxStartIndex = getMaxStartIndex();
            const atStart = currentIndex <= 0;
            const atEnd = currentIndex >= maxStartIndex;
            const hasOverflow = maxStartIndex > 0;

            if (prevButton) {
                prevButton.disabled = !hasOverflow || atStart;
            }

            if (nextButton) {
                nextButton.disabled = !hasOverflow || atEnd;
            }
        };

        const setActiveVideo = (index, { resetOthers = false } = {}) => {
            slides.forEach(({ video, card }, videoIndex) => {
                if (videoIndex === index) {
                    card.classList.add("is-active");
                } else {
                    card.classList.remove("is-active");
                }

                if (videoIndex !== index) {
                    video.pause();
                    if (resetOthers) {
                        try {
                            video.currentTime = 0;
                        } catch (e) {
                            // ignore if not seekable
                        }
                    }
                }
            });
        };

        const scrollToIndex = (
            index,
            { behavior = "smooth", resetOthers = false } = {}
        ) => {
            const maxStartIndex = getMaxStartIndex();
            const clampedIndex = Math.max(0, Math.min(index, maxStartIndex));
            const card = slides[clampedIndex]?.card;

            if (!card) {
                return;
            }

            currentIndex = clampedIndex;

            const paddingLeft = getPaddingStart();
            const left = Math.max(card.offsetLeft - paddingLeft, 0);

            viewport.scrollTo({ left, behavior });
            updateNavState();

            window.requestAnimationFrame(() => {
                setActiveVideo(currentIndex, { resetOthers });
            });
        };

        prevButton?.addEventListener("click", () => {
            scrollToIndex(currentIndex - itemsPerView, { resetOthers: true });
        });

        nextButton?.addEventListener("click", () => {
            scrollToIndex(currentIndex + itemsPerView, { resetOthers: true });
        });

        // Hacer el carousel enfocanble y añadir navegación por teclado (flechas)
        try {
            if (carousel && !carousel.hasAttribute("tabindex")) {
                carousel.setAttribute("tabindex", "0");
            }

            carousel?.addEventListener("keydown", (ev) => {
                if (ev.key === "ArrowLeft") {
                    ev.preventDefault();
                    prevButton?.click();
                }

                if (ev.key === "ArrowRight") {
                    ev.preventDefault();
                    nextButton?.click();
                }
            });
        } catch (e) {
            console.warn("initVideoGallery: keyboard navigation not attached", e);
        }

        slides.forEach(({ video }, index) => {
            video.addEventListener("play", () => {
                const cardIndex = index;
                if (cardIndex !== currentIndex) {
                    scrollToIndex(cardIndex, { resetOthers: false });
                }

                slides.forEach(({ video: other }, otherIndex) => {
                    if (otherIndex !== index) {
                        other.pause();
                    }
                });
            });
        });

        viewport.addEventListener("scroll", () => {
            const paddingLeft = getPaddingStart();
            const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
            let closestIndex = currentIndex;
            let smallestDistance = Number.POSITIVE_INFINITY;

            slides.forEach(({ card }, cardIndex) => {
                const cardCenter = card.offsetLeft - paddingLeft + card.offsetWidth / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestIndex = cardIndex;
                }
            });

            const normalizedIndex = Math.max(0, Math.min(closestIndex, getMaxStartIndex()));

            if (normalizedIndex !== currentIndex) {
                currentIndex = normalizedIndex;
                updateNavState();
                setActiveVideo(currentIndex);
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                slides.forEach(({ video }) => {
                    video.pause();
                });
                return;
            }

            setActiveVideo(currentIndex);
        });

        window.addEventListener("resize", () => {
            scrollToIndex(currentIndex, { behavior: "auto" });
        });

        updateNavState();
        scrollToIndex(0, { behavior: "auto", resetOthers: true });
        registerRevealElements(track);
    } catch (error) {
        console.error("Error al cargar la galería de videos:", error);
    }
}

function initBackgroundRotation() {
    const container = document.getElementById("background-rotator");
    if (!container || backgroundImages.length === 0) {
        return;
    }

    let currentIndex = 0;

    const mountLayer = (imageUrl) => {
        const layer = document.createElement("div");
        layer.className = "background-rotator__layer";
        const img = new Image();
        img.src = imageUrl;
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = "";
        img.className = "background-rotator__image";

        layer.appendChild(img);
        container.appendChild(layer);

        const onReady = () => {
            const imageRatio = img.naturalWidth / img.naturalHeight;
            const viewportRatio = window.innerWidth / window.innerHeight;

            let orientation = "landscape";

            if (!Number.isFinite(imageRatio) || imageRatio === 0) {
                orientation = "landscape";
            } else if (imageRatio < viewportRatio * 0.9) {
                orientation = "portrait";
            } else if (imageRatio > viewportRatio * 1.35) {
                orientation = "panorama";
            }

            layer.classList.add(`background-rotator__layer--${orientation}`);
            requestAnimationFrame(() => {
                layer.classList.add("is-visible");
            });
        };

        if (img.complete && img.naturalWidth > 0) {
            onReady();
        } else {
            img.addEventListener("load", onReady, { once: true });
            img.addEventListener(
                "error",
                () => {
                    layer.classList.add("background-rotator__layer--landscape");
                    requestAnimationFrame(() => layer.classList.add("is-visible"));
                },
                { once: true }
            );
        }

        const layers = container.querySelectorAll(".background-rotator__layer");
        if (layers.length > 1) {
            const previous = layers[0];
            if (previous !== layer) {
                previous.classList.remove("is-visible");
                previous.addEventListener(
                    "transitionend",
                    () => {
                        previous.remove();
                    },
                    { once: true }
                );
            }
        }
    };

    const cycle = () => {
        mountLayer(backgroundImages[currentIndex]);
        currentIndex = (currentIndex + 1) % backgroundImages.length;
    };

    cycle();

    if (backgroundImages.length > 1) {
        setInterval(cycle, 6000);
    }
}

export async function init() {
    

    // Assign the logo image from `src/assets` (uses Vite asset resolution)
    try {
        const headerLogo = document.querySelector('.header__logo');
        if (headerLogo instanceof HTMLImageElement) {
            headerLogo.src = logoUrl;
        }
    } catch (e) {
        console.warn('No se pudo asignar el logo automáticamente:', e);
    }

    initBackgroundRotation();
    registerRevealElements();
}
