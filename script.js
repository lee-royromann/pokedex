let offset = 0;
let limit = 12;
let totalPokemonCount = 0;
let pokemonData = []; // url + name

function init() {
    getPokemonURLs();
}

async function getPokemonURLs() {
    showLoadingOverlay();
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);        
        pokemonData = await response.json();
    } catch (error) {
        console.error(error);
    }
    finally {
        hideLoadingOverlay();
        console.log(pokemonData);
    }
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