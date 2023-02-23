const inputForm = document.querySelector("#shorten-form");
const outputForm = document.querySelector("#result");
const shortenAgain = document.querySelector('#shorten-again');
const myurls = document.querySelector('#myurls');
const myUrlsButton = document.querySelector('#myUrlsButton')
const copyButton = document.querySelector('#copy')
const qrbutton = document.querySelector('#qr-share')

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
    document.querySelector('#visit').href = response.shortURL
    document.querySelector('#twitter-share').href = `https://twitter.com/intent/tweet?text=Share shorts on Twitter ${response.shortURL}`
    document.querySelector('#linkedIn-share').href = `https://www.linkedin.com/sharing/share-offsite/?url=${response.shortURL}`
    document.querySelector('#facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${response.shortURL}`
    document.querySelector('#whatsapp-share').href = `https://whatsapp://send?text=Share shorts on WhatsApp ${response.shortURL}`
    document.querySelector('#email-share').href = `mailto:?subject=Share Shorts&amp;body=Share shorts${response.shortURL}`
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

async function getQRCode(event) {
    let qr;
    if (event.target.parentElement.parentElement === document.querySelector('#result')) {
        qr = new QRious({
            value: document.querySelector('#short-url').value
        });
    } else {
        qr = new QRious({
            value: event.target.parentElement.parentElement.parentElement.querySelector('p').textContent
        });
    }

    setTimeout(function () {
        let link = document.createElement("a");
        link.download = 'short.png';
        link.href = qr.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }, 1000)
}

qrbutton.addEventListener('click', getQRCode)


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

function createSidebarElements() {
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
        let buttonsContainer = document.createElement('div');
        
        buttonsContainer.innerHTML = `
                            <a href=${url.shortURL} target="_blank" type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" ><i class="bi bi-forward-fill"></i></a>
                            <a type="button" href="mailto:?subject=Share Shorts&amp;body=Share shorts${url.shortURL}" id="email-share" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Email</span>" ><i class="bi bi-envelope-fill"></i></a>
                            <button type="button" class="qr-share-offcanvas btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>QR Code</span>" ><i class="bi bi-qr-code"></i></button>
                            <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Share on social media</span>">Share</button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><a href="https://www.facebook.com/sharer/sharer.php?u=${url.shortURL}" class="dropdown-item" id="facebook-share" target="_blank" rel="noopener noreferrer" type="button"><i class="bi bi-facebook"></i> Facebook</a></li>
                                <li><a href="https://twitter.com/intent/tweet?text=Share shorts on Twitter ${url.shortURL}" class="dropdown-item" id="twitter-share" target="_blank" rel="noopener noreferrer" data-size="large"  type="button"><i class="bi bi-twitter"></i> Twitter</a></li>
                                <li><a class="dropdown-item" id="whatsapp-share" data-action="share/whatsapp/share" rel="noopener noreferrer" target="_blank type="button"><i class="bi bi-whatsapp"></i> WhatsApp</a></li>
                                <li><a href="https://www.linkedin.com/sharing/share-offsite/?url=${url.shortURL}" class="dropdown-item" id="linkedIn-share" target="_blank" rel="noopener noreferrer" type="button"><i class="bi bi-linkedin"></i> LinkedIn</a></li>
                            </ul>
                            <button type="button" class="copy btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark' onclick='copyToClipboard()'>Copy to clipboard</span>" >Copy</button>`;

        longurlEle.textContent = url.longURL;
        shorturlEle.textContent = url.shortURL;

        container.appendChild(longurlEle);
        container.appendChild(shorturlEle);
        container.appendChild(buttonsContainer);
        container.appendChild(document.createElement('hr'));
        document.querySelector('#urls').appendChild(container);

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
    const qrshareButtons = document.querySelectorAll('.qr-share-offcanvas')
    qrshareButtons.forEach(button => {
        button.addEventListener('click', getQRCode)
    })

    const copyButtons = document.querySelectorAll('.copy')
    copyButtons.forEach(button => {
        button.addEventListener('click', copyToClipboard)
    })
}

myurls.addEventListener('click', createSidebarElements)

myUrlsButton.addEventListener('click', createSidebarElements)

async function copyToClipboard(event) {
    try {
        if (event.target.parentElement.parentElement === document.querySelector('#result')) {
            await navigator.clipboard.writeText(document.querySelector('#short-url').value)
        } else {
            await navigator.clipboard.writeText(event.target.parentElement.parentElement.querySelector('p').textContent)
        }
        event.target.innerHTML = '<i class="bi bi-check2"></i>'
        setTimeout(() => {
            event.target.textContent = 'Copy'
        }, 1000)
    } catch (error) {
        console.error('Failed to copy: ', error);
    }
}

copyButton.addEventListener('click', copyToClipboard)