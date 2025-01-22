const STORAGE_URL = 'http://127.0.0.1:8000/api/';


/**
 * Sends a request to the specified storage URL to create, update, or delete items.
 *
 * This function handles the sending of data using HTTP methods POST, PATCH, and DELETE 
 * depending on the provided parameters. It constructs the URL based on the specified 
 * key and optional item ID, and sends the appropriate request with the necessary headers.
 * 
 * @example
 * // Create a new task
 * setItem('tasks', { title: 'New Task', description: 'Task description' }, null, token)
 *     .then(data => console.log('Task created:', data))
 *     .catch(error => console.error('Error creating task:', error));
 *
 * // Update an existing task
 * setItem('tasks', { title: 'Updated Task' }, '12345', token)
 *     .then(data => console.log('Task updated:', data))
 *     .catch(error => console.error('Error updating task:', error));
 *
 * // Delete a task
 * setItem('tasks', null, '12345', token)
 *     .then(() => console.log('Task deleted successfully'))
 *     .catch(error => console.error('Error deleting task:', error));
 */
async function setItem(key, value, id = null, token = null) {
    let url = `${STORAGE_URL + key}/`;
    if (id) {
        url += `${id}/`
    }
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`
        }
        const response = await fetch(url, {
            method: id ? (value === null ? 'DELETE' : 'PATCH') : 'POST',
            headers: headers,
            body: value ? JSON.stringify(value) : null
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response for ${key}:`, errorText);
            throw new Error(`Error saving data for key "${key}": ${errorText}`);
        }
        if (value === null) {
            return;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error in setItem for key "${key}":`, error);
        throw error;
    }
}


/**
 * Fetches data from the storage system using the specified key.
 *
 * This function constructs the URL based on the provided key and sends a GET 
 * request to retrieve the corresponding data. If the data is found, it is returned; 
 * otherwise, an error is thrown.
 * @example
 * // Fetch user data by key
 * getItem('auth/user/12345')
 *     .then(userData => console.log('User data retrieved:', userData))
 *     .catch(error => console.error('Error fetching user data:', error));
 */
async function getItem(key) {
    const url = `${STORAGE_URL + key}/`;
    const token = sessionStorage.getItem('token');
    const headers = token ? {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
    } : {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();

        if (data) {
            return data;
        } else {
            throw new Error(`Could not find data with key "${key}".`);
        }
    } catch (error) {
        console.error(`Error fetching data with key "${key}":`, error);
        throw error;
    }
}


/**
 * Registers a new user by sending the provided parameters to the registration endpoint.
 *
 * This function sends a POST request to the specified storage URL to create a new user account 
 * with the provided details. The request body must be a JSON string containing the user's registration 
 * data. If the registration is successful, the response data is returned.
 * @example
 * // Register a new user
 * registerUser({
 *     name: 'John Doe',
 *     email: 'john.doe@example.com',
 *     password: 'securepassword123'
 * })
 * .then(response => {
 *     console.log('Registration successful:', response);
 * })
 * .catch(error => {
 *     console.error('Registration failed:', error);
 * });
 */
async function registerUser(params) {
    try {
        const response = await fetch(STORAGE_URL + 'auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error in setItem:`, error);
        throw error;
    }
}


/**
 * Logs in a user by sending their email and password to the authentication endpoint.
 *
 * This function sends a POST request to the specified storage URL to authenticate the user
 * with the provided email and password. If the login is successful, the response data, which
 * may include authentication tokens or user details, is returned.
 * @example
 * // Attempt to log in a user
 * loginUser('john.doe@example.com', 'securepassword123')
 * .then(response => {
 *     console.log('Login successful:', response);
 * })
 * .catch(error => {
 *     console.error('Login failed:', error);
 * });
 */
async function loginUser(email, password) {
    try {
        const response = await fetch(STORAGE_URL + 'auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error in login user:`, error);
        throw error;
    }
}


/**
 * Checks the validity of an authentication token by sending it to the token verification endpoint.
 *
 * This function sends a GET request to the specified storage URL with the provided token
 * in the Authorization header. If the token is valid, the function returns `true`. Otherwise, 
 * it returns `false`. Any errors encountered during the request are logged and re-thrown.
 * @example
 * // Verify an authentication token
 * checkToken('some-auth-token')
 * .then(isValid => {
 *     if (isValid) {
 *         console.log('Token is valid.');
 *     } else {
 *         console.log('Token is invalid.');
 *     }
 * })
 * .catch(error => {
 *     console.error('Error verifying token:', error);
 * });
 * @param {string} token - The authentication token to be validated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the token is valid, or `false` if it is invalid.
 */
async function checkToken(token) {
    try {
        const response = await fetch(STORAGE_URL + 'token-check/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error check token:', error);
        throw error;
    }
}