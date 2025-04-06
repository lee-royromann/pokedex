let offset = 0;
let limit = 12;
let totalPokemonCount = 0;
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
        await loadPokemonDetails();       
    } catch (error) {
        console.error(error);
    }
}

async function loadPokemonDetails() {
    const urls = [];
    for (let i = 0; i < pokemonData.results.length; i++) {
        urls.push(pokemonData.results[i].url);
    }
    const newLoadedPokemons = await fetchPokemonDetails(urls);
    pokemonInfos.push(...newLoadedPokemons);
    offset += limit;
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

function renderPokemons(newLoadedPokemons) {
    let containerRef = document.getElementById('main__container');
    let pokemonCards = newLoadedPokemons.map(getCardTemplate).join('');
    containerRef.innerHTML += pokemonCards;
    hideLoadingOverlay();
}

function getCardTemplate(pokemon) {
    const capitalizedPokemonName = capitalizeName(pokemon.name);
    const pokemonTypes = getPokemonTypes(pokemon.types);    
    const pokemonImage = getPokemonImage(pokemon);
    return `
        <div class="card" onclick="showPokemonDetails(${pokemon.id})">
            <span class="card__title">#${pokemon.id} ${capitalizedPokemonName}</span>
            ${pokemonImage}
            <div class="card__types">
                ${pokemonTypes}
            </div>
        </div>
    `;
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getPokemonTypes(types) {
    return types.map(type => `
        <div class="card__types--type bg-${type}">
            <img class="card__types--icon" src="./assets/icons/${type}.svg">
        </div>
    `).join('');
}

function getPokemonImage(pokemon) {
    return `
        <img class="card__image bg-${pokemon.types[0]}" 
            src="${pokemon.sprites.other.dream_world.front_default}" 
            alt="${pokemon.name}"
        >
    `;
}

function showPokemonDetails(id) {
    console.log(pokemonInfos[id-1]);
    showModal();
}

function updatePokemonCounterTotal(total) {
    document.getElementById('header__counter--total').innerHTML = total;
}

function updatePokemonCounterCurrent() {
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

function skipToNextPokemon(direction) {
    console.log(direction);
}