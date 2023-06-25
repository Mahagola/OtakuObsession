function get_id() {
    const storedAnimeTitle = localStorage.getItem('animeTitle');
    let animeTitle;
    if (storedAnimeTitle !== null) {
        animeTitle = storedAnimeTitle;
    } else {
        animeTitle = prompt('Enter The Anime');
        localStorage.setItem('animeTitle', animeTitle);
    }
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeTitle)}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then((data) => {
            const animeEntries = data.data;
            const temp_id = Math.floor(Math.random() * 24);
            if (animeEntries.length > 0) {
                const animeId = animeEntries[temp_id].mal_id; // Retrieve the ID of the first anime entry

                // Use the animeId directly or pass it to another function for further processing
                console.log('Anime ID:', animeId);

                // Call the get_char function with the animeId
                get_char(animeId);
            } else {
                console.log('No anime found with the given title');
            }
        })
        .catch((error) => {
            console.log('An error occurred while searching for anime: ' + error.message);
        });
}

function get_char(animeId) {
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then((data) => {
            const char = data.data;
            if (char.length > 0) {
                const rand_ind = Math.floor(Math.random() * char.length)
                const chosen_char = char[rand_ind];
                const char_name = chosen_char.character.name;
                const char_img = chosen_char.character.images.jpg.image_url;
                const char_img_element = document.getElementById("charImage")
                char_img_element.src = char_img;
                char_img_element.alt = char_name;
                localStorage.setItem('animeId', animeId);
                localStorage.setItem('expectedCharName', char_name);
            }
        })
        .catch((error) => {
            console.log('An error occurred while fetching characters: ' + error.message);
        });
}

let score = 0;
function guess_char() {
    const char_input = document.getElementById('charNameInput');
    const score_cur = document.getElementById('score');
    const expected_char = localStorage.getItem('expectedCharName');
    const scoreboard = document.getElementById('scoreboard');
    let expected_char_names = expected_char.split(' ');
    const entered_char = char_input.value.trim().toLowerCase();
    let is_correct = false;
    for (let i = 0; i < expected_char_names.length; i++) {
        if (entered_char === expected_char_names[i].toLowerCase()) {
            is_correct = true;
            break;
        }
    }
    if (is_correct) {
        score += 10;
        scoreboard.classList.add('correct')
        setTimeout(() => scoreboard.classList.remove('correct'), 500);
    } else {
        if(score>0){
             score -= 10;   
        }        
        scoreboard.classList.add('incorrect')
        setTimeout(() => scoreboard.classList.remove('incorrect'), 500);
    }
    score_cur.textContent = 'Your Score : ' + score;
    if (score >= 100) {
        score_cur.textContent = 'Your Score : ' + score;
        setTimeout(() => {
            alert('Congrats!!, You won the game!');
            reset_func();
        },500);
    }
    get_id();
}
function reset_func() {
    localStorage.clear();
    score = 0;
    location.reload();
}
// Call the get_id function to start the process
window.addEventListener('load', get_id);
