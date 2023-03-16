async function shorten(longURL, alias) {
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({longURL, alias})
    });

    const data = response.json();
    return data;
}

async function getShorts() {
    const response = await fetch('/shorts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = response.json();
    return data;
}


// Local Storage Class
class LocalStore {
    static getUrls() {
        let urls;

        if (urls = localStorage.getItem('urls') === null){
            urls = [];
        } else {
            urls = JSON.parse(localStorage.getItem('urls'));
        }

        return urls.reverse();
    }

    static addUrl(url) {
        const urls = LocalStore.getUrls();

        urls.push(url);

        localStorage.setItem('urls', JSON.stringify(urls));
    }
}

// UI class
class UI {
    static #displayUrls(urls) {
        for (let url of urls) {
            let container = document.createElement('div');
            container.classList.add('url-list-item')
            let longurlEle = document.createElement('h5');
            let shorturlEle = document.createElement('p');
            let con = document.createElement('div');
            con.classList.add ='row'
            let timeEle = document.createElement('p'); 
            timeEle.classList.add = 'col';
            let buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add = 'col'

            if (user === null) {
                buttonsContainer.innerHTML = `
                                <a href=${url.shortURL} target="_blank" type="button" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Visit URL</span>" ><i class="bi bi-forward-fill"></i></a>
                                <a type="button" href="mailto:?subject=Share Shorts&amp;body=Share shorts${url.shortURL}" id="email-share" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Email</span>" ><i class="bi bi-envelope-fill"></i></a>
                                <a href="/login" type="button" id="qr-share" class="btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Please Signup to get a qr code</span>"><i class="bi bi-qr-code"></i></a>
                                <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark'>Share on social media</span>">Share</button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    <li><a href="https://www.facebook.com/sharer/sharer.php?u=${url.shortURL}" class="dropdown-item" id="facebook-share" target="_blank" rel="noopener noreferrer" type="button"><i class="bi bi-facebook"></i> Facebook</a></li>
                                    <li><a href="https://twitter.com/intent/tweet?text=Share shorts on Twitter ${url.shortURL}" class="dropdown-item" id="twitter-share" target="_blank" rel="noopener noreferrer" data-size="large"  type="button"><i class="bi bi-twitter"></i> Twitter</a></li>
                                    <li><a class="dropdown-item" id="whatsapp-share" data-action="share/whatsapp/share" rel="noopener noreferrer" target="_blank type="button"><i class="bi bi-whatsapp"></i> WhatsApp</a></li>
                                    <li><a href="https://www.linkedin.com/sharing/share-offsite/?url=${url.shortURL}" class="dropdown-item" id="linkedIn-share" target="_blank" rel="noopener noreferrer" type="button"><i class="bi bi-linkedin"></i> LinkedIn</a></li>
                                </ul>
                                <button type="button" class="copy btn btn-outline-dark" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="<span class='dark' onclick='copyToClipboard()'>Copy to clipboard</span>" >Copy</button>`;
            } else {
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
            }

            longurlEle.textContent = url.longURL;
            shorturlEle.textContent = url.shortURL;
            timeEle.textContent = moment(url?.timestamp).fromNow();

            con.appendChild(timeEle);
            con.appendChild(buttonsContainer);
            

            container.appendChild(longurlEle);
            container.appendChild(shorturlEle);
            container.appendChild(con);
            container.appendChild(document.createElement('hr'));
            document.querySelector('#urls').appendChild(container);

            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        }
    }

    createSidebar() {
        const fetchURLPromise = new Promise(async (resolve, reject) => {
            let urls;
            if (user) {
                const response = await getShorts()
                console.log(response)
                urls = response.urls
            } else {
                urls = LocalStore.getUrls()
            }

            if (Array.isArray(urls)) {
                resolve(urls)
            } else {
                reject()
            }
        })

        document.querySelector('#myUrls').addEventListener('shown.bs.offcanvas', () => {
            fetchURLPromise
            .then((urls) => {
                document.querySelector('.spinner-border').classList.add('d-none')                  
                UI.#displayUrls(urls)

                const qrshareButtons = document.querySelectorAll('.qr-share-offcanvas')
                qrshareButtons.forEach(button => {
                    button.addEventListener('click', UI.getQRCode)
                })

                const copyButtons = document.querySelectorAll('.copy')
                copyButtons.forEach(button => {
                    button.addEventListener('click', UI.copyToClipboard)
                })
            })
        })
        
        document.querySelector('#myUrls').addEventListener('hidden.bs.offcanvas', () => {
            console.log('canvas don comot')
            document.querySelector('#urls').innerHTML = ''
            document.querySelector('.spinner-border').classList.remove('d-none')
        })
        
    }

    static async copyToClipboard(event) {
        try {
            if (event.target.parentElement.parentElement === document.querySelector('#output-form')) {
                await navigator.clipboard.writeText(document.querySelector('#short-url').value)
            } else {
                await navigator.clipboard.writeText(event.target.parentElement.parentElement.parentElement.querySelector('p').textContent)
            }
            event.target.innerHTML = '<i class="bi bi-check2"></i>'
            setTimeout(() => {
                event.target.textContent = 'Copy'
            }, 1000)
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    }

    static async getQRCode(event) {
        let qr;
        if (event.target.parentElement.parentElement.parentElement === document.querySelector('#output-form') || event.target.parentElement.parentElement === document.querySelector('#output-form')) {
            qr = new QRious({
                value: document.querySelector('#short-url').value
            });
        } else {
            qr = new QRious({
                value: event.target.parentElement.parentElement.parentElement.parentElement.querySelector('p').textContent
            });
        }

        setTimeout(function () {
            let link = document.createElement("a");
            link.download = 'short.png';
            link.href = qr.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link = null;
        }, 1000)
    }

    showInputForm(event) {
        event.preventDefault();
        document.querySelector("#input-form").classList.remove('d-none');
        document.querySelector("#output-form").classList.add('d-none');
        document.querySelector('#long-url').value = '';
        document.querySelector('#alias').value = '';
        document.querySelector('#submit').textContent =  'Shorten';
    }

    async showOutputForm(event) {
        event.preventDefault()
        const button = document.querySelector('#submit');
        const longURL = document.querySelector('#long-url').value;
        const alias = document.querySelector('#alias').value;
        const longUrlFeedback = document.querySelector('#long-url-feedback')
        const aliasFeedback = document.querySelector('#alias-feedback')

        aliasFeedback.textContent = ''
        longUrlFeedback.textContent = ''
        button.innerHTML = `<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>`;

        const response = await shorten(longURL, alias);

        if (response.error) {
            const message = response.error.message
            if (message === 'Invalid URL') {
                document.querySelector('#long-url-feedback').textContent = message
            }
            if (message === 'Alias is not available') {
                document.querySelector('#alias-feedback').textContent = message
            }
            button.innerHTML = 'Shorten';
            return
        }

        if (!user) {
            LocalStore.addUrl(response)
        }

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
    }
}

