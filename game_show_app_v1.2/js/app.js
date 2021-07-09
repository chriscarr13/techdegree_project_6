/****************************** variables ********************************/
const mainContainer = document.querySelector('div.main-container');
const overlay = document.getElementById('overlay');
const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const btnReset = document.querySelector('a.btn__reset');
const scoreboard = document.getElementById('scoreboard').querySelector('ol');
const lives = scoreboard.children;
const phrases = [
    "Im the king of the world",
    "My mama always said life was like a box of Chocolates",
    "Heres looking at you kid",
    "I am groot",
    "Look at me Im the captain now"
];

let missed = 0; //missed guesses counter


/****************************** event listeners ******************************/

/* start or reset game when button is clicked */
mainContainer.addEventListener("click", (e) => {
    const button = event.target;
    switch (button.textContent) {
        case 'Start Game':
            setGame();
            break;
        case  'Try again':
            setGame('lose');
            break;
        case 'Play again':
            setGame('win');
            break;
    }
});

/* handles key row btn transformation and scoarboard lives tracking */
qwerty.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const clicked = event.target;
        if (!(e.target.classList.contains('chosen'))){
            clicked.classList.add('chosen');
            clicked.classList.add('wiggle-effect');
            let letterFound = checkLetter(clicked);
            if (!(letterFound)) {
                scoreboard.removeChild(lives[0]);
                missed++;
            }
        } 
        clicked.setAttribute('autocomplete', 'disabled');
    }
    checkWin(); 
});

/* remove key btn wiggle effect when wiggle effect hapens*/
qwerty.addEventListener('animationend', (e) => {
    const button = event.target;
    button.classList.remove('wiggle-effect');
});

/**************************** Functions ***********************************/
 
/* returns a random phrase */
function getRandomPhraseAsArray(arr) {
    const phraseArr = arr;
    let randomNumber =  Math.floor(Math.random() * phraseArr.length);
    let randomPhrase = phraseArr[randomNumber];
    let characterArr = randomPhrase.split("");
    return characterArr;
}

/* Adds phrase on display*/
function addPhraseToDisplay(arr) {
    const characterArr = arr;   
    for (let i = 0; i < characterArr.length; i++) {
        let li = document.createElement('li');
        li.textContent = characterArr[i];
        if(li.textContent != " " ){
            li.classList.add('letter'); // repeated code: refractor
            phrase.children[0].appendChild(li);
        } else {
            li.classList.add('space');
            phrase.children[0].appendChild(li);
        }
    }
}

/* chekcs if the letter chosen matches the one of the letters from the phrase thats on display. */
function checkLetter (btn) {
    const checkLetter = phrase.querySelector('ul').children;
    let btnClicked = btn.textContent;
    let match = null;
    for(let i = 0; i < checkLetter.length; i++) {  
        if (checkLetter[i].classList.contains('letter')) {
            if(btnClicked === checkLetter[i].textContent.toLowerCase()) {
                checkLetter[i].classList.add('show');
                checkLetter[i].style.transition = 'all .6s ease-in';
                match = btnClicked;
            }
        }
    }
    return match;
}

/* checks if you won or lost */
function checkWin () {
    const letterList = document.querySelectorAll('li.letter');
    const showList = document.querySelectorAll('li.show');
    /* function to setup win/lose overlay  */
    function overlaySetUp (condition, headerTxt, btnTxt) {
        overlay.classList.add(condition);
        overlay.style.display = 'flex';
        let h1 = document.createElement('h1');
        overlay.appendChild(h1);
        h1.textContent = headerTxt;
        btnReset.textContent = btnTxt;
    }
    // if the player loses 
    if (missed > 4) {
        overlaySetUp('lose','You Lost!','Try again');
    } 
    // if the player wins
    else if (letterList.length === showList.length){
        overlaySetUp('win','You Won!','Play again');
    }
}

/* sets or resets the game */
function setGame (outcome = ''){
    // if theres a lose win outcome reset
    if(outcome){
        const heart = '<li class="tries"><img src="images/liveHeart.png" height="35px" width="30px"></li>';
        let qwertyArr = qwerty.querySelectorAll('button.chosen');
        let phraseList = phrase.querySelector('ul');
        let overlayText = overlay.querySelector('h1');
        missed = 0;
        // reset keyboard on screen
        for (let i = 0; i < qwertyArr.length; i++){
            qwertyArr[i].classList.remove('chosen');
        }
        // reset phrase screen
        while (phraseList.firstChild){
            phraseList.removeChild(phraseList.firstChild);
        }
        // reset lives
        while (lives.length < 5) {
            scoreboard.innerHTML += heart;
        }
        // reset overlay
        overlay.classList.remove(outcome);
        overlayText.remove();
        btnReset.textContent = '';
    }
    // remove overlay and set game
    overlay.style.display = 'none';
    addPhraseToDisplay(getRandomPhraseAsArray(phrases));
}

