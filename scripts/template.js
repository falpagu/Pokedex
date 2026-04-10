function getPokemonsTemplate(pokemon){
    return`
            <div class="pokeCard">
                <div class="nameContainer">
                    <p>#${pokemon.id}</p>
                    <h3>${pokemon.name}</h3>
                </div>
                <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.id}" alt="">
                <button><img src="./assets/icon_logos/search_icon_white.svg"></button>
          </div>
       
    `;
}