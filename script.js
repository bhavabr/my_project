const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");
const newQuoteButton = document.querySelector("#newQuoteButton");
const quoteToast = document.querySelector("#quote-toast");
const contactForm = document.querySelector(".contact-form");
const projectLightbox = document.querySelector("#project-lightbox");
const lightboxImage = projectLightbox?.querySelector(".lightbox-image");
const lightboxCaption = projectLightbox?.querySelector(".lightbox-caption");
const lightboxClose = projectLightbox?.querySelector(".lightbox-close");
let lightboxTrigger;

if (contactForm) {
    const contactFields = Array.from(contactForm.querySelectorAll("input[required], textarea[required]"));
    const getFieldError = (field) => {
        if (!field.value.trim()) {
            return `${field.labels[0]?.textContent ?? "This field"} is required.`;
        }

        if (field.type === "email" && !field.validity.valid) {
            return "Enter a valid email address.";
        }

        return "";
    };

    const validateContactField = (field) => {
        const errorMessage = getFieldError(field);
        const errorElement = document.querySelector(`#${field.id}-error`);
        field.setAttribute("aria-invalid", String(Boolean(errorMessage)));

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.hidden = !errorMessage;
        }

        return !errorMessage;
    };

    contactFields.forEach((field) => {
        field.addEventListener("input", () => validateContactField(field));
        field.addEventListener("blur", () => validateContactField(field));
    });

    contactForm.addEventListener("submit", (event) => {
        const invalidFields = contactFields.filter((field) => !validateContactField(field));

        if (invalidFields.length > 0) {
            event.preventDefault();
            invalidFields[0].focus();
        }
    });
}

document.querySelector(".project-list")?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const trigger = event.target.closest(".project-image-button");
    const image = trigger?.querySelector("img");
    const projectTitle = trigger?.closest(".project-card")?.querySelector("h3")?.textContent;
    if (!trigger || !image || !projectTitle || !projectLightbox || !lightboxImage || !lightboxCaption) {
        return;
    }

    lightboxTrigger = trigger;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = projectTitle;
    projectLightbox.showModal();
});

lightboxClose?.addEventListener("click", () => {
    projectLightbox?.close();
});

projectLightbox?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        projectLightbox.close();
    }
});

projectLightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    projectLightbox.close();
});

projectLightbox?.addEventListener("click", (event) => {
    if (event.target === projectLightbox) {
        projectLightbox.close();
    }
});

projectLightbox?.addEventListener("close", () => {
    lightboxTrigger?.focus();
});

function filterProjects(category) {
    const projectCards = document.querySelectorAll(".project-card");
    const filterButtons = document.querySelectorAll("[data-project-filter]");
    const filterStatus = document.querySelector("#project-filter-status");
    const categories = new Set(Array.from(projectCards, (card) => card.dataset.projectCategory));

    if (category !== "all" && !categories.has(category)) {
        return;
    }

    let visibleProjects = 0;
    projectCards.forEach((card) => {
        const isVisible = category === "all" || card.dataset.projectCategory === category;
        card.hidden = !isVisible;
        if (isVisible) {
            visibleProjects += 1;
        }
    });

    filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.projectFilter === category));
    });

    if (filterStatus) {
        filterStatus.textContent = category === "all"
            ? `Showing all ${visibleProjects} projects.`
            : `Showing ${visibleProjects} ${category.replace("-", " ")} project${visibleProjects === 1 ? "" : "s"}.`;
    }
}

document.querySelector(".project-filters")?.addEventListener("click", (event) => {
    if (event.target instanceof Element) {
        const filterButton = event.target.closest("[data-project-filter]");
        if (filterButton) {
            filterProjects(filterButton.dataset.projectFilter);
        }
    }
});

const quotes = [
    "“Be the change that you wish to see in the world.” — Mahatma Gandhi",
    "“Your time is limited, so don't waste it living someone else's life.” — Steve Jobs",
    "“An unexamined life is not worth living.” — Socrates",
    "“It always seems impossible until it's done.” — Nelson Mandela",
    "“Where words fail, music speaks.” — Hans Christian Andersen",
    "“Either you run the day or the day runs you.” — Jim Rohn",
    "“Life is like riding a bicycle. To keep your balance, you must keep moving.” — Albert Einstein",
    "“Be yourself; everyone else is already taken.” — Oscar Wilde"
];

let quoteToastTimeout;

if (newQuoteButton && quoteToast) {
    newQuoteButton.addEventListener("click", () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteToast.textContent = randomQuote;
        quoteToast.hidden = false;

        clearTimeout(quoteToastTimeout);
        quoteToastTimeout = setTimeout(() => {
            quoteToast.hidden = true;
        }, 5000);
    });
}

if (siteHeader && menuToggle && siteNavigation) {
    siteHeader.classList.add("menu-ready");
    menuToggle.hidden = false;

    const setMenuOpen = (isOpen) => {
        siteHeader.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    siteNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && siteHeader.classList.contains("menu-open")) {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
}