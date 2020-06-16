const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Add a container where all the elements will be displayed
var cont = {
    width: window.innerWidth,
    height: window.innerHeight
}

canvas.width = cont.width;
canvas.height = cont.height;

// Objects
var asteroids = [];
var stars = [];

// Variables
var variables = {
    // Asteroids
    astCount: 30,
    astMinSpeed: -1,
    astMaxSpeed: 1,
    astMoveY: false,
    astSize: 3,
    astSizeVar: 1,
    astColorHue: 20,
    astColorSat: 0,
    astColorLig: 30,
    astColorLigVar: 15,

    // Stars
    starLight: 70,
    starLightVar: 10,
    starCount: 100,
    starSize: 0.5,
    blinkStars: true,

    // Planet
    planetColor: "rgb(224, 82, 0)",
    planetRadius: 50,
    planetX: Math.random(), // Distance in the x axis in a range between 0 and 1
    planetY: 0.45, // Distance in the y axis in a range between 0 and 1

    // Planet in orbit
    orbitAngle: Math.random(),
    orbitPlanetR: 5,
    orbitPlanetColor: 'blue',
    orbitSpeed: 0.00045,

    // Smaller planet orbit
    orbitAngle2: Math.random(),
    orbitPlanetR2: 3,
    orbitPlanetColor2: 'gray',
    orbitSpeed2: 0.0006
}

function init() {

    // Create asteroids
    for (let i = 0; i < variables.astCount; i++) {

        // Generate asteroids with random position
        var light = getRandomB(variables.astColorLig+variables.astColorLigVar, variables.astColorLig-variables.astColorLigVar)

        // Change velocity on the Y axis according to settings
        var velY;
        if (variables.astMoveY) {
            velY = getRandomB(variables.astMinSpeed * 0.2 , variables.astMaxSpeed * 0.2);
        } else {
            velY = 0;
        }

        // Generate random asteroid
        var currentAsteroid = {
            x: Math.random() * cont.width,
            y: getRandomB(0.25,0.75) * cont.height,
            vx: -Math.abs(getRandomB(variables.astMinSpeed, variables.astMaxSpeed)),
            vy: velY,
            r: getRandomB(variables.astSize+variables.astSizeVar, variables.astSize-variables.astSizeVar),
            color: "hsl("+ variables.astColorHue + ", "+ variables.astColorSat + "%, " + light + "%)"
        }
        
        // Add the asteroid to the array
        asteroids.push(currentAsteroid);
    }

    // Create stars in the background
    for (let i = 0; i < variables.starCount; i++) {
        var currentStar = {
            x: Math.random() * cont.width,
            y: Math.random() * cont.height,
            r: variables.starSize,
            brightness: getRandomB(variables.starLight+variables.starLightVar, variables.starLight-variables.starLightVar)
        }

        stars.push(currentStar);
    }

    // Start animation
    window.requestAnimationFrame(animate);

}

function animate() {

    // Clear image and fill the background with black
    ctx.clearRect(0, 0, cont.width, cont.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cont.width, cont.height)

    // Get planet coordinates
    var planetX = variables.planetX * cont.width;
    var planetY = variables.planetY * cont.height;
    const planetR = variables.planetRadius;

    // Orbiting Planets Path Calculations
    // Larger
    var lineX, lineY, lineX2, lineY2;

    if (variables.orbitAngle < 1) {
        variables.orbitAngle += variables.orbitSpeed;
    } else {
        variables.orbitAngle = 0;
    }

    var theta = variables.orbitAngle * (Math.PI * 2);

    lineX = Math.cos(theta) * planetR * 5;
    lineY = Math.sin(theta) * planetR * .65;

    const line = rotate(planetX, planetY, planetX + lineX, planetY + lineY, -14.3239);

    // Smaller
    if (variables.orbitAngle2 < 1) {
        variables.orbitAngle2 += variables.orbitSpeed2;
    } else {
        variables.orbitAngle2 = 0;
    }

    var theta2 = variables.orbitAngle2 * (Math.PI * 2);

    lineX2 = Math.cos(theta2) * planetR * 2;
    lineY2 = Math.sin(theta2) * planetR * .25;

    const line2 = rotate(planetX, planetY, planetX + lineX2, planetY + lineY2, -22.9183);

    // Render stars
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Blink
        var size = star.r

        if (Math.random() > 0.999 && variables.blinkStars) {
            ctx.fillStyle = "hsl(0,0%,100%)";
            size += 0.5;
        } else {
            ctx.fillStyle = "hsl(0,0%," + star.brightness + "%)";
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Render asteroids behind planet animation
    for (let i = 0; i < (asteroids.length/2); i++) {
        const thisAst = asteroids[i];
        drawAsteroid(thisAst);
    }

    // Draw planet orbits behind
    ctx.beginPath();
    ctx.ellipse(planetX, planetY, planetR * 5, planetR * .65, .25, 0, Math.PI, true);
    ctx.strokeStyle = "hsl(0,0%,40%)"; 
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(planetX, planetY, planetR * 2, planetR * .25, .4, 0, Math.PI, true);
    ctx.strokeStyle = "hsl(0,0%,40%)"; 
    ctx.stroke();

    // Draw Orbiting Planets Behind
    if (theta >= Math.PI) {
    ctx.beginPath();
    ctx.arc(line[0], line[1], variables.orbitPlanetR, 0, Math.PI * 2);
    ctx.fillStyle = variables.orbitPlanetColor;
    ctx.fill();
    }

    if (theta2 >= Math.PI) {
        ctx.beginPath();
        ctx.arc(line2[0], line2[1], variables.orbitPlanetR2, 0, Math.PI * 2);
        ctx.fillStyle = variables.orbitPlanetColor2;
        ctx.fill();
    }

    // Draw planet
    ctx.fillStyle = variables.planetColor;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetR, 0, 2 * Math.PI);
    ctx.fill();

    // Draw planet orbits in front
    ctx.beginPath();
    ctx.ellipse(planetX, planetY, planetR * 5, planetR * .65, .25, 0, Math.PI);
    ctx.strokeStyle = "hsl(0,0%,40%)"; 
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(planetX, planetY, planetR * 2, planetR * .25, .4, 0, Math.PI);
    ctx.strokeStyle = "hsl(0,0%,40%)"; 
    ctx.stroke();

    // Draw Orbiting Planets in front of the planet
    if (theta < Math.PI) {
        ctx.beginPath();
        ctx.arc(line[0], line[1], variables.orbitPlanetR, 0, Math.PI * 2);
        ctx.fillStyle = variables.orbitPlanetColor;
        ctx.fill();
    }

    if (theta2 < Math.PI) {
        ctx.beginPath();
        ctx.arc(line2[0], line2[1], variables.orbitPlanetR2, 0, Math.PI * 2);
        ctx.fillStyle = variables.orbitPlanetColor2;
        ctx.fill();
    }

    // Render asteroids in front of the planet
    for (let i = asteroids.length/2; i < asteroids.length; i++) {
        const thisAst = asteroids[i];
        drawAsteroid(thisAst);
    }

    // Update planet's position
    if (planetX < (planetR * -5.5)) {
        planetX = cont.width + planetR*5.5;
    } else if (planetX > (cont.width + planetR*5.5)) {
        planetX = planetR * -5.5;
    }
    variables.planetX = planetX / cont.width - 0.00005;

    window.requestAnimationFrame(animate);
}

init();

// Draw asteroids function
// (Necessary to easily draw asteroids in front and behind
// the planet)
function drawAsteroid(thisAst) {
    if (thisAst.x < (thisAst.r * -1)) {
        thisAst.x = cont.width + thisAst.r;
    } else if (thisAst.x > (cont.width + thisAst.r)) {
        thisAst.x = thisAst.r * -1;
    }

    if (thisAst.y < (thisAst.r * -1)) {
        thisAst.y = cont.height + thisAst.r;
    } else if (thisAst.y > (cont.height + thisAst.r)) {
        thisAst.y = thisAst.r * -1;
    }

    thisAst.x = thisAst.x + thisAst.vx;
    thisAst.y = thisAst.y + thisAst.vy;

    ctx.fillStyle = thisAst.color;
    ctx.beginPath();
    ctx.arc(thisAst.x, thisAst.y, thisAst.r, 0, 2 * Math.PI);
    ctx.fill();
}

// Functions to calculate stuff

function getRandomB(min, max) {
    return Math.random() * (max - min) + min;
  }

  // https://stackoverflow.com/a/17411276
  function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}