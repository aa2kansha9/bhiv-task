import React, { useState } from 'react';
import FetchWrapper from '../api/fetchWrapper';

const FormComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [useMockAPI, setUseMockAPI] = useState(true);

    // Initialize FetchWrapper with a public API
    const api = new FetchWrapper('https://jsonplaceholder.typicode.com');
    
    // For testing without internet, we'll use a mock API service
    const mockApi = new FetchWrapper('https://jsonplaceholder.typicode.com');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            let result;
            
            if (useMockAPI) {
                // Using JSONPlaceholder - a free fake API for testing
                result = await mockApi.post('/posts', {
                    title: formData.name,
                    body: formData.message,
                    userId: 1,
                    email: formData.email
                });
            } else {
                // Example with a different API (reqres.in)
                const alternativeApi = new FetchWrapper('https://reqres.in/api');
                result = await alternativeApi.post('/users', {
                    name: formData.name,
                    email: formData.email,
                    job: formData.message || "No message provided"
                });
            }
            
            setResponse(result);
            setFormData({ name: '', email: '', message: '' });
            
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTestGet = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.get('/posts/1');
            setResponse(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>API Wrapper Test Form</h2>
            
            <div style={styles.toggle}>
                <label>
                    <input
                        type="checkbox"
                        checked={useMockAPI}
                        onChange={() => setUseMockAPI(!useMockAPI)}
                    />
                    Use JSONPlaceholder API (recommended for testing)
                </label>
                <p style={styles.note}>
                    {useMockAPI 
                        ? 'Using: https://jsonplaceholder.typicode.com' 
                        : 'Using: https://reqres.in/api'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Enter your name"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Enter your email"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Enter your message (optional)"
                        rows="4"
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Submitting...' : 'Submit Form'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleTestGet}
                        disabled={loading}
                        style={styles.testButton}
                    >
                        Test GET Request
                    </button>
                </div>
            </form>

            {loading && (
                <div style={styles.loading}>
                    <p>Loading... (Check console for retry attempts if any)</p>
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            {response && (
                <div style={styles.response}>
                    <h3>API Response:</h3>
                    <pre style={styles.pre}>
                        {JSON.stringify(response, null, 2)}
                    </pre>
                    <p style={styles.success}>Request successful! Check the response above.</p>
                </div>
            )}

            <div style={styles.info}>
                <h4>How to test:</h4>
                <ol>
                    <li>Fill the form and click "Submit Form" to test POST</li>
                    <li>Click "Test GET Request" to test GET</li>
                    <li>Check browser console for retry attempt logs</li>
                    <li>Try disconnecting internet to see error handling</li>
                </ol>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    form: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
        resize: 'vertical'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    submitButton: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    testButton: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    loading: {
        backgroundColor: '#fff3cd',
        padding: '10px',
        borderRadius: '4px',
        margin: '10px 0'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '15px',
        borderRadius: '4px',
        margin: '10px 0'
    },
    response: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        padding: '15px',
        borderRadius: '4px',
        margin: '10px 0'
    },
    pre: {
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '4px',
        overflowX: 'auto',
        fontSize: '14px'
    },
    success: {
        color: '#155724',
        marginTop: '10px'
    },
    toggle: {
        backgroundColor: '#e7f3ff',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    note: {
        fontSize: '12px',
        color: '#666',
        marginTop: '5px'
    },
    info: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
        fontSize: '14px'
    }
};

export default FormComponent;