let room = "main";
let trash = [];
let goo = [];
let trees = [];
let trashCollected = 0;
let gooCleaned = 0;
let treesPlanted = 0;  
let desertMusic;
let oceanMusic;
let forestMusic;
let treeSound;

let mainRoomBackground, oceanBackground, desertBackground, forestBackground;
let trashImage, gooImage, treeImage;

let font;

function preload() {
  // Load backround images
  mainRoomBackground = loadImage('1.png');
  oceanBackground = loadImage('2.png');
  desertBackground = loadImage('3.png');
  forestBackground = loadImage('4.png');
  
   // Load icon images
  trashImage = loadImage('trash.png');
  gooImage = loadImage('goo.jpeg');
  treeImage = loadImage('tree.png');
  
  // Load font
  font = loadFont('Kollektif-Bold.ttf');
  
 // Load music for different environments
  desertMusic = loadSound('desert.wav');
  oceanMusic = loadSound('waves.wav');
  forestMusic = loadSound('forest.wav');
    treeSound = loadSound('tree.mp3');
}

function setup() {
  createCanvas(700, 700); //Set Canvas Size 
  initializeTrash(); // Intialize trash array 
  initializeGoo();// Intialize goo array 
}

function draw() {
  background(220);
  
  
  // Switch between rooms and draw them
  if (room === "main") {
    drawMainRoom();
  } else if (room === "ocean") {
    drawOcean();
  } else if (room === "desert") {
    drawDesert();
  } else if (room === "forest") {
    drawForest();
  }
}

function drawMainRoom() {
  image(mainRoomBackground, 0, 0, width, height);
}

function keyPressed() {
  if (key === '1') { // Switch to ocean room
    room = "ocean";
    desertMusic.stop(); 
    forestMusic.stop(); 
    if (oceanMusic.isLoaded() && !oceanMusic.isPlaying()) {
      oceanMusic.loop(); // Start ocean music 
    }
    trashCollected = 0;
    trash = [];
    for (let i = 0; i < 10; i++) {
      trash.push({
        x: random(100, 600), // Random x for trash 
        y: random(200, 600), // Random y for trash 
        ySpeed: random(0.5, 1), // Random speed for vertical moving 
        offset: random(TWO_PI) }); // Random offset for floaty effect
    }
  } else if (key === '2') {
    room = "desert"; // Switch to the desert room
    oceanMusic.stop();
    forestMusic.stop(); 
    if (desertMusic.isLoaded() && !desertMusic.isPlaying()) {
      desertMusic.loop(); // Start desert music
    }
    gooCleaned = 0;
    initializeGoo();
    goo = [];
    for (let i = 0; i < 5; i++) {
      goo.push({ x: random(100, 600), y: random(400, 600), size: random(50, 100) }); // Add size for growing effect
    }  
  } else if (key === '3') {
    room = "forest"; // Switch to the forest room
    oceanMusic.stop();
    desertMusic.stop();
    if (forestMusic.isLoaded() && !forestMusic.isPlaying()) {
      forestMusic.loop();  // Start forest music
    }
    trees = [];
  } else if (key === ' ' && (trashCollected >= 10 || gooCleaned >= 3 || treesPlanted >= 15)) {
    room = "main";
    oceanMusic.stop();
    desertMusic.stop(); 
    forestMusic.stop();
  }
}

function drawOcean() {
  image(oceanBackground, 0, 0, width, height); 
  textSize(20);
  fill("white");
  textFont(font);
  text("Quick! Click on the trash to", 220, 60);

  // Make trash animate 
  for (let i = trash.length - 1; i >= 0; i--) {
    let t = trash[i];
    image(trashImage, t.x - 40, t.y - 40, 80, 80); // Draw trash image
    t.y += sin(t.offset) * 2;  // Floaty effect
    t.offset += 0.05; // Offset
  }

  if (trashCollected >= 10) {
    textSize(24);
    textFont(font);
    text("    You saved them! \n Press SPACE to save \nanother environment!", 220, height / 2);
  }
}

function mousePressed() {
  if (room === "ocean") {
    for (let i = trash.length - 1; i >= 0; i--) {
      let t = trash[i];
      // Check if the click is within the trash object boundary (considering the floaty movement)
      if (dist(mouseX, mouseY, t.x, t.y) < 40) { // If clicked
        trash.splice(i, 1);  // Remove the trash after click
        trashCollected++; // Keep track of goo cleaned
      }
    }
  } else if (room === "desert") {
    for (let i = goo.length - 1; i >= 0; i--) {
      let g = goo[i];
      if (dist(mouseX, mouseY, g.x, g.y) < g.size / 2) {
        goo.splice(i, 1);
        gooCleaned++;
      }
    }
  } else if (room === "forest") {
    trees.push({ x: mouseX - 90, y: mouseY - 80 }); // Place tree at mouse 
    treesPlanted++; // Keep track of trees planted
    treeSound.play(); 
    if (treesPlanted >= 15) {
      treesPlanted = 15; // Only 15 trees 
    }
  }
}

function drawDesert() {
  image(desertBackground, 0, 0, width, height); 
  
  textSize(30);
  fill("purple");
  textFont(font);
  text("   Your mouse is a sponge! \n     Quick! Click on the goo  \n to clean the nuclear waste!", 220, 60);
  
  // Make goo grow
  for (let g of goo) {
    image(gooImage, g.x - g.size / 2, g.y - g.size / 2, g.size, g.size); // Draw goo
    g.size += 0.1;  // Goo grows slowly 
  }
  
  if (gooCleaned >= 5) {
    textSize(24);
    fill("purple");
    text("You saved the desert! \nPress SPACE to save \nanother environment!", 130, height / 2);
  }
}

function drawForest() {
  image(forestBackground, 0, 0, width, height); 
  
  textSize(20);
  fill("green");
  textFont(font);
  text("Oh no! The trees are all gone! \n Click to plant more!", 300, 100);
  
  for (let t of trees) {
    image(treeImage, t.x - 5, t.y - 20, 200, 300); // Draw tree
  }
  if (treesPlanted >= 15) {
    textSize(30);
    fill("green");
    text("You saved the forest! \nPress SPACE to return.", 300, 210);
  }
}

function initializeTrash() {
  trash = [];
  for (let i = 0; i < 10; i++) {
    trash.push({ 
      x: random(50, width - 50), // Random x  
      y: random(50, height - 50), // Random y
      ySpeed: random(0.5, 1), // Random speed up and down 
      offset: random(TWO_PI) }); // Random continuing
  }
}

function initializeGoo() {
  goo = [];
  for (let i = 0; i < 5; i++) {
    goo.push({ 
      x: random(50, width - 50), // Random x
      y: random(50, height - 50), // Random y
      size: random(50, 100) }); // Random size 
  }
}
