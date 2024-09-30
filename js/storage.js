const STORAGE_URL = 'http://127.0.0.1:8000/api/';


// Für das aufrufen von POST die setItem folgend aufrufen:
// setItem('tasks', tasks)
// Für das aufrufen von PATCH die setItem folgend aufrufen:
// setItem('tasks', taskToUpdate, taskId)
// Für das aufrufen von DELETE die setItem folgend aufrufen:
// setItem('tasks',null, taskId)
async function setItem(key, value, id = null) {
    let url = `http://127.0.0.1:8000/api/${key}/`;
    if (id) {
        url += `${id}/`
    }
    try {
        const response = await fetch(url, {
            method: id ? (value === null ? 'DELETE' : 'PATCH') : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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


async function getItem(key) {
    const url = `http://127.0.0.1:8000/api/${key}/`;
    try {
        const response = await fetch(url);
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


async function registerUser(params) {
    try {
        const response = await fetch(STORAGE_URL + 'registration/', {
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