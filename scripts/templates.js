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
                    <div class="modal__selector active" id="modal__selector-stats" onclick="loadPokemonStats(${pokemon.id}, 'stats')">Stats</div>
                    <div class="modal__selector" id="modal__selector-evo" onclick="loadPokemonEvoChain(${pokemon.id}, 'evo')">Evo chain</div>
                    <div class="modal__selector" id="modal__selector-infos" onclick="loadPokemonInfos(${pokemon.id}, 'infos')">Infos</div>
                </div>
                <div class="modal__data-container" id="modal__data-container">
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

function getPokemonTypes(types) {
    return types.map(type => `
        <div class="modal__type ${type.type.name}">
            ${capitalizeName(type.type.name)}
        </div>
    `).join('');
}