function getPokemonTemplate(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let color = getTypeColor(mainType);

  return `
            <button class="pokeCard" onclick="openPopUp(${pokemon.id})">
                <div class="nameContainer">
                    <p class="pokeTitle">#${pokemon.id}</p>
                    <h3 class="pokeTitle">${firstLetterUpperCase(pokemon.name)}</h3>
                </div>
                <div class="imageBg" style="background-color: ${color}"> 
                    <img class="pokeImg" src="${pokemon.sprites.front_default}" alt="${firstLetterUpperCase(pokemon.name)}">
                </div>
                <div>${renderTypes(pokemon)}</div>
          </button> 
    `;
}

function getDialogTemplate(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let color = getTypeColor(mainType);

  return `
        <div class="popUpCard">  

            <div class="nameContainer">
              <p class="popUpTitle">#${pokemon.id}</p>
              <h3 class="popUpTitle">${firstLetterUpperCase(pokemon.name)}</h3>
            </div>
            <div class="popUpImageBg" style="background-color: ${color}"> 
              <img class="pokePopUpImg" src="${pokemon.sprites.front_default}" alt="${firstLetterUpperCase(pokemon.name)}">
            </div>
            <div>${renderTypes(pokemon)}</div>
    
            <div class="pokeInfos">
            
                <div class="tabs">
                    <button onclick="selectTabs(0)" class="tab active">main</button>
                    <button onclick="selectTabs(1)" class="tab">stats</button>
                    <button onclick="selectTabs(2)" class="tab">evo chain</button>
                </div>
            
                <ul class="info active">
                    <li><span class="label">Height</span><span class="value">: ${pokemon.height} m</span></li>
                    <li><span class="label">Weight</span><span class="value">: ${pokemon.weight} kg</span></li>
                    <li><span class="label">Abilities</span><span class="value">: ${getAbilities(pokemon)}</span></li>
                    <li><span class="label">Base experience</span><span class="value">: ${pokemon.base_experience}</span></li>
                </ul>

                <ul class="info">
                     ${getStats(pokemon)}
                </ul>

                <ul class="info evolutionContainer">
                    
                </ul>
            </div>

            <div class="arrows" id="arrows">
              <button id="arrowLeft" onclick="arrowLeftBtn()">
                <img src="./assets/icon_logos/pfeil-links.png" alt="arrow left" />
              </button>
              <button id="arrowRight" onclick="arrowRightBtn()">
                <img src="./assets/icon_logos/pfeil-right.png" alt="arrow right" />
              </button>
            </div>

        </div> 
    `;
}

function getEvosTemplate(evoPokemon, i, evolutions) {

  let html = `
        <div class="evoCard">
          <img class="evoImg"
            src="${evoPokemon.sprites.front_default}"
            alt="${evoPokemon.name}">
          <p> ${firstLetterUpperCase(evoPokemon.name)}</p>
        </div>
      `;
        if (i < evolutions.length - 1) {
        html += `<img class="evoArrow" src="./assets/icon_logos/arrow_double.svg" alt="arrow left"/>`;
    }
    return html;
}
