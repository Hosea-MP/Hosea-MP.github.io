document.addEventListener('DOMContentLoaded', function() {
    if (typeof SETDEX_SV === 'undefined') {
        console.error('SETDEX_SV is not defined. Make sure that hardcore.js is loaded before this script.');
        return;
    }

    var trainerPokemonMap = {};

    for (var pokemon in SETDEX_SV) {
        for (var trainer in SETDEX_SV[pokemon]) {
            if (!trainerPokemonMap[trainer]) {
                trainerPokemonMap[trainer] = [];
            }
            trainerPokemonMap[trainer].push(pokemon);
        }
    }

    function compareTrainerNames(a, b) {
        var nameA = a.replace(/^\*/, '').toLowerCase();
        var nameB = b.replace(/^\*/, '').toLowerCase();
        return nameA.localeCompare(nameB);
    }

    var sortedTrainers = Object.keys(trainerPokemonMap).sort(compareTrainerNames);

    var progressionSelect = document.getElementById('progression-select');
    if (progressionSelect) {
        sortedTrainers.forEach(function(trainer) {
            var option = document.createElement('option');
            option.value = trainer;
            option.text = trainer;
            progressionSelect.appendChild(option);
        });
    }

    var trainerSelect = document.getElementById('trainer-select');
    if (trainerSelect) {
        sortedTrainers.forEach(function(trainer) {
            var option = document.createElement('option');
            option.value = trainer;
            option.text = trainer;
            trainerSelect.appendChild(option);
        });
    }

    if (progressionSelect && progressionSelect.options.length > 0) {
        progressionSelect.selectedIndex = 0;
    }

    if (trainerSelect && trainerSelect.options.length > 0) {
        trainerSelect.selectedIndex = 0;
        var selectedTrainer = trainerSelect.value;
        displayTrainerPokemon(selectedTrainer);
    }

    if (trainerSelect) {
        trainerSelect.addEventListener('change', function() {
            var selectedTrainer = this.value;
            displayTrainerPokemon(selectedTrainer);
        });
    }

    function displayTrainerPokemon(trainer) {
        var gridContainer = document.getElementById('trainer-pokemon-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        var pokemonList = trainerPokemonMap[trainer];
        if (!pokemonList) return;

        pokemonList.forEach(function(pokemonName) {
            var pokemonButton = document.createElement('button');
            pokemonButton.innerText = pokemonName;
            pokemonButton.classList.add('pokemon-grid-item');

            pokemonButton.addEventListener('click', function() {
                var selectedItems = gridContainer.getElementsByClassName('selected');
                Array.from(selectedItems).forEach(function(item) {
                    item.classList.remove('selected');
                });

                this.classList.add('selected');
                
                var fullSetName = pokemonName + " (" + trainer + ")";
                var setSelector = $('.poke-info').first().find('.set-selector');
                setSelector.val(fullSetName).trigger('change');
            });

            gridContainer.appendChild(pokemonButton);
        });
    }
});