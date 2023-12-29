class Car {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 5;
  }

  display() {
    // Draw the car
    fill(this.color);

    // Body
    rect(this.x, this.y, 80, 30);

    // Roof
    rect(this.x + 10, this.y - 20, 60, 20);

    // Windows
    fill(200);
    rect(this.x + 15, this.y - 15, 20, 15);
    rect(this.x + 45, this.y - 15, 20, 15);

    // Wheels
    fill(50);
    ellipse(this.x + 20, this.y + 30, 20, 20);
    ellipse(this.x + 60, this.y + 30, 20, 20);
  }

  move() {
    // Move the car down
    this.y += this.speed;
  }
}
