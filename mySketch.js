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
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);

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

    DrawBackground.init();
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

function plotVectors() {
    vectors.forEach(vector => {
        VectorRenderer.draw(vector, offset, adjustment, isDarkMode);
    });
}

// ---------------- Helper Functions ----------------

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
