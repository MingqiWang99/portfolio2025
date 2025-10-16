let cols, rows;
let scl = 30; // Increased from 20 to 40 for larger waves
let zoff = 0;
let particles = [];
let flowfield;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  
  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);
  
  for (let i = 0; i < 1500; i++) { // Reduced from 2000 to 1500
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
      xoff += 0.08; // Reduced from 0.1 for smoother, larger waves
    }
    yoff += 0.08; // Reduced from 0.1 for smoother, larger waves
  }
  zoff += 0.004; // Reduced from 0.1 for slower, more fluid movement
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
    this.maxspeed = 1.5; // Increased from 2 for more visible movement
    this.color = color(68, 105, 161, 8); // Increased alpha from 5 to 8
  }
  
  follow(flowfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
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
      this.color = color(36, 84, 255, 8); // Increased alpha from 5 to 8
    } else {
      this.color = color(36, 85, 255, 8); // Increased alpha from 5 to 8
    }
    strokeWeight(3); // Increased from 2 for thicker lines
    
    if (random(1) < 0.005) { // Reduced from 0.01 for fewer white sparkles
      stroke(255, 255, 255, 200);
      strokeWeight(2);
    } else {
      stroke(this.color);
    }
    point(this.pos.x, this.pos.y);
  }
}
