// Configuration Constants
const BASE_SCALE_INTERVAL = 120;
const MIN_ADJUSTMENT = 1 * Math.pow(10, -0.4);
const MAX_ADJUSTMENT = 1 * Math.pow(10, 2.7);
const SCROLL_SENSITIVITY = 0.01;

// Global Variables
let table, vectors = [], adjustment = 10;
let showScaleNumbers = true, isDarkMode = true;
let offset, userInputVectors;
let toggleButton, darkModeButton, vectorButton;

function preload() {
    table = loadTable('vectors.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth * 0.999, windowHeight * 0.999);
    angleMode(DEGREES);
    offset = createVector(0, 0);
    setupUI();
}

function draw() {
    if (mouseIsPressed) {
        offset.x -= pmouseX - mouseX;
        offset.y -= pmouseY - mouseY;
    }

    updateColors();
    translate(width / 2, height / 2);

    drawAxes();
    drawLabels();
    drawScaleBars();
    plotVectors();
    displayMousePositionPopup();
}

// ---------------- UI Setup ----------------
function setupUI() {
    toggleButton = createButton('Toggle Scale Numbers');
    toggleButton.position(width / 154, height / 65);
    toggleButton.mousePressed(() => showScaleNumbers = !showScaleNumbers);

    darkModeButton = createButton('Toggle Dark Mode');
    darkModeButton.position(width / 154, height / 16);
    darkModeButton.mousePressed(() => {
        isDarkMode = !isDarkMode;
        updateColors();
    });

    vectorButton = createButton('Enter Vectors');
    vectorButton.position(width / 154, height / 9);
    vectorButton.mousePressed(promptForVectors);
}

// ---------------- Core Functions ----------------
function promptForVectors() {
    let input = prompt("Enter vector numbers (e.g., 54,23,26,39):");
    if (!input) return;

    vectors = [];
    console.clear();
    userInputVectors = input.split(/\D+/).map(Number);

    let currentX = 0, currentY = 0;
    userInputVectors.forEach(number => {
        let row = table.findRow(number.toString(), 'Number');
        if (row) {
            let magnitude = row.getNum('Magnitude');
            let direction = row.getString('Angle');

            let vector = new VectorObject(number, magnitude, direction);
            vector.updatePosition(currentX, currentY);
            vectors.push(vector);

            currentX = vector.endX;
            currentY = vector.endY;

            console.log(`Vector ${number}: ${vector.magnitude}m at ${vector.direction}`);
        }
    });

    let resultantData = VectorMath.calculateResultant(vectors);
    let resultantVector = new VectorObject("", resultantData.magnitude, resultantData.direction);

    vectors.push(resultantVector);
    console.log(`Resultant Vector: ${resultantData.magnitude}m [${resultantData.direction}]`);
}

function plotVectors() {
    vectors.forEach(vector => {
        VectorRenderer.draw(vector, offset, adjustment, isDarkMode);
    });
}

// ---------------- Scale & Grid ----------------
function drawScaleBars() {
    let scaleInterval = getDynamicScaleInterval();
    ['x', 'y'].forEach(axis => drawScaleBar(axis, scaleInterval));
}

function drawAxes() {
    stroke(isDarkMode ? 255 : 0);
    line(-width / 2, offset.y, width / 2, offset.y); // X-axis
    line(offset.x, -height / 2, offset.x, height / 2); // Y-axis
}

function drawLabels() {
    textSize(16);
    textAlign(CENTER, CENTER);
    fill(isDarkMode ? 255 : 0);

    textAlign(LEFT, TOP);
    text('0°N', offset.x + width / 154, -height / 2 + height / 65);
    textAlign(LEFT, BOTTOM);
    text('180°S', offset.x + width / 154, height / 2 - height / 65);
    textAlign(RIGHT, BOTTOM);
    text('90°E', width / 2 - width / 154, offset.y - height / 65);
    textAlign(LEFT, BOTTOM);
    text('270°W', -width / 2 + width / 154, offset.y - height / 65);
}

function drawScaleBar(axis, scaleInterval) {
    let length = (axis === 'x') ? width : height;
    let maxLineLength = Math.max(width, height) * 2;
    let end = Math.ceil(length / scaleInterval) * scaleInterval / 2 + Math.abs(offset.x || offset.y) * scaleInterval;
    
    stroke(isDarkMode ? 255 : 0);
    for (let i = 0; i <= end; i += scaleInterval) {
        if (i < 0.1 && i > -0.1) continue;

        stroke(127);
        let screenPos = axis === 'x' ? i : -i;

        let x1 = (axis === 'x') ? screenPos : -maxLineLength;
        let x2 = (axis === 'x') ? screenPos : maxLineLength;
        let y1 = (axis === 'x') ? -maxLineLength : screenPos;
        let y2 = (axis === 'x') ? maxLineLength : screenPos;
			
        line(x1 + offset.x, y1 + offset.y, x2 + offset.x, y2 + offset.y);
        line(-x1 + offset.x, -y1 + offset.y, -x2 + offset.x, -y2 + offset.y);

        if (showScaleNumbers) {
            textSize(15);
            fill(isDarkMode ? 255 : 0);
            noStroke();

            let label = (i / adjustment).toFixed(0);
            let negLabel = "-" + label;

						textAlign(CENTER)
            let textX1 = (axis === 'x') ? screenPos + offset.x+width/230: -width / 300 + offset.x;
            let textX2 = (axis === 'x') ? -screenPos + offset.x+width/230 : -width / 300 + offset.x;
            textAlign(RIGHT)
						let textY1 = (axis === 'x') ? height / 35 + offset.y : screenPos + offset.y+height/110;
            let textY2 = (axis === 'x') ? height / 35 + offset.y : -screenPos + offset.y +height/110;

            text(label, textX1, textY1);
            text(negLabel, textX2, textY2);
        }
    }
}

// ---------------- Helper Functions ----------------
function getDynamicScaleInterval() {
    return getNearestStepSize(BASE_SCALE_INTERVAL / adjustment) * adjustment;
}

function getNearestStepSize(value) {
    let logScale = 1;
    while (value < 10) {
        value *= 10;
        logScale /= 10;
    }
    while (value >= 10) {
        value /= 10;
        logScale *= 10;
    }
    return (value <= 2 ? 1 : (value <= 5 ? 2 : 5)) * logScale;
}

function updateColors() {
    background(isDarkMode ? 30 : 255);
    stroke(isDarkMode ? 255 : 0);
    fill(isDarkMode ? 255 : 0);
}

// ---------------- Event Listeners ----------------
function mouseWheel(event) {
	let mouseBefore = createVector(
		(mouseX - width / 2 - offset.x) / adjustment,
		(mouseY - height / 2 - offset.y) / adjustment
	);

	let scaleFactor = Math.pow(1.1, -event.delta * SCROLL_SENSITIVITY);
	let newAdjustment = adjustment * scaleFactor;

	newAdjustment = constrain(newAdjustment, MIN_ADJUSTMENT, MAX_ADJUSTMENT);

	offset.x += (mouseBefore.x * adjustment - mouseBefore.x * newAdjustment);
	offset.y += (mouseBefore.y * adjustment - mouseBefore.y * newAdjustment);

	adjustment = newAdjustment;

	return false;
}

function keyPressed() {
    if (!keyIsDown(CONTROL) && !keyIsDown(SHIFT) && !keyIsDown(91)) {
        promptForVectors();
    }
}

function displayMousePositionPopup() {
	if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
		fill(isDarkMode ? 50 : 255);
		stroke(isDarkMode ? 255 : 0);
		let popupWidth = 100;
		let popupHeight = 20;
		let popupX = mouseX;
		let popupY = mouseY - popupHeight - 10;

		rect(popupX - width / 2, popupY - height / 2 + popupHeight / 2, popupWidth, popupHeight);
		fill(isDarkMode ? 255 : 0);
		textSize(12);
		textAlign(CENTER, CENTER);
		let textContent = `(${((mouseX - offset.x - width / 2) / adjustment).toFixed(2)}, ${((height / 2 - mouseY + offset.y) / adjustment).toFixed(2)})`;
		text(textContent, popupX - width / 2 + popupWidth / 2, popupY - height / 2 + popupHeight);
	}
}