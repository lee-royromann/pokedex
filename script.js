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
    hideLoadingOverlay();
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
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

function deleteSearchInput() {
    const searchInput = document.querySelector('.header__search input');
    searchInput.value = '';
    showAllCards();
}