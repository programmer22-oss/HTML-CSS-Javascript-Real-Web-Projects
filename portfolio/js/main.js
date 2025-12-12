document.addEventListener('DOMContentLoaded', function () {

  // --- PRELOADER LOGIC --- //
  // Hides the preloader once the entire page (including images and other resources) has finished loading.
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hidden');
  });

  // --- SIDEBAR NAVIGATION --- //
  const openBtn = document.querySelector('.openbtn');
  const closeBtn = document.querySelector('.closebtn');
  const collapseBtn = document.querySelector('.collapse-btn');
  const sidebar = document.querySelector('.sidebar');
  const navLinks = document.querySelectorAll('.sidebar .nav a');
  const body = document.body;

  // Opens the sidebar. Differentiates between mobile overlay and desktop slide-in.
  function openNav() {
    if (window.innerWidth <= 768) { // Mobile view: uses class for overlay
      sidebar.classList.add('sidebar-open');
    } else { // Desktop view: uses body class to shift content
      body.classList.add('sidebar-active');
    }
  }

  // Closes the sidebar.
  function closeNav() {
    if (window.innerWidth <= 768) { // Mobile view
      sidebar.classList.remove('sidebar-open');
    } else { // Desktop view
      body.classList.remove('sidebar-active');
    }
  }

  openBtn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  // Toggles the sidebar visibility on desktop.
  collapseBtn.addEventListener('click', () => {
    body.classList.toggle('sidebar-active');
  });

  // Close mobile sidebar when a navigation link is clicked for a better UX.
  navLinks.forEach(link => {
    link.addEventListener('click', () => { if (window.innerWidth <= 768) closeNav(); });
  });

  // --- THEME TOGGLE --- //
  const htmlElement = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');

  // Applies the selected theme to the document and updates the toggle button's icon and text.
  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (theme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      text.textContent = 'Light Mode';
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      text.textContent = 'Dark Mode';
    }
  }

  // On page load, check for a saved theme in localStorage and apply it. Default to 'light'.
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme || 'light');

  // Handles click on the theme toggle button to switch themes and save the preference.
  themeToggle.addEventListener('click', () => {
    let currentTheme = htmlElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the new preference.
  });

  // --- TYPING ANIMATION (Typed.js) --- //
  // Initializes the typing animation on the home section if the target element exists.
  if (document.querySelector('#typing')) {
    new Typed('#typing', {
      strings: ['Web Developer', 'Designer', 'Freelancer'],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true
    });
  }

  // --- COMBINED SCROLL EVENT HANDLER --- //
  // A single, optimized event listener for all scroll-based effects.
  const sections = document.querySelectorAll('section[id]');
  const backToTopButton = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // 1. Active Link Highlighting: Updates the active class on sidebar links based on scroll position.
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58; // Adjust offset as needed
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector('.nav a[href*=' + sectionId + ']');

      const isActive = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
      navLink.classList.toggle('active', isActive);
    });

    // 2. Back to Top Button Visibility: Shows the button after scrolling down a certain amount.
    backToTopButton.classList.toggle('show', scrollY > 300);
  }

  window.addEventListener('scroll', handleScroll);

  // Handles the smooth scroll-to-top action when the back-to-top button is clicked.
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- SCROLL REVEAL ANIMATION --- //
  // Uses IntersectionObserver for performant fade-in animations as sections scroll into view.
  const revealSections = document.querySelectorAll('section.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing after it's revealed
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

  revealSections.forEach(section => {
    revealObserver.observe(section);
  });

  // --- PORTFOLIO MODAL LOGIC --- //
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalContent = document.querySelector('.modal-content');
  const modalClose = document.querySelector('.modal-close');

  let focusableElements = [];
  let firstFocusableElement, lastFocusableElement;

  // Adds a click listener to each portfolio item to open and populate the modal.
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      // Get data from clicked item
      const title = item.dataset.title;
      const imgSrc = item.dataset.imgSrc;
      const description = item.dataset.description;
      const tech = item.dataset.tech.split(',');
      const liveLink = item.dataset.liveLink;
      const githubLink = item.dataset.githubLink;

      // Populate the modal with the project's data.
      modalContent.querySelector('.modal-img').src = imgSrc;
      modalContent.querySelector('.modal-title').textContent = title;
      modalContent.querySelector('.modal-description').textContent = description;
      modalContent.querySelector('.modal-live-link').href = liveLink;
      modalContent.querySelector('.modal-github-link').href = githubLink;

      const techContainer = modalContent.querySelector('.modal-tech');
      techContainer.innerHTML = ''; // Clear previous tech tags before adding new ones.
      tech.forEach(t => {
        const techSpan = document.createElement('span');
        techSpan.textContent = t;
        techContainer.appendChild(techSpan);
      });

      // Show modal
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll

      // Accessibility: Trap focus within the modal.
      focusableElements = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];
      firstFocusableElement.focus();
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  }

  // --- MODAL ACCESSIBILITY (KEYBOARD NAVIGATION) --- //
  document.addEventListener('keydown', (e) => {
    // Close modal with the Escape key.
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }

    // Focus Trapping: Keep keyboard focus within the modal when it's open.
    if (e.key === 'Tab' && modalBackdrop.classList.contains('active')) {
      if (e.shiftKey) { // Handle Shift + Tab.
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // if tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Add event listeners to close the modal.
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) { // Close if clicking on the backdrop itself.
      closeModal();
    }
  });

  // --- EMAIL COPY TO CLIPBOARD --- //
  const emailBox = document.querySelector('.email-box');
  const toastNotification = document.querySelector('.toast-notification');

  if (emailBox) {
    emailBox.addEventListener('click', () => {
      const email = emailBox.dataset.email;
      navigator.clipboard.writeText(email).then(() => {
        // Show a "copied" confirmation message.
        toastNotification.classList.add('show');

        // Hide toast after 3 seconds
        setTimeout(() => {
          toastNotification.classList.remove('show');
        }, 3000);
      }).catch(err => {
        // Fallback for browsers that might not support the clipboard API.
        console.error('Failed to copy email: ', err);
        alert('Failed to copy email. Please copy it manually.');
      });
    });
  }

});