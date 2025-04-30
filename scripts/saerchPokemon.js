function setupSearch() {
    const searchField = document.querySelector('.header__search input');
    searchField.addEventListener('input', function() {
        const text = searchField.value.trim().toLowerCase();
        if (text.length < 3) {
            showAllCards();
            return;
        }
        filterCardsByName(text);
    });
}

function showAllCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card) {
        card.classList.remove('d_none');
    });
}

function filterCardsByName(query) {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card) {
        const titleElement = card.querySelector('.card__title');
        if (!titleElement) {
            return;
        }
        const name = titleElement.textContent.trim().toLowerCase();
        if (name.includes(query)) {
            card.classList.remove('d_none');
        } 
        else {
            card.classList.add('d_none');
        }
    });
}