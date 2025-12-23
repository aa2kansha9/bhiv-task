
class Storage {
    constructor(type = 'browser') {
        this.type = type;
        
        // For Node.js environment
        if (type === 'node' && typeof window === 'undefined') {
            this.fs = require('fs');
            this.path = require('path');
        }
    }

    /**
     * Set storage type dynamically
     * @param {string} type - 'browser' or 'node'
     */
    setType(type) {
        this.type = type;
        if (type === 'node' && typeof window === 'undefined') {
            this.fs = require('fs');
            this.path = require('path');
        }
        return this;
    }

    // ===== INTERNAL HELPER METHODS =====
    
    /**
     * Get file path for Node.js storage
     * @param {string} key - Storage key
     * @returns {string} File path
     */
    _getFilePath(key) {
        if (!this.path) {
            throw new Error('Path module not available. Are you in Node.js environment?');
        }
        const dataDir = this.path.join(process.cwd(), 'storage-data');
        
        // Create directory if it doesn't exist
        if (!this.fs.existsSync(dataDir)) {
            this.fs.mkdirSync(dataDir, { recursive: true });
        }
        
        return this.path.join(dataDir, `${key}.json`);
    }

    /**
     * Read file content safely
     * @param {string} key - Storage key
     * @returns {Object|null} Parsed JSON or null if file doesn't exist
     */
    _readFile(key) {
        const filePath = this._getFilePath(key);
        
        if (!this.fs.existsSync(filePath)) {
            return null;
        }
        
        try {
            const data = this.fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading file ${key}:`, error);
            return null;
        }
    }

    /**
     * Write data to file
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} Success status
     */
    _writeFile(key, data) {
        try {
            const filePath = this._getFilePath(key);
            const jsonData = JSON.stringify(data, null, 2);
            this.fs.writeFileSync(filePath, jsonData, 'utf8');
            return true;
        } catch (error) {
            console.error(`Error writing file ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete file
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    _deleteFile(key) {
        try {
            const filePath = this._getFilePath(key);
            
            if (this.fs.existsSync(filePath)) {
                this.fs.unlinkSync(filePath);
                return true;
            }
            return false; // File didn't exist
        } catch (error) {
            console.error(`Error deleting file ${key}:`, error);
            return false;
        }
    }

    // ===== PUBLIC CRUD METHODS =====

    /**
     * CREATE - Store data
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    create(key, value) {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Browser storage error:', error);
                return false;
            }
        } else if (this.type === 'node') {
            return this._writeFile(key, value);
        }
        return false;
    }

    /**
     * READ - Retrieve data
     * @param {string} key - Storage key
     * @returns {any|null} Retrieved value or null
     */
    read(key) {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Browser storage error:', error);
                return null;
            }
        } else if (this.type === 'node') {
            return this._readFile(key);
        }
        return null;
    }

    /**
     * UPDATE - Update existing data
     * @param {string} key - Storage key
     * @param {any} value - New value
     * @param {boolean} merge - Whether to merge with existing data (default: false)
     * @returns {boolean} Success status
     */
    update(key, value, merge = false) {
        if (merge) {
            const existing = this.read(key);
            if (existing && typeof existing === 'object' && typeof value === 'object') {
                // Merge objects
                value = { ...existing, ...value };
            } else if (Array.isArray(existing) && Array.isArray(value)) {
                // Merge arrays
                value = [...existing, ...value];
            }
        }
        return this.create(key, value);
    }

    /**
     * DELETE - Remove data
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    delete(key) {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Browser storage error:', error);
                return false;
            }
        } else if (this.type === 'node') {
            return this._deleteFile(key);
        }
        return false;
    }

    /**
     * LIST - Get all stored keys
     * @returns {Array<string>} Array of keys
     */
    list() {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            return Object.keys(localStorage);
        } else if (this.type === 'node') {
            try {
                const dataDir = this.path.join(process.cwd(), 'storage-data');
                if (!this.fs.existsSync(dataDir)) {
                    return [];
                }
                const files = this.fs.readdirSync(dataDir);
                return files
                    .filter(file => file.endsWith('.json'))
                    .map(file => file.replace('.json', ''));
            } catch (error) {
                console.error('Error listing files:', error);
                return [];
            }
        }
        return [];
    }

    /**
     * CLEAR - Remove all data
     * @returns {boolean} Success status
     */
    clear() {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Browser storage error:', error);
                return false;
            }
        } else if (this.type === 'node') {
            try {
                const dataDir = this.path.join(process.cwd(), 'storage-data');
                if (this.fs.existsSync(dataDir)) {
                    const files = this.fs.readdirSync(dataDir);
                    files.forEach(file => {
                        if (file.endsWith('.json')) {
                            this.fs.unlinkSync(this.path.join(dataDir, file));
                        }
                    });
                    return true;
                }
                return true; // Directory doesn't exist, so already clear
            } catch (error) {
                console.error('Error clearing storage:', error);
                return false;
            }
        }
        return false;
    }

    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean} Whether key exists
     */
    has(key) {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            return localStorage.getItem(key) !== null;
        } else if (this.type === 'node') {
            const filePath = this._getFilePath(key);
            return this.fs.existsSync(filePath);
        }
        return false;
    }

    /**
     * Get storage statistics
     * @returns {Object} Storage statistics
     */
    stats() {
        if (this.type === 'browser' && typeof window !== 'undefined') {
            return {
                type: 'browser',
                itemCount: localStorage.length,
                keys: this.list()
            };
        } else if (this.type === 'node') {
            const keys = this.list();
            let totalSize = 0;
            
            keys.forEach(key => {
                const filePath = this._getFilePath(key);
                if (this.fs.existsSync(filePath)) {
                    const stats = this.fs.statSync(filePath);
                    totalSize += stats.size;
                }
            });
            
            return {
                type: 'node',
                itemCount: keys.length,
                totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
                keys: keys
            };
        }
        return { type: 'unknown', itemCount: 0 };
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}

// Export for browser
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}