function getPokemonTemplate(pokemon, color) {

  return `
            <button class="pokeCard" onclick="openPopUp(${pokemon.id})">
                <div class="nameContainer">
                    <p class="pokeTitle">#${pokemon.id}</p>
                    <h3 class="pokeTitle">${firstLetterUpperCase(pokemon.name)}</h3>
                </div>
                <div class="imageBg" style="background-color: ${color}"> 
                  <img class="pokeImg" src="${pokemon.image}" alt="${firstLetterUpperCase(pokemon.name)}">
                </div>
                <div>${renderTypes(pokemon)}</div>
          </button> 
    `;
}

function getDialogTemplate(pokemon, color) {
  return `
        <div class="popUpCard">  

            <div class="nameContainer">
              <p class="popUpTitle">#${pokemon.id}</p>
              <h3 class="popUpTitle">${firstLetterUpperCase(pokemon.name)}</h3>
            </div>
            <div class="popUpImageBg" style="background-color: ${color}"> 
              <img class="pokePopUpImg" src="${pokemon.image}" alt="${firstLetterUpperCase(pokemon.name)}">
            </div>
            <div>${renderTypes(pokemon)}</div>
    
            <div class="pokeInfos">
            
                <div class="tabs">
                    <button onclick="selectTabs(0)" class="tab active">main</button>
                    <button onclick="selectTabs(1)" class="tab">stats</button>
                    <button onclick="selectTabs(2)" class="tab">evo chain</button>
                </div>
            
                <div class="info active">
                    <li><span class="label">Height</span><span class="value">: ${pokemon.height} m</span></li>
                    <li><span class="label">Weight</span><span class="value">: ${pokemon.weight} kg</span></li>
                    <li><span class="label">Abilities</span><span class="value">: ${getAbilities(pokemon)}</span></li>
                    <li><span class="label">Base experience</span><span class="value">: ${pokemon.base_experience}</span></li>
                </div>

                <div class="info">
                     ${getStats(pokemon)}
                </div>

                <div class="info evolutionContainer">
                    
                </div>
            </div>

            <div class="arrows" id="arrows">
              <button id="arrowLeft" onclick="changePokemon(-1)">
                <img src="./assets/icon_logos/pfeil-links.png" alt="arrow left" />
              </button>
              <button id="arrowRight" onclick="changePokemon(1)">
                <img src="./assets/icon_logos/pfeil-right.png" alt="arrow right" />
              </button>
            </div>
        </div> 
    `;
}

function getStatsTemplate(label, value) {
 return `
    <div class="stat-row">
      <span class="label">${label}</span>
      <div class="bar">
        <div class="fill" style="width: ${value}%"></div>
      </div> 
    </div>
  `;
}

function getEvosTemplate(evoPokemon) {
  return `
    <div class="evoCard">
      <img class="evoImg"
        src="${evoPokemon.image}"
        alt="${evoPokemon.name}">
      <p> ${firstLetterUpperCase(evoPokemon.name)}</p>
    </div>
  `;
        
     
}




