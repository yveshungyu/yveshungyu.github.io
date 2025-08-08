// Simple navigation helper for multi-page website
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'index.html' || filename === '') {
            return 'home';
        } else if (filename === 'products.html') {
            return 'products';
        }
        
        return 'unknown';
    }

    init() {
        this.setupNavigation();
        this.updateActiveStates();
        console.log(`📍 Current page: ${this.currentPage}`);
    }

    setupNavigation() {
        // Ensure logo always links to home
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.href = 'index.html';
            logo.title = 'ÔDÔRAI Home';
        }

        // Add navigation functionality
        this.addNavListeners();
    }

    addNavListeners() {
        // Logo click tracking
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                console.log('🏠 Navigating to homepage');
            });
        }

        // Product links tracking
        const productLinks = document.querySelectorAll('a[href="products.html"]');
        productLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('📦 Navigating to products page');
            });
        });
    }

    updateActiveStates() {
        // Update header styling based on current page
        const header = document.querySelector('.main-header');
        if (header) {
            header.classList.add(`page-${this.currentPage}`);
        }

        // Update page-specific elements
        if (this.currentPage === 'home') {
            this.setupHomePage();
        } else if (this.currentPage === 'products') {
            this.setupProductsPage();
        }
    }

    setupHomePage() {
        console.log('🏠 Setting up homepage navigation');
        // Homepage specific navigation setup
        const heroButton = document.querySelector('.hero-cta');
        if (heroButton) {
            heroButton.addEventListener('click', (e) => {
                console.log('🔗 Hero CTA clicked - navigating to products');
            });
        }
    }

    setupProductsPage() {
        console.log('📦 Setting up products page navigation');
        // Products page specific navigation setup
    }

    // Utility method for programmatic navigation
    navigateTo(page) {
        const routes = {
            'home': 'index.html',
            'products': 'products.html'
        };

        if (routes[page]) {
            window.location.href = routes[page];
        } else {
            console.warn(`Unknown page: ${page}`);
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}