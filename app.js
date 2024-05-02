let type;
let intervalID;
let count = 0;
let live = 6;
let win = false;
let firstCard = null;
let secondCard = null;
let gamseHistory = [];
const selectLavel = document.querySelector("#selectLavel");
let hard = document.querySelector("#hard");
let easy = document.querySelector("#easy");
let divCards = document.querySelector("#divCards");
const timer = document.querySelector("#timer");
const lives = document.querySelector("#lives");
const btnStart = document.querySelector("#btnStart");
const gameList = document.querySelector('#gameList');
// const delBtn = document.querySelector('#delBtn');

// delBtn.addEventListener('click', ()=>{
//   console.log(delBtn)
// })


let shapes = [
  "./assets/circle.svg",
  "./assets/circle.svg",
  "./assets/square.svg",
  "./assets/square.svg",
  "./assets/triangle.svg",
  "./assets/triangle.svg",
  "./assets/star.svg",
  "./assets/star.svg",
];

let latters = [
  "A",
  "A",
  "B",
  "B",
  "C",
  "C",
  "D",
  "D",
  "E",
  "E",
  "F",
  "F",
  "G",
  "G",
  "H",
  "H",
];

function spinArr(arr) {
  let copy = [],
    len = arr.length;
  while (len > 0) {
    let rnd = Math.floor(Math.random() * arr.length);
    if (arr[rnd] != null) {
      copy.push(arr[rnd]);
      delete arr[rnd];
      len--;
    }
  }
  return copy;
}
const spinArrType = (type) => {
  (type === "hard") ? latters = spinArr(latters) : shapes = spinArr(shapes)
}

const timerGame = () => {
  let min = 0,
    sec = 0;
  intervalID = setInterval(() => {
    sec++;
    if (sec % 60 == 0) {
      min++;
      sec = 0;
    }
    timer.innerHTML = zeroForTimer(min) + ":" + zeroForTimer(sec);
  }, 1000);
};

const zeroForTimer = (num) => {
  if (num < 10) return "0" + num;
  return num;
};


hard.addEventListener("click", () => {
  type = "hard";
  spinArrType(type);
  timerGame();
  createGrid(latters);
  writeLivesInWeb();
  selectLavel.style.display = "none";
});
easy.addEventListener("click", () => {
  type = "easy";
  spinArrType(type);
  timerGame();
  createGrid(shapes);
  writeLivesInWeb();
  selectLavel.style.display = "none";
});
btnStart.addEventListener("click", () => {
  clearInterval(intervalID);
  divCards.innerHTML = "";
  count = 0;
  live = 6;
  selectLavel.style.display = "block";
});

const setTypeContent = (card, elem) => {
  if (type === "easy") {
    card.innerHTML = `<img src="${elem}" height=100px/>`;
  } else {
    card.innerHTML = elem;
  }
};

const checkMatch = () => {
  if (firstCard.innerHTML !== secondCard.innerHTML) {
    firstCard.innerHTML = "?";
    secondCard.innerHTML = "?";
    firstCard = null;
    secondCard = null;
    updateLives();
  } else {
    firstCard = null;
    secondCard = null;
    count += 2;
  }
  if (
    (type == "hard" && count == latters.length) ||
    (type == "easy" && count == shapes.length)
  ) {
    win = true;
    alert("You win! time is: " + timer.innerHTML + " live left: " + live );
    // gamseHistory.push("You win! time is: " + timer.innerHTML + " live left: " + live);
    gamseHistory.push({win: win, time: timer.innerHTML, lives: live, mode: type});
    console.log(gamseHistory)
    localStorage.setItem("gamseHistory", JSON.stringify(gamseHistory));
    // LSItems.push(temp)
    divCards.innerHTML = "";
    clearInterval(intervalID);
    timer.innerHTML = "00:00";
    count = 0;
    live = 6;
    
    selectLavel.style.display = "block";
    createList(gamseHistory);
  }
};
const writeLivesInWeb = () =>{
  lives.innerHTML = "";
  for (let i = 0; i < live; i++) lives.innerHTML += "❤️";
}
const updateLives = () => {
  live--;
  writeLivesInWeb()
  if (live == 0) {
    win = false;
    alert("Game over! You loser time is: " + timer.innerHTML);
    // gamseHistory.push("Game over! You loser time is: " + timer.innerHTML);
    gamseHistory.push({win: win, time: timer.innerHTML, lives: live, mode: type});
    localStorage.setItem("gamseHistory", JSON.stringify(gamseHistory));
    divCards.innerHTML = "";
    clearInterval(intervalID);
    timer.innerHTML = "00:00";
    count = 0;
    live = 6;
    selectLavel.style.display = "block";
    createList(gamseHistory);
  }
};

const createGrid = (arr) => {
  let divRow;
  arr.forEach((elem, i) => {
    if (i % 4 == 0) {
      divRow = document.createElement("div");
      divRow.className = "row gap-2 pb-2";
      divCards.append(divRow);
    }
    let card = document.createElement("div");
    card.className =
      "card col text-center d-flex justify-content-center bg-primary rounded-2";
    card.innerHTML = "?";
    card.addEventListener("click", () => {
      if(card.innerHTML == "?"){
        if (!firstCard) {
          firstCard = card;
          setTypeContent(card, elem);
        } else if (!secondCard) {
          secondCard = card;
          setTypeContent(card, elem);
          setTimeout(() => {
            checkMatch();
          }, 1000);
        }
      }
    });
    divRow.append(card);
  });
};

// create list LS
gamseHistory = JSON.parse(localStorage.getItem("gamseHistory")) || [];
console.log(gamseHistory)

const createList = (list) => {
  gameList.innerHTML = ""
  list.forEach((item,i)=>{
    let li = document.createElement("li");
    li.className = " d-flex justify-content-between align-items-center mb-2 rounded-3 p-2" ;
    li.classList.add((item.win) ? "bg-success" : "bg-danger");
    li.innerHTML = `<p>Win: ${item.win} Time: ${item.time} Lives: ${item.lives} Mode: ${item.mode}</p>
    <button id="deleteBtn" class="btn text-black py-0 px-2" onclick="delBtn(${i})">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="30"
              fill="currentColor"
              class="bi bi-trash3-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
              />
            </svg>
          </button>
    `
    gameList.append(li);
  })
}
createList(gamseHistory);

// remove object from LS
const delBtn = (index) =>{
  gamseHistory.splice(index,1);
  console.log(gamseHistory);
  localStorage.setItem("gamseHistory", JSON.stringify(gamseHistory));
  createList(gamseHistory)
  
}
