const inputForm = document.querySelector("#input-form");
const outputForm = document.querySelector("#output-form");
const shortenAgain = document.querySelector('#shorten-again');
const myurls = document.querySelector('#myurls');
const myUrlsButton = document.querySelector('#myUrlsButton')
const copyButton = document.querySelector('#copy')
const qrbutton = document.querySelector('#qr-share')

const ui = new UI()

inputForm.addEventListener('submit', ui.showOutputForm);

shortenAgain.addEventListener('click', ui.showInputForm);

qrbutton.addEventListener('click', UI.getQRCode); 

myurls.addEventListener('click', ui.createSidebar)

myUrlsButton.addEventListener('click', ui.createSidebar)

copyButton.addEventListener('click', UI.copyToClipboard)