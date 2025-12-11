// This script waits for the entire HTML document to be loaded and parsed
// before running any JavaScript to ensure all elements are available.
document.addEventListener("DOMContentLoaded", () => {

    // =================================================================
    // INITIALIZER FUNCTION
    // This function calls all other setup functions.
    // =================================================================
    const init = () => {
        initStatsCounter();
        initTestimonialSlider();
        initStickyNav();
        initSmoothScrolling();
        initGalleryFilter();
    };

    // =================================================================
    // STATS COUNTER ANIMATION
    // Animates numbers counting up when the user hovers over the stats section.
    // =================================================================
    const initStatsCounter = () => {
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return; // Don't run if the section doesn't exist

        const counters = statsSection.querySelectorAll('.stat-box h3');

        const startCounters = () => {
            counters.forEach(counter => {
                // Prevent re-animating if already done
                if (counter.dataset.animated) return;
                counter.dataset.animated = "true";

                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000; // Animation duration in milliseconds
                const increment = target / (duration / 16); // ~60 frames per second

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current).toLocaleString('en-US') + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Ensure final number is exact and formatted
                        counter.innerText = target.toLocaleString('en-US') + suffix;
                    }
                };
                updateCounter();
            });
        };

        // Start animation on mouse hover, but only run it once.
        statsSection.addEventListener('mouseover', startCounters, { once: true });
    };

    // =================================================================
    // TESTIMONIAL SLIDER
    // Creates an automatic, interactive slider for the testimonials.
    // =================================================================
    const initTestimonialSlider = () => {
        const wrapper = document.querySelector('.test-wrapper');
        const testimonialsSection = document.querySelector('.testimonials');
        const dots = document.querySelectorAll('.dot');

        if (!wrapper || !testimonialsSection || dots.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;

        const goToSlide = (index) => {
            const card = wrapper.querySelector('.test-card');
            const cardWidth = card.offsetWidth;
            const gap = parseInt(window.getComputedStyle(wrapper).gap);
            const scrollAmount = index * (cardWidth + gap);

            wrapper.scrollTo({ left: scrollAmount, behavior: 'smooth' });

            document.querySelector('.dot.active').classList.remove('active');
            dots[index].classList.add('active');
            currentIndex = index;
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % dots.length;
                goToSlide(nextIndex);
            }, 5000); // Slide every 5 seconds
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                clearInterval(autoPlayInterval); // Reset timer on manual click
                startAutoPlay();
            });
        });

        // Pause/resume autoplay on hover
        testimonialsSection.addEventListener('mouseover', () => clearInterval(autoPlayInterval));
        testimonialsSection.addEventListener('mouseout', startAutoPlay);

        startAutoPlay(); // Start the slideshow
    };

    // =================================================================
    // STICKY NAVIGATION BAR
    // Makes the navigation bar stick to the top of the screen on scroll.
    // =================================================================
    const initStickyNav = () => {
        const navbar = document.querySelector('.navbar');
        const mainContent = document.querySelector('main');

        if (!navbar || !mainContent) return;

        const stickyOffset = navbar.offsetTop;
        const navbarHeight = navbar.offsetHeight;

        const handleStickyNav = () => {
            if (window.pageYOffset > stickyOffset) {
                navbar.classList.add('sticky');
                // Add padding to main content to prevent content from jumping up
                mainContent.style.paddingTop = navbarHeight + 'px';
            } else {
                navbar.classList.remove('sticky');
                mainContent.style.paddingTop = '0';
            }
        };

        window.addEventListener('scroll', handleStickyNav);
    };

    // =================================================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // Smoothly scrolls to a section when a nav link is clicked.
    // =================================================================
    const initSmoothScrolling = () => {
        const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

        const onNavLinkClick = (event) => {
            event.preventDefault(); // Prevent default browser jump
            const targetId = event.currentTarget.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbar = document.querySelector('.navbar.sticky');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                // Calculate position, accounting for the sticky nav height
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            }
        };

        navLinks.forEach(link => link.addEventListener('click', onNavLinkClick));
    };

    // =================================================================
    // GALLERY FILTER
    // Filters the gallery images based on the selected category button.
    // =================================================================
    const initGalleryFilter = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterButtons.length === 0 || galleryItems.length === 0) return;

        const handleFilterClick = (event) => {
            const filterValue = event.target.dataset.filter;

            // Update active state on buttons
            document.querySelector('.filter-btn.active').classList.remove('active');
            event.target.classList.add('active');

            // Show or hide gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.dataset.category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });
    };

    // Run the initializer function to set up all features
    init();
});