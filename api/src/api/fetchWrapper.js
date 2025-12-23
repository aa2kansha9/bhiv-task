class FetchWrapper {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = null;
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    setToken(token) {
        this.token = token;
    }

    // Helper method to delay execution
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main request method with retry logic
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Set default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                // Try to parse JSON, but handle non-JSON responses
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                } else {
                    return await response.text();
                }

            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                // Don't retry on 4xx errors (client errors)
                if (error.message.includes('HTTP 4')) {
                    break;
                }

                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt); // Exponential backoff
                }
            }
        }

        throw lastError || new Error('Request failed after all retry attempts');
    }

    // Convenience methods
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

export default FetchWrapper;