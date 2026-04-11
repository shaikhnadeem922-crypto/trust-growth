// Page sections mapping
const sections = {
    home: '/sections/home.html',
    about: '/sections/about.html',
    products: '/sections/products.html',
    reviews: '/sections/reviews.html',
    faq: '/sections/faq.html',
    contact: '/sections/contact.html'
};

let currentPage = 'home';

// Function to load a section
async function loadPage(pageName) {
    const container = document.getElementById('page-container');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<div class="text-center py-20"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div><p class="mt-4">Loading...</p></div>';
    
    try {
        const response = await fetch(sections[pageName]);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        container.innerHTML = html;
        currentPage = pageName;
        
        // Re-initialize FAQ accordion if FAQ page is loaded
        if (pageName === 'faq') {
            initFaqAccordion();
        }
        
        // Update active nav links
        document.querySelectorAll('.nav-link, .mobile-nav-link, footer a[data-nav]').forEach(link => {
            if (link.getAttribute('data-nav') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading page:', error);
        container.innerHTML = '<div class="text-center py-20 text-red-500">Error loading page. Please try again.</div>';
    }
}

// FAQ Accordion initializer
function initFaqAccordion() {
    document.querySelectorAll('.faq-answer-panel').forEach(panel => {
        panel.style.maxHeight = '0';
        panel.style.borderTopColor = 'transparent';
    });
    
    document.querySelectorAll('.faq-question-btn').forEach(button => {
        // Remove old listeners to avoid duplicates
        button.removeEventListener('click', button._listener);
        const handler = () => {
            const answerPanel = button.nextElementSibling;
            const icon = button.querySelector('.faq-icon');
            const isOpen = answerPanel.style.maxHeight !== '0px' && answerPanel.style.maxHeight !== '';
            
            // Close others
            document.querySelectorAll('.faq-question-btn').forEach(otherBtn => {
                if (otherBtn !== button) {
                    const otherPanel = otherBtn.nextElementSibling;
                    const otherIcon = otherBtn.querySelector('.faq-icon');
                    if (otherPanel && otherPanel.style.maxHeight !== '0px') {
                        otherPanel.style.maxHeight = '0';
                        otherPanel.style.borderTopColor = 'transparent';
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current
            if (!isOpen) {
                answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
                answerPanel.style.borderTopColor = '#ede6dd';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                answerPanel.style.maxHeight = '0';
                answerPanel.style.borderTopColor = 'transparent';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };
        button.addEventListener('click', handler);
        button._listener = handler;
    });
}

// Navigation event handlers
document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-nav');
        if (page && sections[page]) {
            loadPage(page);
        }
        // Close mobile menu if open
        const mobilePanel = document.getElementById('mobileMenuPanel');
        if (mobilePanel) mobilePanel.classList.add('hidden');
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const panel = document.getElementById('mobileMenuPanel');
        if (panel) panel.classList.toggle('hidden');
    });
}

// Load home page by default
loadPage('home');