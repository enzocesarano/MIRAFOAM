class Product {
    constructor(_name, _description, _mainImageUrl, _relatedImages, _size, _catalog) {
        this.name = _name;
        this.description = _description;
        this.mainImageUrl = _mainImageUrl;
        this.relatedImages = _relatedImages; // Array di immagini in base64
        this.size = _size;
        this.catalog = _catalog;
    }
}

const nav = document.getElementById('nav');
const logoSvg = document.getElementById('logoSvg');
const cls2 = document.querySelectorAll('.cls-2');
const inputName = document.getElementById('inputName');
const inputDescription = document.getElementById('inputDescription');
const inputImage = document.getElementById('inputImage');
const inputImg = document.getElementById('inputImg');  // Modificato per selezionare l'input per immagini correlate
const inputSize = document.getElementById('inputSize');
const inputCatalog = document.getElementById('inputCatalog');
const formCard = document.getElementById('formCard');
const inputSearch = document.getElementById('inputSearch');
const rowDetails = document.getElementById('rowDetails');
let products = [];

// Cambiamenti di stile della navbar in base allo scroll
window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 100) {
        nav.style.background = 'white';
        nav.classList.remove('navbar-dark');
        inputSearch.classList.add('input-dark');
        cls2.forEach(element => {
            element.style.fill = '#343a40';
        });
        inputSearch.classList.add('inputBlack', 'bg-secondary');
        search.classList.add('btn-outline-dark');
    } else {
        nav.style.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))';
        cls2.forEach(element => {
            element.style.fill = 'white';
        });
        nav.classList.add('navbar-dark');
        inputSearch.classList.remove('inputBlack', 'bg-secondary');
        search.classList.remove('btn-outline-dark');
    }
});

const barParameters = new URLSearchParams(location.search).get('cardId');

if (barParameters) {
    fetch(`https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/${barParameters}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error');
            }
        })
        .then(product1 => {
            inputName.value = product1.name;
            inputDescription.value = product1.description;
            inputImage.value = product1.mainImageUrl;
            inputSize.value = product1.size;
            inputCatalog.value = product1.catalog;
            // Non c'è bisogno di gestire inputImg qui perché l'utente non ricarica le immagini in locale da MockAPI
        })
        .catch(error => {
            console.log('errore', error);
        });
}

formCard.addEventListener('submit', function (e) {
    e.preventDefault();

    const files = inputImg.files; // Recupera i file delle immagini correlate
    if (files.length > 0) {
        const base64Promises = Array.from(files).map(file => resizeAndConvertToBase64(file));
        Promise.all(base64Promises).then(base64Images => {
            const newProduct = new Product(
                inputName.value,
                inputDescription.value,
                inputImage.value,
                base64Images,
                inputSize.value,
                inputCatalog.value
            );

            let methodCustom;
            let urlCustom;

            if (barParameters) {
                urlCustom = `https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/${barParameters}`;
                methodCustom = 'PUT';
            } else {
                urlCustom = `https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/`;
                methodCustom = 'POST';
            }

            fetch(urlCustom, {
                method: methodCustom,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('error');
                    }
                })
                .then(product => {
                    console.log(product);
                    setInterval(() => {
                        location.assign(`./administrator.html`);
                    }, 200);
                })
                .catch(error => {
                    console.log('errore', error);
                });
        });
    }
});

function resizeAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const maxWidth = 400;
        const maxHeight = 400;
        const quality = 0.7;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    } else {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const base64String = canvas.toDataURL('image/jpeg', quality);
                resolve(base64String);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

fetch("https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/")
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('error');
        }
    })
    .then(product => {
        products = product;
        displayCard(product);
    })
    .catch(error => {
        console.log('errore', error);
    });

formSearch.addEventListener('submit', function (e) {
    e.preventDefault();
    const search = inputSearch.value;
    displayCard(products, search);
    formSearch.reset();
});

function displayCard(card, search = '') {
    rowDetails.innerHTML = '';
    card.forEach(element => {
        if (search === '' || element.name.toLowerCase().includes(search.toLowerCase())) {
            rowDetails.innerHTML +=
             `<div class="col mb-3 p-0">
                    <div class="row">
                        <div class="col-1 shadow-sm d-flex flex-row align-items-center p-2 bg-secondary text-light shadow">
                            <div class="w-100">
                                <img
                                src="${element.mainImageUrl}"
                                class="bd-placeholder-img card-img-top show w-100"/>
                            </div>
                        </div>    
                        <div class="col-8 d-flex flex-column justify-content-center px-4">
                            <h5 class="card-title fs-6">${element.name}</h5>
                            <p class="card-text text-truncate">${element.description}
                            </p>
                        </div>
                        <div class="col-2 text-end d-none d-md-flex flex-column justify-content-center">
                            <p class="card-title fs-6">${element.catalog}</p>
                            <p class="card-text fw-bold m-0">${element.size}</p>
                            <p class="card-text">${element.relatedImages.length} Immagini correlate</p>
                        </div>
                        <div class="col-1 d-flex flex-column justify-content-center px-0 flex-grow-1 flex-md-grow-0">
                            <button id="${element.id}" type="button" class="btn btn-info fs-supersmall mb-2 edit">Modifica</button>
                            <button data-id="${element.id}" type="button" class="btn btn-danger fs-supersmall deleteProduct" data-bs-toggle="modal" data-bs-target="#deleteModal">Elimina</button>
                        </div>
                    </div>
                </div>`;
        }
    });

    const edit = document.querySelectorAll('.edit');
    edit.forEach(element => {
        element.addEventListener('click', function () {
            const cardId = element.id;
            location.assign(`./administrator.html?cardId=${cardId}`);
        });
    });

    const btnDelete = document.getElementById('btnDelete');
    const deleteProduct = document.querySelectorAll('.deleteProduct');

    deleteProduct.forEach(element => {
        element.addEventListener('click', async function () {
            const cardId = element.dataset.id;
            btnDelete.addEventListener('click', function () {
                removeProduct(cardId);
            });
        });
    });
}

function removeProduct(card) {
    fetch(`https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/${card}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                alert('PRODOTTO ELIMINATO');
                location.assign('./administrator.html');
            } else {
                throw new Error('error');
            }
        })
        .catch(err => {
            console.log('error', err);
        });
}
