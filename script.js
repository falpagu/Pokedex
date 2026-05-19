let allPokemon = [];
let filteredPokemon = [];
let currentIndex = 0;
let popUp = document.getElementById("popUp");

function init() {
  loadPokemon();
}

let offset = 0;
let limit = 24;

async function loadPokemon() {
  
  showLoading(true);
  let data = await fetchPokemonList();
  let pokemonData = await loadAllPokemonDetails(data.results);

  allPokemon.push(...pokemonData);

  renderPokemon();

  offset += limit;

  showLoading(false);
  
}

async function fetchPokemonList() {
  let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  let response = await fetch(BASE_URL);

  return await response.json();
}

async function loadAllPokemonDetails(pokemonList) {
  
  let pokemonPromises = [];

  for (let i = 0; i < pokemonList.length; i++) {
    let pokemon = pokemonList[i];
    let promise = loadPokemonDetails(pokemon.url);

    pokemonPromises.push(promise);
  }
  return await Promise.all(pokemonPromises);
}

async function loadPokemonDetails(url) {
  
  let response = await fetch(url);
  let details = await response.json();

  return {
    id: details.id,
    name: details.name,
    image: details.sprites.front_default,
    types: details.types,
    height: details.height,
    weight: details.weight,
    abilities: details.abilities,
    base_experience: details.base_experience,
    stats: details.stats,
    species: details.species
  };
}

function showLoading(isLoading) {
  
  document.getElementById("moreBtn").disabled = isLoading;
  document.getElementById("spinner").style.display = isLoading ? "flex" : "none";
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

    statsHTML += getStatsTemplate(label, value);
  }
  return statsHTML;
}

function renderPokemon() {
  let contentRef = document.getElementById("content");

  let html = "";

  for (let i = 0; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];
    let color = getPokemonColor(pokemon);
    html += getPokemonTemplate(pokemon, color);
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

  const path = "./assets/icon_logos/";

  const icons = {
    normal: `${path}normal.svg`,
    fire: `${path}fire.svg`,
    water: `${path}water.svg`,
    electric: `${path}electric.svg`,
    grass: `${path}grass.svg`,
    ice: `${path}ice.svg`,
    fighting: `${path}fighting.svg`,
    poison: `${path}poison.svg`,
    ground: `${path}ground.svg`,
    flying: `${path}flying.svg`,
    psychic: `${path}psychic.svg`,
    bug: `${path}bug.svg`,
    rock: `${path}rock.svg`,
    ghost: `${path}ghost.svg`,
    dragon: `${path}dragon.svg`,
    dark: `${path}dark.svg`,
    steel: `${path}steel.svg`,
    fairy: `${path}fairy.svg`,
  };

  return icons[type] || `${path}default.svg`;
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

function disabledMorePoke(input) {
  document.getElementById("moreBtn").disabled = input.length > 0;
}

document.getElementById("searchInput").addEventListener("input", searchPokemon);

function searchPokemon() {
  
  let input = document.getElementById("searchInput").value.toLowerCase();
  let content = document.getElementById("content");
  
  disabledMorePoke(input);

  let html = "";

  filteredPokemon = [];

  for (let i = 0; i < allPokemon.length; i++) {
    let pokemon = allPokemon[i];

    if (pokemon.name.toLowerCase().includes(input)) {
      filteredPokemon.push(pokemon);
      let color = getPokemonColor(pokemon);
      html += getPokemonTemplate(pokemon, color);
    }
  }
  content.innerHTML = html;
}

function getPokemonColor(pokemon) {
  let mainType = pokemon.types[0].type.name;

  return getTypeColor(mainType);
  
}

async function openPopUp(id) {

  let currentList = filteredPokemon.length > 0 ? filteredPokemon : allPokemon;

  let pokemon = currentList.find((p) => p.id === id);

  currentIndex = currentList.findIndex((p) => p.id === id);

  let color = getPokemonColor(pokemon);

  popUp.innerHTML = getDialogTemplate(pokemon, color);

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
      html += getEvosTemplate(evoPokemon);

      if (i < evolutions.length - 1) {
        html += `<img class="evoArrow" src="./assets/icon_logos/arrow_double.svg" alt="arrow left"/>`;
      } 
    }
  }
  container.innerHTML = html;
}

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

function changePokemon(direction) {
  let currentList = filteredPokemon.length > 0
  ? filteredPokemon
  : allPokemon;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = currentList.length - 1;

  } if (currentIndex >= currentList.length) {
    currentIndex = 0;
  }
  openPopUp(currentList[currentIndex].id);
}

function handleKeyDown(e) {

  if (e.key === "ArrowLeft") {
    changePokemon(-1);
  } else if (e.key === "ArrowRight") {
    changePokemon(1);
  }
}

popUp.addEventListener("keydown", handleKeyDown);

