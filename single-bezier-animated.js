// Variable Definitions
let c1 = null;
let c2 = null;
let a1 = null;
let a2 = null;
let lastDrawPoint = null;
let bpoints = [];
let drawnSegments = [];

function getStarting(){
    // The starting position must be off-screen.
    // RETURNS: 2D Vector Object

    let startingX = -5;
    let startingY = random(
        (windowHeight * 0.50),
        (windowHeight * 0.75)
    );

    return createVector(startingX, startingY);
}

function getEnding(){
    // The starting position must be off-screen.
    // RETURNS: 2D Vector Object

    let startingX = windowWidth + 5;
    let startingY = random(
        (windowHeight * 0.15),
        (windowHeight * 0.50)
    );

    return createVector(startingX, startingY);
}

// P5.js Functions
function setup() {

    // Canvas Configuration
    createCanvas(windowWidth, windowHeight - 4);
    noStroke();
    noFill();

    // Bezier Curve Configuration
    c1 = getStarting(); // First Control Point
    c2 = getEnding(); // Second Control Point
    a1 = createVector( random(0, windowWidth), random(0, windowHeight) ); // First Anchor Point
    a2 = createVector( random(0, windowWidth), random(0, windowHeight) ); // Second Anchor Point

    bezier(
        c1['x'], c1['y'], // Control Point
        a1['x'], a1['y'], // Anchor Point
        a2['x'], a2['y'], // Anchor Point
        c2['x'], c2['y']  // Control Point
    );

    // Locate points along the Bezier Curve
    let steps = 120;
    for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = bezierPoint(c1['x'], a1['x'], a2['x'], c2['x'], t);
        let y = bezierPoint(c1['y'], a1['y'], a2['y'], c2['y'], t);
        bpoints.push(createVector(x,y))
    }
    bpoints.reverse();
    strokeWeight(4);
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);

    const primaryColor = rootStyles.getPropertyValue("--primary-c");
    stroke(primaryColor);
}

function draw() {
    clear();

    // Redraw: Any already-drawn lines.
    drawnSegments.forEach(s => {
        line(s[0]['x'], s[0]['y'], s[1]['x'], s[1]['y']);
    });

    //FIXME: Will try to draw a line between a point and null values.
    if (lastDrawPoint) {
        t1 = lastDrawPoint;
    } else {
        t1 = bpoints.pop();
    }
    t2 = bpoints.pop();

    line(t1['x'], t1['y'], t2['x'], t2['y']);

    drawnSegments.push([t1,t2]);
    lastDrawPoint = t2;

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 4);
    redraw()
}
// Create a p5.js sketch
new p5();