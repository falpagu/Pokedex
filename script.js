
function init(){

    loadPokemons();
}


const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";


async function loadPokemons() {
    
    let response = await fetch(BASE_URL);
    let data = await response.json();

    renderPokemons(data);
}


function renderPokemons(data) {
    let contentref = document.getElementById("content");

    let html = "";

    for (let i = 0; i < data.results.length; i++) {

        let pokemon = data.results[i];
        html += getPokemonsTemplate(pokemon);  
  
     } 
       contentref.innerHTML = html;
}