const STORAGE_URL = 'http://127.0.0.1:8000/api/';


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

        // Überprüfen, ob die Antwort im richtigen Format vorliegt
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response for ${key}:`, errorText);
            throw new Error(`Error saving data for key "${key}": ${errorText}`);
        }

        // Wenn es sich um einen DELETE-Request handelt, gibt es nichts zurückzugeben
        if (value === null) {
            return; // Erfolgreiches Löschen, keine Rückgabe notwendig
        }

        // Für andere Anfragen (POST, PATCH) die Antwort parsen
        const data = await response.json();
        return data; // Erfolgreiche Antwort zurückgeben
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