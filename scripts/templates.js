function getCardTemplate(pokemon) {
    return `
        <div class="card" onclick="showPokemonDetails(${pokemon.id})">
            <span class="card__title">#${pokemon.id} ${capitalizeName(pokemon.name)}</span>
            ${getPokemonImageTemplate(pokemon)}
            <div class="card__types">
                ${getPokemonTypesCardTemplate(pokemon.types, pokemon.id)}
            </div>
        </div>
    `;
}

function getPokemonImageTemplate(pokemon) {
    return `
        <img class="card__image bg-${pokemon.types[0]}" 
            src="${pokemon.sprites.other.dream_world.front_default}" 
            alt="${pokemon.name}"
        >
    `;
}

function getPokemonTypesCardTemplate(types, id) {
    return types.map(type => `
        <div class="card__types--type bg-${type}">
            <img class="card__types--icon" src="./assets/icons/${type}.svg" alt="${type}">
        </div>
        <span class="card__types--name d_none">${capitalizeName(type)}</span>
    `).join('');
}

function getModalTemplate(pokemon) {
    return `
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal__header">${getModalTemplateHeaderContent(pokemon)}</div>
            <div class="modal__image">${getModalTemplatePokemonImage(pokemon)}</div>
            <div class="modal__types">${getPokemonTypesModalTemplate(pokemon.types, pokemon.id)}</div>
            <div>
                <div class="modal__selectors">${getModalTemplateTabSelectors(pokemon)}</div>
                <div class="modal__data-container" id="modal__data-container"></div>
            </div>
            <div class="modal__footer">${getModalTemplateFooterContent(pokemon)}</div>
        </div>
    `;
}

function getModalTemplateHeaderContent(pokemon) {
    return `
        <span class="modal__id" id="modal__id-${pokemon.id}">#${pokemon.id} - ${capitalizeName(pokemon.name)}</span>
        <i class="bi bi-x modal__close" onclick="closeModal()"></i>
    `;
}

function getModalTemplatePokemonImage(pokemon) {
    return `
        <img class="bg-${pokemon.types[0]}" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}" onclick="playPokemonCry('${pokemon.cries.latest}')" title="Click to play cry">
    `;
}

function getModalTemplateTabSelectors(pokemon) {
    return `
        <div class="modal__selector active" id="modal__selector-stats" onclick="loadPokemonStats(${pokemon.id}, 'stats')">Stats</div>
        <div class="modal__selector" id="modal__selector-evo" onclick="loadPokemonEvoChain(${pokemon.id}, 'evo')">Evo chain</div>
        <div class="modal__selector" id="modal__selector-infos" onclick="loadPokemonInfos(${pokemon.id}, 'infos')">Infos</div>
    `;
}

function getModalTemplateFooterContent(pokemon) {
    return `
        <img onclick="skipToNextPokemon('left', ${pokemon.id})" src="./assets/img/arrow_left.png" alt="left" title="Skip-Button left">
        <p>${pokemon.id} / ${currentPokemonCount}</p>
        <img onclick="skipToNextPokemon('right', ${pokemon.id})" src="./assets/img/arrow_right.png" alt="right rechts" title="Skip-Button right">
    `;
}

function getPokemonTypesModalTemplate(types, id) {
    return types.map(type => `
        <div class="card__types--type bg-${type}" id="card__type-${id}-${type}" onclick="togglePokemonTypeAppearance('${type}', ${id}, 'icon')" title="Click to show type name">
            <img class="card__types--icon" src="./assets/icons/${type}.svg" alt="${type}">
        </div>
        <span class="card__types--name txt-color-${type} d_none" id="card__name-${id}-${type}" onclick="togglePokemonTypeAppearance('${type}', ${id}, 'name')" title="Click to show type icon">${capitalizeName(type)}</span>
    `).join('');
}

function getPokemonInfoTemplate(pokemon) {
    return `
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
    `;
}

function getPokemonStatsTemplate(pokemon) {
    return `
        <div class="modal__stats" id="modal__stats">
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[0].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[0].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[0].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[0].base_stat}</p></div>
                </div>
            </div>
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[1].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[1].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[1].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[1].base_stat}</p></div>
                </div>
            </div>
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[2].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[2].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[2].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[2].base_stat}</p></div>
                </div>
            </div>
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[3].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[3].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[3].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[3].base_stat}</p></div>
                </div>
            </div>
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[4].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[4].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[4].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[4].base_stat}</p></div>
                </div>
            </div>
            <div class="modal__stats-data-row">
                <div class="modal__stats-data">
                    <p>${capitalizeName(pokemon.stats[5].stat.name)}:</p>
                    <p class="modal__stats-value--external">${pokemon.stats[5].base_stat}</p>
                </div>
                <div class="modal__stats-value-bar">
                    <div class="modal__stats-value" style="width: ${pokemon.stats[5].base_stat / 2}%;"><p class="modal__stats-value--internal">${pokemon.stats[5].base_stat}</p></div>
                </div>
            </div>
        </div>
    `;
}

function getLoadingSpinnerTemplate() {
    return `
        <div class="modal__loading-spinner">
            <p>Loading</p>
            <svg class="svg-spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        </div>
    `;
}