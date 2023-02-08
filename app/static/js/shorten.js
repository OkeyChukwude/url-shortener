const inputForm = document.querySelector("#shorten-form");
const outputForm = document.querySelector("#result");

async function shorten(longURL, alias) {
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({longURL, alias})
    });

    const data = response.json()
    return data
}

inputForm.addEventListener('submit', async event => {
    event.preventDefault();
    const button = document.querySelector('#submit')
    const longURL = document.querySelector('#long-url').value;
    const alias = document.querySelector('#alias').value;

    button.innerHTML = `<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>`

    const response = await shorten(longURL, alias)

    if (response.error) {
        const message = response.error.message
        if (message === 'Invalid URL') {
            document.querySelector('#long-url-feedback').textContent = message
        }
        return
    }

    document.querySelector('#long-url-output').value = response.longURL
    document.querySelector('#short-url').value = response.shortURL
    inputForm.classList.add('d-none')
    outputForm.classList.remove('d-none')    

    
});