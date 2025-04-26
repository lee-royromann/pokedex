let offset = 0;
let limit = 100;
let totalPokemonCount = 0;
let currentPokemonCount = 0;
let pokemonData = []; // url + name
let pokemonInfos = []; // abilities etc.

function init() {
    fetchPokemonList();
}

async function fetchPokemonList() {
    showLoadingOverlay();
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);        
        pokemonData = await response.json();        
        updatePokemonCounterTotal(pokemonData.count);
        await loadPokemonInformations();       
    } catch (error) {
        console.error(error);
    }
}

async function loadPokemonInformations() {
    let urls = [];
    let newLoadedPokemons = [];
    for (let i = 0; i < pokemonData.results.length; i++) {
        urls.push(pokemonData.results[i].url);
    }
    newLoadedPokemons = await fetchPokemonDetails(urls);
    pokemonInfos.push(...newLoadedPokemons);
    updateOffset();
    updatePokemonCounterCurrent();
    renderPokemons(newLoadedPokemons);
}

function updateOffset() {
    if (offset < pokemonData.count) {
        if ((pokemonData.count - offset) < limit) {
            limit = pokemonData.count - offset;
        }
        offset += limit;
    }
}

async function fetchPokemonDetails(urls) {
    const fetchedPromises = fetchPromises(urls);
    const loadedPokemons = await resolveResponses(fetchedPromises);
    return loadedPokemons;
}

function fetchPromises(urls) {
    const fetchedPromises = [];
    for (let i = 0; i < urls.length; i++) {
        fetchedPromises.push(fetch(urls[i]));
    }
    return fetchedPromises;
}

async function resolveResponses(promises) {
    const responses = await Promise.all(promises);
    const loadedPokemons = [];
    for (let i = 0; i < responses.length; i++) {
        const pokemon = await responses[i].json();
        pokemon.types = pokemon.types.map(t => t.type.name);
        loadedPokemons.push(pokemon);
    }
    return loadedPokemons;
}

function renderPokemons(newLoadedPokemons) {
    let containerRef = document.getElementById('main__container');
    let pokemonCards = newLoadedPokemons.map(getCardTemplate).join('');
    containerRef.innerHTML += pokemonCards;
    hideLoadingOverlay();
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function togglePokemonTypeAppearance(type, id, selection) {
    let icon = document.getElementById(`card__type-${id}-${type}`);
    let name = document.getElementById(`card__name-${id}-${type}`);
    name.classList.toggle("d_none");
    icon.classList.toggle("d_none");
}

function getPokemonAbilities(pokemon) {
    return pokemon.abilities.map(ability => `
        ${ability.ability.name}
    `).join('');
}

function getHeighInMeters(height) {
    return (height / 10).toFixed(1);
}

function getWeightInKg(weight) {
    return (weight / 10).toFixed(1);
}

function showPokemonDetails(id) {
    let modalTemplate = getModalTemplate(pokemonInfos[id-1]);
    document.querySelector(".modal__overlay").innerHTML = modalTemplate;
    loadPokemonStats(id, "stats");
    document.querySelector(".modal__overlay").classList.remove("d_none");
    document.body.classList.add("overflow-hidden");
    showModal();
}

function loadPokemonInfos(id, selectedTab) {
    setActivePokemonTab(selectedTab);
    let container = document.getElementById('modal__data-container');
    container.innerHTML = "";
    container.innerHTML = getPokemonInfoTemplate(pokemonInfos[id-1]);
}

function loadPokemonStats(id, selectedTab) {
    setActivePokemonTab(selectedTab);
    let container = document.getElementById('modal__data-container');
    container.innerHTML = "";
    container.innerHTML = getPokemonStatsTemplate(pokemonInfos[id-1]);
    for (let i = 0; i < pokemonInfos[id-1].stats.length; i++) {
        const stat = pokemonInfos[id-1].stats[i];
    }
};

async function loadPokemonEvoChain(pokemonId, activeTabName) {
    setActivePokemonTab(activeTabName);
    let container = document.getElementById('modal__data-container');
    container.innerHTML = getLoadingSpinnerTemplate();
    let evolutionChainNames = await fetchEvolutionChain(pokemonId)
    let pokeData = await fetchEvolutionChainImages(evolutionChainNames);
    renderEvoChainImages(pokeData);
}

async function fetchEvolutionChain(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const speciesData = await speciesResponse.json();
        const evoResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evoResponse.json();
        const evolutionNames = extractEvolutionNames(evolutionData.chain);
        return evolutionNames;
    } catch (error) {
        console.log("Failed to load the evolution chain names!", error);
        return [];
    }
}

function extractEvolutionNames(chain) {
    const evolutionNames = [];
    let currentStage = chain;
    while (currentStage) {
        const name = currentStage.species.name;
        evolutionNames.push(name);
        if (currentStage.evolves_to.length > 0) {
            currentStage = currentStage.evolves_to[0];
        } else {
            currentStage = null;
        }
    }
    return evolutionNames;
}

async function fetchEvolutionChainImages(evolutionNames) {
    let pokemons = [];
    for (let i = 0; i < evolutionNames.length; i++) {
        const name = evolutionNames[i];
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
        const pokemonData = await response.json();
        pokemons.push(pokemonData);
    }
    return pokemons;
}

function renderEvoChainImages(pokeData) {
    let container = document.getElementById('modal__data-container');
    container.innerHTML = "";
    let imageContainer = document.createElement('div');
    imageContainer.classList.add('modal__evolution');
    for (let i = 0; i < pokeData.length; i++) {
        const pokemon = pokeData[i];
        const img = document.createElement('img');
        img.src = pokemon.sprites.other.dream_world.front_default;
        img.alt = pokemon.name;
        imageContainer.appendChild(img);
    }
    container.appendChild(imageContainer);
}

function setActivePokemonTab(selectedTab) {
    const allTabs = ["infos", "stats", "evo"];
    for (let i = 0; i < allTabs.length; i++) {
        const tabName = allTabs[i];
        const elementId = `modal__selector-${tabName}`;
        const element = document.getElementById(elementId);
        if (element) {
            if (tabName === selectedTab) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }
        }
    }
}

function updatePokemonCounterTotal(total) {
    document.getElementById('header__counter--total').innerHTML = total;
}

function updatePokemonCounterCurrent() {
    currentPokemonCount = offset;
    document.getElementById('header__counter--loaded').innerHTML = offset;
}

function showLoadingOverlay() {
    document.getElementById("overlay__spinner").classList.remove("d_none");
    document.body.classList.add("overflow-hidden");
}

function hideLoadingOverlay() {
    document.getElementById("overlay__spinner").classList.add("d_none");
    document.body.classList.remove("overflow-hidden");
}

function showModal() {
    document.querySelector(".modal__overlay").classList.remove("d_none");
    document.body.classList.add("overflow-hidden");
}

function closeModal() {
    document.querySelector(".modal__overlay").classList.add("d_none");
    document.body.classList.remove("overflow-hidden");
}

function skipToNextPokemon(direction, pokemonId) {
    console.log(direction);
    console.log(pokemonId);
    updateModalContent(pokemonId);
}