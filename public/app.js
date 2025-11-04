class SearchUI {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsContainer = document.getElementById('results');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.searchButton.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // Auto-search with debounce
        let debounceTimer;
        this.searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (this.searchInput.value.trim()) {
                    this.performSearch();
                }
            }, 500);
        });
    }
    
    async performSearch() {
        const query = this.searchInput.value.trim();
        
        if (!query) {
            this.displayResults([]);
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            // Simulate network delay for better UX demonstration
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.displayResults(data.results, query);
        } catch (error) {
            // console.error('Search error:', error);
            this.displayError('Failed to perform search. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }
    
    displayResults(results, query = '') {
        if (!results || results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    ${query ? `No results found for "${query}"` : 'Enter a search query to get started'}
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(result => `
            <div class="result-item">
                <div class="result-title">${this.escapeHtml(result.title)}</div>
                <div class="result-snippet">${this.escapeHtml(result.snippet)}</div>
            </div>
        `).join('');
        
        this.resultsContainer.innerHTML = `
            <div style="margin-bottom: 20px; color: #666;">
                Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${this.escapeHtml(query)}"
            </div>
            ${resultsHTML}
        `;
    }
    
    displayError(message) {
        this.resultsContainer.innerHTML = `
            <div class="no-results" style="color: #e74c3c;">
                ⚠️ ${this.escapeHtml(message)}
            </div>
        `;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the search UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchUI();
    
    // Add some initial welcome message
    setTimeout(() => {
        const resultsContainer = document.getElementById('results');
        if (!resultsContainer.innerHTML.trim()) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    👋 Welcome to Search UI!<br>
                    Type something in the search box to get started.
                </div>
            `;
        }
    }, 1000);
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => {
                // Service worker registered successfully
            })
            .catch(() => {
                // Service worker registration failed
            });
    });
}