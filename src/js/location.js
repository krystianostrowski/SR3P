function border(){
    let cas = document.getElementById("case");
    let sch = document.getElementById("location");

   
    cas.style.boxShadow = "0px 0px 5px 5px rgb(143, 143, 143)";
    cas.style.borderRadius = "30px";

   
}
function closeBorder(){
    let cas = document.getElementById("case");
    let sch = document.getElementById("location");
    cas.style.boxShadow = "none"
    
}

function search(){
    
    const searchInput = document.querySelector("input");
    const li = [...document.querySelectorAll("ul li")];
    const ul = document.querySelector("ul");
    const searchWord = e => {
        const currentWord = e.target.value.toUpperCase();
        let result = li;
        result = result.filter(li => li.textContent.toUpperCase().includes(currentWord));
        ul.textContent = '';
        result.forEach( place => ul.appendChild(place));

    }
    searchInput.addEventListener('input', searchWord);

    
    const adress = document.getElementById("adresses");
    adress.style.display = "block";
    ul.style.display =  "block";

}

function closeSearch(){
    const adress = document.getElementById("adresses");
    adress.style.display = "none";
   
}