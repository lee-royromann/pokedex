let currentPokemonId = null;

function skipToNextPokemon(direction, pokemonId) {
    const currentIndex = findCurrentPokemonIndex(pokemonId);
    if (currentIndex === -1) return;
    const nextIndex = calculateNextIndex(currentIndex, direction);
    const nextPokemon = getNextPokemon(nextIndex);
    if (!nextPokemon) return;
    updateModalContent(nextPokemon);
}

function findCurrentPokemonIndex(pokemonId) {
    const index = pokemonInfos.findIndex(pokemon => pokemon.id === pokemonId);
    if (index === -1) {
        console.warn('Actual pokemon not found.');
    }
    return index;
}

function calculateNextIndex(currentIndex, direction) {
    if (direction === "left") {
        return currentIndex === 0 ? pokemonInfos.length - 1 : currentIndex - 1;
    }
    if (direction === "right") {
        return currentIndex === pokemonInfos.length - 1 ? 0 : currentIndex + 1;
    }
    return currentIndex;
}

function getNextPokemon(nextIndex) {
    const pokemon = pokemonInfos[nextIndex];
    if (!pokemon) console.warn('Next pokemon not found.');
    return pokemon;
}

function updateModalContent(pokemon) {
    updateCurrentPokemon(pokemon);
    updateModalHeader(pokemon);
    updateModalImage(pokemon);
    updateModalTypes(pokemon);
    const activeTabElementId = getActiveTab();
    updateModalSelectors(pokemon);
    if (activeTabElementId) {
        loadActiveTabContent(activeTabElementId, pokemon.id);
    } else {
        console.warn('Active tab not found.');
    }
    updateModalFooter(pokemon);
}

function updateCurrentPokemon(pokemon) {
    currentPokemonId = pokemon.id;
}

function updateModalSection(selector, contentFunction, ...args) {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = contentFunction(...args);
    } else {
        console.warn(`Modal container '${selector}' not found.`);
    }
}

function updateModalHeader(pokemon) {
    updateModalSection('.modal__header', getModalTemplateHeaderContent, pokemon);
}

function updateModalImage(pokemon) {
    updateModalSection('.modal__image', getModalTemplatePokemonImage, pokemon);
}

function updateModalTypes(pokemon) {
    updateModalSection('.modal__types', getPokemonTypesModalTemplate, pokemon.types, pokemon.id);
}

function getActiveTab() {
    const activeTab = document.querySelector('.modal__selector.active');
    if (activeTab) {
        return activeTab.id;
    } else {
        console.warn('Active tab not found.');
        return null;
    }
}

function updateModalSelectors(pokemon) {
    const selectorsContainer = document.querySelector('.modal__selectors');
    if (selectorsContainer) {
        selectorsContainer.innerHTML = getModalTemplateTabSelectors(pokemon);
    } else {
        console.warn('Modal selectors-container not found.');
    }
}

function loadActiveTabContent(tabId, pokemonId) {
    if (tabId === "modal__selector-infos") {
        loadPokemonInfos(pokemonId, "infos");
    } else if (tabId === "modal__selector-stats") {
        loadPokemonStats(pokemonId, "stats");
    } else if (tabId === "modal__selector-evo") {
        loadPokemonEvoChain(pokemonId, "evo");
    } else {
        console.warn('Unknown Tab:', tabId);
    }
}

function updateModalFooter(pokemon) {
    const footer = document.querySelector('.modal__footer');
    if (footer) {
        footer.innerHTML = getModalTemplateFooterContent(pokemon);
    } else {
        console.warn('Modal footer-container not found.');
    }
}