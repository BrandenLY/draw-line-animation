//
// Variable Definitions
//
let prevWidth = Number(window.innerWidth);

let c1 = null;
let c2 = null;
let a1 = null;
let a2 = null;

let bpoints = [];
const pointCount = 120

let drawnSegments = [];
let lastDrawPoint = null;

//
// Helper Functions
//
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

function repositionPoints(widthAdjustment){
    
    // Relocate end control point to screen edge
    c2.add([widthAdjustment, 0, 0]);

    // Relocate anchor points
    const a1hpswr = a1.x / prevWidth; // a1 anchor point horizontal-position:screen-width ratio
    const newA1XPos = windowWidth * a1hpswr; // calculate new horizontal position based on initial ratio
    a1.x = newA1XPos

    const a2hpswr = a2.x / prevWidth; // a1 anchor point horizontal-position:screen-width ratio
    const newA2XPos = windowWidth * a2hpswr; // calculate new horizontal position based on initial ratio
    a2.x = newA2XPos
    
} 

//
// P5.js Implementations
//

p5.disableFriendlyErrors = true; // Turns off the parts of the Friendly Error System (FES) that impact performance.

function setup() { // A function that's called once when the sketch begins running.

    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    let primaryColor = rootStyles.getPropertyValue("--primary-c");
    if(primaryColor === ""){
        // Provide default color when style var isn't set.
        primaryColor = "#5ebec4"
    }

    // Canvas Configuration
    createCanvas(windowWidth, windowHeight - 4);
    stroke(primaryColor);
    strokeWeight(4);
    noFill();

    // Bezier Curve Initial Configuration
    c1 = getStarting(); // First Control Point
    c2 = getEnding(); // Second Control Point
    a1 = createVector( random(0, windowWidth), random(0, windowHeight) ); // First Anchor Point
    a2 = createVector( random(0, windowWidth), random(0, windowHeight) ); // Second Anchor Point

    // Calculate 
    for (let i = 0; i <= pointCount; i++) {
        let t = i / pointCount;
        let x = bezierPoint(c1['x'], a1['x'], a2['x'], c2['x'], t);
        let y = bezierPoint(c1['y'], a1['y'], a2['y'], c2['y'], t);
        bpoints.push(createVector(x,y))
    }

}

function draw() { // A function that's called repeatedly while the sketch runs.

    // Initial animation is drawing
    if (isLooping()){

        if (lastDrawPoint) {
            t1 = lastDrawPoint;
        } 
        else {
            t1 = bpoints.shift();
        }

        t2 = bpoints.shift();
    
        if (t2 !== undefined){
            line(t1['x'], t1['y'], t2['x'], t2['y']);
            drawnSegments.push([t1,t2]);
            lastDrawPoint = t2;
        }
        else {            
            noLoop() // Stop Animation Loop
        }

    }
    else {
        bezier(
            c1['x'], c1['y'], // Control Point
            a1['x'], a1['y'], // Anchor Point
            a2['x'], a2['y'], // Anchor Point
            c2['x'], c2['y']  // Control Point
        );
    }

}

function windowResized() { // A function that's called when the browser window is resized.

    // Calculate difference in screenWidth
    const screenWidthDifference = windowWidth - prevWidth;

    // Trigger bezier redraw
    resizeCanvas(windowWidth, windowHeight);
    clear(); repositionPoints(screenWidthDifference); redraw();

    prevWidth = Number(windowWidth) // Track any screen size changes
}

// Create a p5.js sketch
new p5();
