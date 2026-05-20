const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

export function registerRevealElements(scope = document) {
    if (!scope || typeof scope.querySelectorAll !== "function") {
        return;
    }

    scope.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

window.addEventListener("DOMContentLoaded", () => {
    registerRevealElements();
});