const nav = document.getElementById('nav');
const logoSvg = document.getElementById('logoSvg')
const cls2 = document.querySelectorAll('.cls-2')
const inputSearch = document.getElementById('inputSearch')
const search = document.getElementById('search')
const imgProduct = document.getElementById('imgProduct')
const textDescription = document.getElementById('textDescription')
const imgCorrelate = document.getElementById('imgCorrelate')

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




const barParameters = new URLSearchParams(location.search).get('cardId');

fetch(`https://66b73b1e7f7b1c6d8f1b4adf.mockapi.io/api/product/${barParameters}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error');
            }
        })
        .then(product1 => {
            imgProduct.innerHTML = `
                    <div class="w-100">
                        <img src="${product1.mainImageUrl}" alt="" class="w-100">
                    </div>`
            
            textDescription.innerHTML = `
                    <h1>${product1.name}</h1>
                    <p class="flex-grow-1">${product1.description}</p>
                    <spam class="text-end text-secondary">Misura: ${product1.size}</spam>`

            product1.relatedImages.forEach(element => {
                imgCorrelate.innerHTML += `
                    <div class="col">
                        <div class"w-100">
                            <img src="${element}" class="w-100"/>
                        </div>
                    </div>
                `
            })

        })
        .catch(error => {
            console.log('errore', error);
        });
