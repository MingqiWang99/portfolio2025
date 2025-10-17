let cols, rows;
let scl = 15; // Reduced from 30 to 15 for higher resolution
let zoff = 0;
let particles = [];
let flowfield;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  
  // Set pixel density for high-DPI displays (Retina, etc.)
  pixelDensity(2); // This doubles the resolution
  
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  
  for (let i = 0; i < 2500; i++) { // Increased particles for denser look
    particles[i] = new Particle();
  }
  background(255);
}

function draw() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += 0.08;
    }
    yoff += 0.08;
  }
  zoff += 0.004;
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(2); // Maintain pixel density on resize
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  background(255);
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.acc = createVector();
    this.maxspeed = 1.5;
    this.color = color(36, 84, 255, 10); // Slightly increased alpha
  }
  
  follow(flowfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    x = constrain(x, 0, cols - 1); // Prevent index errors
    y = constrain(y, 0, rows - 1);
    let index = x + y * cols;
    let force = flowfield[index];
    this.applyForce(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  show() {
    let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < 50) {
      this.color = color(36, 84, 255, 10);
    } else {
      this.color = color(36, 85, 255, 4);
    }
    strokeWeight(2.5);
    
    if (random(1) < 0.005) {
      stroke(255, 255, 255, 200);
      strokeWeight(2);
    } else {
      stroke(this.color);
    }
    point(this.pos.x, this.pos.y);
  }
}
