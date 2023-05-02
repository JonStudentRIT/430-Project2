const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('postMessage').classList.remove('hidden');
};

const sendPost = async (url, data, handler) => {
    console.log(data);
    const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('postMessage').classList.add('hidden');

    if(result.redirect) {
    window.location = result.redirect;
    }

    if(result.error) {
    handleError(result.error);
    }
    if(handler) {
        handler(result);
    }
};

// sendDelete will send the id to the controller through the router
const sendDelete = async (url, data, handler) => {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('postMessage').classList.add('hidden');

    if(result.redirect) {
    window.location = result.redirect;
    }

    if(result.error) {
    handleError(result.error);
    }
    if(handler) {
        handler(result);
    }
};

const hideError = () => {
    document.getElementById('postMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    sendDelete,
    hideError,
}