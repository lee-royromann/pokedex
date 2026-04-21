let offset = 0;
let limit = 30;
let currentPokemonCount = 0;
let pokemonData = [];
let pokemonInfos = [];

function init() {
    fetchPokemonList();
    setupSearch();
}

async function fetchPokemonList() {
    toggleOverlay('#overlay__spinner', true);
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

function updateOffset() {
    if (offset < pokemonData.count) {
        if ((pokemonData.count - offset) < limit) {
            limit = pokemonData.count - offset;
        }
        offset += limit;
    }
}

function renderPokemons(newLoadedPokemons) {
    let containerRef = document.getElementById('main__container');
    let pokemonCards = newLoadedPokemons.map(getCardTemplate).join('');
    containerRef.innerHTML += pokemonCards;
    toggleOverlay('#overlay__spinner', false);
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function updateCounter(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = value;
    } else {
        console.warn(`Counter element '${selector}' not found.`);
    }
}

function updatePokemonCounterTotal(total) {
    updateCounter('#header__counter--total', total);
}

function updatePokemonCounterCurrent() {
    currentPokemonCount = offset;
    updateCounter('#header__counter--loaded', offset);
}

function toggleOverlay(selector, show) {
    const overlay = document.querySelector(selector);
    if (!overlay) return;

    overlay.classList.toggle('d_none', !show);
    document.body.classList.toggle('overflow-hidden', show);
}

function hideLoadingOverlay() {
    toggleOverlay('#overlay__spinner', false);
}

function deleteSearchInput() {
    const searchInput = document.querySelector('.header__search input');
    searchInput.value = '';
    showAllCards();
}