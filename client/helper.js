// if there is an error show the error text
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('postMessage').classList.remove('hidden');
};

// send information from the maker to the controller
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

// remove and error if it has been resolved
const hideError = () => {
    document.getElementById('postMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError,
}