const confirmBtn = document.querySelector('#arrival-confirmation');
const homeBtn = document.querySelector('.home');
const searchBtn = document.querySelector('#service-search-button');
const finishButton = document.querySelector('#finish');

if(confirmBtn != null)
{
    confirmBtn.addEventListener('click', () => {
        ipcRenderer.send('service-reached-destination');
    });
}

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked');
    });
}

if(searchBtn != null)
{
    searchBtn.addEventListener('click', () => {
        const input = document.querySelector('.search__input');
        searchBtn.classList.toggle('search__button--active');
        searchBtn.classList.toggle('search__button--inactive');
        input.classList.toggle('search__input--visible');
    });
}

if(finishButton != null)
{
    finishButton.addEventListener('click', () => {
        ipcRenderer.send('close-report');
    });
}