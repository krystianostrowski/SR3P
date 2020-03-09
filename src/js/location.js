const searchBar = document.querySelector('#location');
const locationsList = document.querySelector('ul');
const locations = locationsList.querySelectorAll('li');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');

const locationHiddenClass = 'location--hidden';
const locationVisibleClass = 'location--visible';

const SwitchShadow = () => {
    shadow.classList.toggle('shadow--active');
    adressesWrapper.style.display = "block";
    locationsList.style.display =  "block";
};

const OnLocationClicked = e => {
    searchBar.value = e.target.textContent;
};

const OnSearchBarInput = e => {
    const input = e.target.value.toLowerCase();

    locations.forEach(location => {
        const locationText = location.textContent.toLocaleLowerCase();

        if(!locationText.includes(input))
        {
            if(location.classList.contains(locationVisibleClass))
            {
                location.classList.remove(locationVisibleClass);
            }

            location.classList.add(locationHiddenClass);
        }
        else if(locationText.includes(input))
        {
            if(location.classList.contains(locationHiddenClass))
            {
                location.classList.remove(locationHiddenClass);
            }

            location.classList.add(locationVisibleClass);
        }
    });
};

searchBar.addEventListener('blur', SwitchShadow);
searchBar.addEventListener('focus', SwitchShadow);
searchBar.addEventListener('input', OnSearchBarInput);

locationsList.addEventListener('click', OnLocationClicked);

