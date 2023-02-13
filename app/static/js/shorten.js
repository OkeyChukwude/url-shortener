const inputForm = document.querySelector("#shorten-form");
const outputForm = document.querySelector("#result");
const shortenAgain = document.querySelector('#shorten-again');
const myurls = document.querySelector('#myurls');

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
    const button = document.querySelector('#submit');
    const longURL = document.querySelector('#long-url').value;
    const alias = document.querySelector('#alias').value;

    button.innerHTML = `<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>`;

    const response = await shorten(longURL, alias);

    if (response.error) {
        const message = response.error.message
        if (message === 'Invalid URL') {
            document.querySelector('#long-url-feedback').textContent = message
        }
        return
    }

    addToLocalStorage(response)

    document.querySelector('#long-url-output').value = response.longURL
    document.querySelector('#short-url').value = response.shortURL
    inputForm.classList.add('d-none')
    outputForm.classList.remove('d-none')    

    
});

shortenAgain.addEventListener('click', event => {
    event.preventDefault();
    inputForm.classList.remove('d-none');
    outputForm.classList.add('d-none');
    document.querySelector('#long-url').value = '';
    document.querySelector('#alias').value = '';
    document.querySelector('#submit').textContent =  'Shorten';
});

const addToLocalStorage = response => {
    let urls;

    if (urls = localStorage.getItem('urls') === null){
        urls = [];
    } else {
        urls = JSON.parse(localStorage.getItem('urls'));
    }

    urls.push(response);

    localStorage.setItem('urls', JSON.stringify(urls));

}

myurls.addEventListener('click', () => {
    let urls;

    if (urls = localStorage.getItem('urls') === null){
        urls = [];
    } else {
        urls = JSON.parse(localStorage.getItem('urls'));
    }

    document.querySelector('#urls').innerHTML = '';

    for (let url of urls) {
        let container = document.createElement('div');
        let longurlEle = document.createElement('h5');
        let shorturlEle = document.createElement('p');
        let buttonsContainer = document.createElement('div')
        
        buttonsContainer.innerHTML = `<button type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" ><i class="bi bi-forward-fill"></i></button>
                            <button type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" ><i class="bi bi-envelope-fill"></i></button>
                            <button type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" ><i class="bi bi-qr-code"></i></button>
                            <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>">Share</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><button class="dropdown-item" type="button"><i class="bi bi-facebook"></i> Facebook</button></li>
                                <li><button class="dropdown-item" type="button"><i class="bi bi-twitter"></i> Twitter</button></li>
                                <li><button class="dropdown-item" type="button"><i class="bi bi-whatsapp"></i> WhatsApp</button></li>
                                <li><button class="dropdown-item" type="button"><i class="bi bi-linkedin"></i> Linkenin</button></li>
                                
                            </ul>
                            <button type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" >Copy</button>`

        longurlEle.textContent = url.longURL;
        shorturlEle.textContent = url.shortURL;

        container.appendChild(longurlEle);
        container.appendChild(shorturlEle);
        container.appendChild(buttonsContainer);
        container.appendChild(document.createElement('hr'))
        document.querySelector('#urls').appendChild(container);
    }
    
})