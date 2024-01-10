let player;
let cars = [];
let bg;
let restartButton;
let gameIsOver = true;

let imageModelURL = "https://teachablemachine.withgoogle.com/models/wvt-tTMr0/";

let video;
let flipVideo;
let label = "waiting...";

let classifier;

let spawnInterval = 30;

function preload() {
  bg = loadImage("images/background.jpg");
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  let canvas = createCanvas(screen.width, screen.height);
  canvas.position(windowWidth - width, 0); // Align to the right, 0 from the top

  noLoop(); // Don't start the game loop until the user clicks "Start"

  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  // Start classifying
  classifyVideo();

  // Initialize the game
  player = new Player(screen.width / 2, screen.height / 2);
  cars = [];

  // Create restart button
  restartButton = createButton("(re)start");
  restartButton.position(140, 530);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;

  if (label === "Links") {
    player.moveLeft();
  } else if (label === "Rechts") {
    player.moveRight();
  }
  console.log(label);
  // Classify again!
  classifyVideo();
}

function draw() {
  // Draw background
  background(0);
  imageMode(CENTER);
  image(bg, width / 2, height / 2, width, height);

  //draw a rect underneath the video
  fill(255);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, 350, screen.height);

  imageMode(CORNER);
  image(flippedVideo, 10, 10);

  //write the instructions
  fill(0);
  textSize(16);
  textAlign(CORNER, CORNER);
  text("Hand open voor Links", 90, 300);
  text("Vuist voor Rechts", 75, 350);

  //write the label in the middle of the rectangle
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(label, 170, 430);

  if (gameIsOver) {
    restartButton.show();
  }

  // Spawn a new car every 0.5 seconds
  if (!gameIsOver && frameCount % spawnInterval === 0) {
    let randomX = random(350, screen.width);
    let randomColor = color(random(255), random(255), random(255));
    let newCar = new Car(randomX, 0, randomColor);
    cars.push(newCar);
  }

  // Display and move each car
  for (let i = cars.length - 1; i >= 0; i--) {
    let currentCar = cars[i];
    currentCar.display();
    currentCar.move();

    // Check for collision with player
    if (
      collideRectCircle(
        currentCar.x,
        currentCar.y,
        50,
        50,
        player.x,
        player.y,
        50,
        50
      )
    ) {
      gameOver();
    }

    // Remove cars that are off the screen
    if (currentCar.y > height) {
      cars.splice(i, 1);
    }
  }

  // Display and move the player
  player.display();
}

function gameOver() {
  // Stop the game loop
  noLoop();
  gameIsOver = true;
  console.log("Game over!");
  console.log(gameIsOver);
  restartButton.show();
}

function restartGame() {
  // Reset variables
  player = new Player(screen.width / 2, screen.height / 2);
  cars = [];
  gameIsOver = false;
  loop(); // Restart the game loop
  restartButton.hide(); // Hide the restart button
}
