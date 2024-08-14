const nav = document.getElementById('nav');
const logoSvg = document.getElementById('logoSvg')
const cls2 = document.querySelectorAll('.cls-2')
const inputSearch = document.getElementById('inputSearch')
const search = document.getElementById('search')

window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 100) {
        nav.style.background = 'white';
        nav.classList.remove('navbar-dark')
        inputSearch.classList.add('input-dark')
        cls2.forEach(element => {
            element.style.fill = '#343a40'
        })
        inputSearch.classList.add('inputBlack', 'bg-secondary')
        search.classList.add('btn-outline-dark')
    } else {
        nav.style.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)';
        cls2.forEach(element => {
            element.style.fill = 'white'
        })
        nav.classList.add('navbar-dark')
        inputSearch.classList.remove('inputBlack', 'bg-secondary')
        search.classList.remove('btn-outline-dark')
    }
});








const categories = document.getElementById('categories')
const items = document.getElementById('items')


fetch('https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product')
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('error');
        }
    })
    .then((product) => {
        console.log(product);

        const uniqueCategories = new Set();

        product.forEach(element => {
            items.innerHTML += `
                <div class="col-12 p-3">
                    <div class="row h-100 border border-1 rounded-2 p-2 pointer details" data-id="${element.id}">
                        <div class="col-12 p-2">
                            <img src="${element.mainImageUrl}" class="w-100" alt="${element.name}">
                        </div>
                        <div class="col-12 d-flex flex-column" style="height: 100px;">
                            <h5 class="fs-6">${element.name}</h5>
                            <p class="fs-small truncate-3-lines">${element.description}</p>
                        </div>
                        <div class="col d-flex flex-column">
                            <small class="text-muted fs-supersmall">Size: <span>${element.size}</span></small>
                        </div>
                    </div>
                </div>
            `;

            uniqueCategories.add(element.catalog);

            const details = document.querySelectorAll('.details');
            details.forEach(element => {
                element.addEventListener('click', function () {
                    const cardId = element.getAttribute('data-id');
                    location.assign(`./details.html?cardId=${cardId}`);
                });
            });


        });

        uniqueCategories.forEach(category => {
            categories.innerHTML += `
                <li class="list-unstyled pointerList" data-item="${category}">${category}</li>
            `;
        });

        const catalogo = document.querySelectorAll('.pointerList');

        catalogo.forEach(element => {
            element.addEventListener('click', function () {
                const selectedCategory = element.getAttribute('data-item');

                items.innerHTML = '';

                product.forEach(item => {
                    if (item.catalog === selectedCategory) {
                        items.innerHTML += `
                            <div class="col-12 p-3">
                                <div class="row h-100 border border-1 rounded-2 p-2 pointer" data-id="${item.id}>
                                    <div class="col-12 p-2">
                                        <img src="${item.mainImageUrl}" class="w-100" alt="${item.name}">
                                    </div>
                                    <div class="col-12 d-flex flex-column" style="height: 100px;">
                                        <h5 class="fs-6">${item.name}</h5>
                                        <p class="fs-small truncate-3-lines">${item.description}</p>
                                    </div>
                                    <div class="col d-flex flex-column">
                                        <small class="text-muted fs-supersmall">Size: <span>${item.size}</span></small>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });
            });
        });
    })

    .catch(error => {
        console.error('Error:', error);
    });
