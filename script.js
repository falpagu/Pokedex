let allPokemon = [];

let currentIndex = 0;

function init() {
  loadPokemon();
}

let offset = 0;
let limit = 24;


async function loadPokemon() {
  let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  document.getElementById("spinner").style.display = "flex";
  let response = await fetch(BASE_URL);
  let data = await response.json();

  await renderPokemonDetails(data);

  renderPokemon();
  document.getElementById("spinner").style.display = "none";
  offset += limit;
}

async function renderPokemonDetails(data) {
  for (let i = 0; i < data.results.length; i++) {
    let pokemon = data.results[i];

    let pokemonDetails = await fetch(pokemon.url);
    let pokemonDetailInfo = await pokemonDetails.json();

    allPokemon.push(pokemonDetailInfo);
  }
}

function getAbilities(pokemon) {
  let abilitiesText = "";

  for (let i = 0; i < pokemon.abilities.length; i++) {
    abilitiesText += pokemon.abilities[i].ability.name;

    if (i < pokemon.abilities.length - 1) {
      abilitiesText += ", ";
    }
  }
  return abilitiesText;
}

function getStats(pokemon) {
  let statsHTML = "";

  for (let i = 0; i < pokemon.stats.length; i++) {
    let statInfo = pokemon.stats[i];

    let label = firstLetterUpperCase(statInfo.stat.name).replace(":", "");
    let value = statInfo.base_stat;

    statsHTML += `
    <div class="stat-row">
      <span class="label">${label}</span>
      <div class="bar">
          <div class="fill" style="width: ${value}%"></div>
      </div> 
     
    </div>
    `;
  }
  return statsHTML;
}

function renderPokemon() {
  let contentRef = document.getElementById("content");

  let html = "";

  for (let i = 0; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];
    html += getPokemonTemplate(pokemon);
  }
  contentRef.innerHTML = html;
}

function firstLetterUpperCase(name) {
  if (name === "hp") return "HP";
  return name[0].toUpperCase() + name.slice(1);
}

function getTypeColor(type) {
  const colours = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  return colours[type] || "#ccc";
}

function getTypeIcon(type) {
  const icons = {
    normal: "./assets/icon_logos/normal.svg",
    fire: "./assets/icon_logos/fire.svg",
    water: "./assets/icon_logos/water.svg",
    electric: "./assets/icon_logos/electric.svg",
    grass: "./assets/icon_logos/grass.svg",
    ice: "./assets/icon_logos/ice.svg",
    fighting: "./assets/icon_logos/fighting.svg",
    poison: "./assets/icon_logos/poison.svg",
    ground: "./assets/icon_logos/ground.svg",
    flying: "./assets/icon_logos/flying.svg",
    psychic: "./assets/icon_logos/psychic.svg",
    bug: "./assets/icon_logos/bug.svg",
    rock: "./assets/icon_logos/rock.svg",
    ghost: "./assets/icon_logos/ghost.svg",
    dragon: "./assets/icon_logos/dragon.svg",
    dark: "./assets/icon_logos/dark.svg",
    steel: "./assets/icon_logos/steel.svg",
    fairy: "./assets/icon_logos/fairy.svg",
  };

  return icons[type] || "icons/default.svg";
}

function renderTypes(pokemon) {
  let html = "";

  for (let i = 0; i < pokemon.types.length; i++) {
    let type = pokemon.types[i].type.name;
    let icon = getTypeIcon(type);
    let color = getTypeColor(type);

    html += `
      <img class="icon" style="background-color: ${color}" src="${icon}" alt="${type}">
    `;
  }
  return html;
}

document.getElementById("searchInput").addEventListener("input", searchPokemon);

function searchPokemon() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let content = document.getElementById("content");

  let html = "";

  for (let i = 0; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];

    if (pokemon.name.toLowerCase().includes(input)) {
      html += getPokemonTemplate(pokemon);
    }
  }
  content.innerHTML = html;
}

async function openPopUp(id) {
  let pokemon = allPokemon.find((p) => p.id === id);

  currentIndex = allPokemon.findIndex((p) => p.id === id);

  let popUp = document.getElementById("popUp");
  popUp.innerHTML = getDialogTemplate(pokemon);

  popUp.showModal();
  popUp.focus();

  await loadEvolutionChain(pokemon);
}

async function loadEvolutionChain(pokemon) {
  let speciesResponse = await fetch(pokemon.species.url);
  let speciesData = await speciesResponse.json();

  let evolutionResponse = await fetch(speciesData.evolution_chain.url);
  let evolutionData = await evolutionResponse.json();

  let evolutions = [];

  getEvolutionNames(evolutionData.chain, evolutions);
  renderEvolutionChain(evolutions);
}

function getEvolutionNames(chain, evolutions) {
  evolutions.push(chain.species.name);

  if (chain.evolves_to.length > 0) {
    getEvolutionNames(chain.evolves_to[0], evolutions);
  }
}

function renderEvolutionChain(evolutions) {
  
  let container = document.querySelector(".evolutionContainer");

  let html = "";

  for (let i = 0; i < evolutions.length; i++) {
    let evoPokemon = allPokemon.find((p) => p.name === evolutions[i]);

    if (evoPokemon) {
      html += getEvosTemplate(evoPokemon, i, evolutions);
    }
  }
  container.innerHTML = html;
}

let popUp = document.getElementById("popUp");

popUp.addEventListener("click", (event) => {
  if (event.target === popUp) {
    popUp.close();
  }
});

function selectTabs(index) {
  let popUp = document.getElementById("popUp");

  let tabs = popUp.querySelectorAll(".tab");
  let infos = popUp.querySelectorAll(".info");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  for (let i = 0; i < infos.length; i++) {
    infos[i].classList.remove("active");
  }

  tabs[index].classList.add("active");
  infos[index].classList.add("active");
}

function arrowLeftBtn() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = allPokemon.length - 1;
  }
  openPopUp(allPokemon[currentIndex].id);
}

function arrowRightBtn() {
  if (currentIndex < allPokemon.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  openPopUp(allPokemon[currentIndex].id);
}

popUp.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    arrowLeftBtn();
  } else if (e.key === "ArrowRight") {
    arrowRightBtn();
  }
});
