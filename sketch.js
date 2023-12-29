let player;
let cars = [];
let bg;

function preload() {
  bg = loadImage("images/background.jpg");
}

async function setup() {
  createCanvas(1500, 700);

  // Initialize the game
  player = new Player(1400, 700 / 2);
  cars = [];
}

function draw() {
  // Draw background
  background(0);
  imageMode(CENTER);
  image(bg, width / 2, height / 2, width, height);

  // Spawn a new car every couple of seconds
  if (frameCount % 60 === 0) {
    let randomX = random(width);
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
  player.move();
}

function gameOver() {
  // stop the game loop
  noLoop();
}