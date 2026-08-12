/* ========================================
   Pro South Grounds - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Sticky Header ----
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ---- Mobile Navigation ----
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close mobile nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Gallery Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ---- Lightbox ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentLightboxIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    function openLightbox(index) {
        updateVisibleItems();
        currentLightboxIndex = index;
        const item = visibleItems[currentLightboxIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = item.dataset.caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        updateVisibleItems();
        currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentLightboxIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxCaption.textContent = item.dataset.caption;
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const idx = visibleItems.indexOf(item);
            openLightbox(idx >= 0 ? idx : 0);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ---- Reviews Carousel ----
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewCards = reviewsTrack.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    const trackGap = 24;

    function getCardsPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getTrackWidth() {
        return reviewsCarousel.clientWidth;
    }

    function setCardWidths() {
        const trackWidth = getTrackWidth();
        const cardWidth = (trackWidth - trackGap * (cardsPerView - 1)) / cardsPerView;
        reviewCards.forEach(card => {
            card.style.flexBasis = cardWidth + 'px';
            card.style.width = cardWidth + 'px';
        });
    }

    function getTotalSlides() {
        return Math.max(1, reviewCards.length - cardsPerView + 1);
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const total = getTotalSlides();
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function getSlidePosition() {
        const cardWidth = reviewCards[0].offsetWidth;
        return cardWidth + trackGap;
    }

    function goToSlide(index) {
        const total = getTotalSlides();
        currentSlide = Math.max(0, Math.min(index, total - 1));
        reviewsCarousel.scrollTo({
            left: currentSlide * getSlidePosition(),
            behavior: 'smooth'
        });
        updateActiveDot();
    }

    function updateActiveDot() {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    reviewsCarousel.addEventListener('scroll', () => {
        const pos = getSlidePosition();
        if (pos > 0) {
            const active = Math.round(reviewsCarousel.scrollLeft / pos);
            if (active !== currentSlide) {
                currentSlide = active;
                updateActiveDot();
            }
        }
    }, { passive: true });

    setCardWidths();
    createDots();

    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        setCardWidths();
        createDots();
        reviewsCarousel.scrollLeft = 0;
        goToSlide(0);
    });

    // ---- Contact Form ----
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');

        const successHTML = `
            <div class="form-success">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You, ${name}!</h3>
                <p>We've received your message and will get back to you within 24 hours. For immediate assistance, call us at <a href="tel:7068812136" style="color:var(--primary);font-weight:600;">706-881-2136</a>.</p>
            </div>
        `;

        const errorHTML = `
            <div class="form-success">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Something went wrong.</h3>
                <p>Please try again, or call us directly at <a href="tel:7068812136" style="color:var(--primary);font-weight:600;">706-881-2136</a>.</p>
            </div>
        `;

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => { contactForm.innerHTML = successHTML; })
        .catch(() => { contactForm.innerHTML = errorHTML; });
    });

    // ---- Scroll Reveal Animation ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .gallery-item, .review-card, .about-feature, .area-item, .contact-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#main-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary)';
            }
        });
    });

});
