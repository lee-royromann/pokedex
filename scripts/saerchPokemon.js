function setupSearch() {
    const searchInput = document.querySelector('.header__search input');
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length < 3) {
            showAllCards();
            return;
        }

        filterCardsByName(query);
    });
}

function showAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('d_none');
    });
}

function filterCardsByName(query) {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const title = card.querySelector('.card__title');
        if (!title) return;

        const name = title.textContent.trim().toLowerCase();
        if (name.includes(query)) {
            card.classList.remove('d_none'); {
            };
        } else {
            card.classList.add('d_none'); {
            };
        }
    });
}