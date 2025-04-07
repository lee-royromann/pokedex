let offset = 0;
let limit = 12;
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
    return `
        <div class="card" onclick="showPokemonDetails(${pokemon.id})">
            <span class="card__title">#${pokemon.id} ${capitalizeName(pokemon.name)}</span>
            ${getPokemonImage(pokemon)}
            <div class="card__types">
                ${getPokemonTypes(pokemon.types)}
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
    console.log(pokemonInfos[id-1]);
    let modalTemplate = getModalTemplate(pokemonInfos[id-1]);
    document.querySelector(".modal__overlay").innerHTML = modalTemplate;
    document.querySelector(".modal__overlay").classList.remove("d_none");
    document.body.classList.add("overflow-hidden");
    showModal();
}

function getPokemonInfos(id, selectedTab) {
    setActivePokemonTab(selectedTab);
    console.log(id);    
}

function getPokemonStats(id, selectedTab) {
    setActivePokemonTab(selectedTab);
    console.log(id);
};

async function getPokemonEvoChain(pokemonId, activeTabName) {
    setActivePokemonTab(activeTabName);
    try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const speciesData = await speciesRes.json();
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evoRes.json();
        const evolutionNames = extractEvolutionNames(evolutionData.chain);
        return evolutionNames;
    } catch (error) {
        console.log("Fehler beim Laden der Entwicklungskette:", error);
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
    console.log("Evolution Names:", evolutionNames);
    return evolutionNames;
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

function getModalTemplate(pokemon) {
    return `
            <div class="modal" onclick="event.stopPropagation()">
            <div class="modal__header">
                <span class="modal__id">#${pokemon.id} - ${capitalizeName(pokemon.name)}</span>
                <i class="bi bi-x modal__close" onclick="closeModal()"></i>
            </div>
            <div class="modal__image bg-${pokemon.types[0]}">
                <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${name}">
            </div>
            <div class="modal__types">
                ${getPokemonTypes(pokemon.types)}
            </div>
            <div>
                <div class="modal__selectors">
                    <div class="modal__selector active" id="modal__selector-infos" onclick="getPokemonInfos(${pokemon.id}, 'infos')">Infos</div>
                    <div class="modal__selector" id="modal__selector-stats" onclick="getPokemonStats(${pokemon.id}, 'stats')">Stats</div>
                    <div class="modal__selector" id="modal__selector-evo" onclick="getPokemonEvoChain(${pokemon.id}, 'evo')">Evo chain</div>
                </div>
                <div id="modal__data-container">
                    <div class="modal__infos" id="modal__infos">
                        <div class="modal__info-spec">
                            <p>Height:</p>
                            <p>Weight:</p>
                            <p>Base Exp.:</p>
                            <p>Abilities:</p>
                        </div>
                        <div class="modal__info-value">
                            <p>${getHeighInMeters(pokemon.height)} m</p>
                            <p>${getWeightInKg(pokemon.weight)} kg</p>
                            <p>${pokemon.base_experience}</p>
                            <p>${getPokemonAbilities(pokemon)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal__footer">
                <img onclick="skipToNextPokemon('left')" src="./assets/img/arrow_left.png" alt="Nach links" title="Skip-Button Links">
                <p>${pokemon.id} / ${currentPokemonCount}</p>
                <img onclick="skipToNextPokemon('right')" src="./assets/img/arrow_right.png" alt="Nach rechts" title="Skip-Button Rechts">
            </div>
        </div>
`
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

function skipToNextPokemon(direction) {
    console.log(direction);
}