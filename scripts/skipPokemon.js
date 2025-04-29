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

function updateModalHeader(pokemon) {
    const header = document.querySelector('.modal__header');
    if (header) {
        header.innerHTML = getModalTemplateHeaderContent(pokemon);
    } else {
        console.warn('Modal header-container not found.');
    }
}

function updateModalImage(pokemon) {
    const imageContainer = document.querySelector('.modal__image');
    if (imageContainer) {
        imageContainer.innerHTML = getModalTemplatePokemonImage(pokemon);
    } else {
        console.warn('Modal image-container not found.');
    }
}

function updateModalTypes(pokemon) {
    const typesContainer = document.querySelector('.modal__types');
    if (typesContainer) {
        typesContainer.innerHTML = getPokemonTypesModalTemplate(pokemon.types, pokemon.id);
    } else {
        console.warn('Modal types-container not found.');
    }
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