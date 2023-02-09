//Project: Find your hat
//goal is to move things around board to specified location to win. going off board or hitting obstacle loses.

//requires prompt-sync
//npm install prompt-sync
//==================================================================================================
//variables and things
//makes prompts work, voodoo
const prompt = require('prompt-sync')({sigint: true});
//field items
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const mainCharacter = '*';
const pathMarker = '='
//game inititlization value
let gameOver = false;
//declare win loc values
let winX
let winY
//winning location
const winLoc = {y:winY, x:winX}
//starting location
const startLoc = {y:0, x:0}
//current location (0,0 upon game initialization)
let currLoc = {y:0, x:0}
//holder for the gameover message conditionals
let gameOverReason = ''
//elements of the intro function
const decoration = "~*~*~"
const gameTitle = "HAT FINDER GUY THING GAME"
const gameRules = "Help the mote find its hat. To play use your U, D, L, and R keys to move Up, Down, Left, and Right. Don't fall in the holes and don't fall off the map. You can press H to review these guidelines."
//lets me call myField in multiple places in the game intro loop depending on conditions, probably doesn't need to be null, could be empty
let myField = null;
//counter for the intro loop, if called inside the while loop, counter won't cause loop exit condition to trigger
let startCounter = 0;
//==================================================================================================

//helping functions to clean up code
//clears console screen
function cc() {
  process.stdout.write('\x1Bc');
}

//cleans up intro message code repetition
function intro(){console.log(decoration); console.log(gameTitle);console.log(decoration);console.log(gameRules);console.log(decoration)};

//picks a random number, used to clean up generateField()
function Pos(num) {
  return Math.floor(Math.random()*num);
}

//picks negative reinforcement message for unacceptable user input in game intro loop
function chooseInsult() {
  const insultArr = ['invalid input idiot', 'you fat-fingered that one', 'dyslexia is going to make this game hard. try again', 'feed me more letters human', '*internal screaming* InVaLiD iNpUt', "did you know that -ussy, gaslighting, goblin mode, and woman were all listed as the 2022 word of the year? Kind of makes you give up on humanity, huh? Anyway you input an invalid input, go ahead and try again."]
  let randInt = Math.floor(Math.random()*insultArr.length)
  return insultArr[randInt];
}

//function contains game ending conditions, renders game over, sets game over reason
function gameCheck() {
  if (currLoc.y < 0 || currLoc.x < 0 || currLoc.y >= myField.field.length || currLoc.x >= myField.field[0].length) {
    gameOver = true;
    gameOverReason = 'edge';
  } else if (myField.field[currLoc.y][currLoc.x] === hat) {
    //game ends in a win
    gameOver = true;
    gameOverReason = 'win';
  } else if (myField.field[currLoc.y][currLoc.x] === hole){
    //game ends in a loss
    gameOver = true;
    gameOverReason = 'hole';
  } 
}

//==================================================================================================
//the containing class
class Field {
  constructor(field) {
    this._field = field
  }

  get field() {
    return this._field;
  }

  print() {
    for(let array of this._field){
      console.log(array.join(''))
    }
  }

  static generateField() {
    //sizes board
    const gameXSize = Number (prompt('Desired game board width (3-50): '));
    const gameYSize = Number (prompt('Desired game board height (3-30): '));
    //these need to be limited to number inputs somehow. loop around the prompt like the game start function to require numerical values within a certain range. simple message displays if it has to loop.

    //iterate game board into existence
    const gameboard = [...Array(gameYSize)]
    for (let i=0; i<gameboard.length; i++){
      gameboard[i] = [...Array(gameXSize)]
    }
    //gameboard full of undefineds here
    //defines hat/win location
    function chooseWinLoc() {
      winX = Pos(gameXSize);
      winY = Pos(gameYSize);
      if (winX === 0 && winY === 0) {
        winX += Pos(gameXSize-1)
        winY += Pos(gameYSize-1)
      }
      return winX, winY;
    }
    //select win location at random
    chooseWinLoc();
    //adds hat to board at win location
    gameboard[winY][winX] = hat;
    // win location added
    //starting location
    gameboard[0][0] = mainCharacter;
    //starting location added
    //total playable spaces
    const numBoardTiles = gameXSize * gameYSize;
    //how many holes should exist for a given board size (difficulty of sorts)
    const numHoles = numBoardTiles * .2;
    //adds holes to gameboard, eusuring they're not added at a character or hat location
    let j = numHoles
    while (j > 0) {
      let possibleX = Pos(gameXSize)
      let possibleY = Pos(gameYSize)
      if (gameboard[possibleY][possibleX] === undefined) {
        gameboard[possibleY][possibleX] = hole;
        j--
      }
    }
    //holes added
    //fills the remaining undefined game board area with field characters
    for (let k=0; k<gameboard.length; k++){
      for (let l=0; l<gameboard[k].length; l++){
        if (gameboard[k][l] === undefined) {
          gameboard[k][l] = fieldCharacter;
        }
      }
    }
    //remaining undefined areas filled with field chars
    return gameboard
  }

  //player valid inputs
  //on move:
    //change the current location to a previous location via pathMarker icon
    //update to the new location based on the move
    //move the character icon to the new location and display it
  moveUp() {
    this._field[currLoc.y][currLoc.x] = pathMarker;
    currLoc.y -=1;
    //check the game conditions here before reassigning the new location to a different icon, otherwise new location icon interferes with logic checks
    gameCheck();
    if (gameOver !== true) {
      this._field[currLoc.y][currLoc.x] = mainCharacter;
    }
  }

  moveDown() {
    //on move, we should update the current location, and mark the previous location
    this._field[currLoc.y][currLoc.x] = pathMarker;
    currLoc.y +=1;
    gameCheck();
    if (gameOver !== true) {
      this._field[currLoc.y][currLoc.x] = mainCharacter;
    }
  }

  moveLeft() {
    //on move, we should update the current location, and mark the previous location
    this._field[currLoc.y][currLoc.x] = pathMarker;
    currLoc.x -=1;
    gameCheck();
    if (gameOver !== true) {
      this._field[currLoc.y][currLoc.x] = mainCharacter;
    }
  }

  moveRight() {
    //on move, we should update the current location, and mark the previous location
    this._field[currLoc.y][currLoc.x] = pathMarker;
    currLoc.x +=1;
    gameCheck();
    if (gameOver !== true) {
      this._field[currLoc.y][currLoc.x] = mainCharacter;
    }
  }

  helpMessage() {
    //clear console
    cc();
    //display intro
    intro();
    //display current same game board
    myField.print();
    //disappears on next user input by default since the console is wiped an regenerated elsewhere
  }
  // new class methods go here
}
//==================================================================================================

//GAME INTRO LOOP
//starts the game by asking for user input, some fun input response variations, displays the intro, instantiates a new instance of the class Field, clears console, displays the initial field
//prompts user for input
let beginplay = prompt('Would you like to play a game? (y or n) ');
//response loop
while (beginplay !== 'y' && beginplay !== 'n'){
  //negative reinforcement for incorrect inputs
  console.log(chooseInsult());
  startCounter ++;
  //starts game anyway after enough incorrect inputs
  if (startCounter > 4){
    console.log("let's help you out here.");
    intro();
    playSpace = Field.generateField();
    myField = new Field(playSpace);
    cc();
    myField.print();
  } else{
    beginplay = prompt('Would you like to play a game? (y or n)');
  }
} 
if (beginplay === 'y'){
  //correct input
    intro();
    playSpace = Field.generateField();
    myField = new Field(playSpace);
    cc();
    myField.print();
} else if (beginplay === 'n'){
  //"incorrect" input
    console.log('too bad.');
    intro();
    playSpace = Field.generateField();
    myField = new Field(playSpace);
    cc();
    myField.print();
}
//==================================================================================================

//MAIN GAME LOOP
while (gameOver !== true){
  //ask for input
  let playerMove = prompt('Your move: ')
  //on valid move: 
  //use method to update location
  //movement methods check new location against game conditions with gameCheck function
    //gameCheck function should exit loop if necessary
  //if loop continues, clear board, display new board
  //non movement method displays help
  //invalid inputs log a message for user correction
  if (playerMove === 'u') {
    myField.moveUp();
    cc();
    myField.print();
  } else if (playerMove === 'd') {
    myField.moveDown();
    cc();
    myField.print();
  } else if (playerMove === 'l') {
    myField.moveLeft();
    cc();
    myField.print();
  } else if (playerMove === 'r') {
    myField.moveRight();
    cc();
    myField.print();
  } else if (playerMove === 'h') {
    myField.helpMessage();
  } else {
    console.log('Valid moves are U for Up, D for Down, L for Left, R for Right, and H for Help')
  }
}
//==================================================================================================

//renders the final messages for game end scenarios
if (gameOverReason === 'win') {
  cc();
  console.log('Game Over')
  console.log(decoration)
  console.log('You win, very nice, the mote has been reunited with its hat')
} else if (gameOverReason === 'hole') {
    cc();
    console.log('Game Over')
    console.log(decoration)
    console.log("The mote fell in a hole and starved to death due to your directions. You're personally responsible for its loss of life. Good luck explaining that to its family. I hope you speak mote-ish.")
}else if (gameOverReason === 'edge') {
    cc();
    console.log('Game Over')
    console.log(decoration)
    console.log("The mote fell off the edge of the map into the infinite abyss. Considering its an infinite abyss, the mote will actually die of hunger or thirst over a long period of physical and existential suffering. Caused by you.")
}
    
//==================================================================================================
//development area

//random character start location

//count turns

//add holes every nth turn

//count score based on turns (par)

//field validator/maze solver

//add grabbables for higher score

//limited number of turns to win

//prompt to play again that resets a new board at the end of the game