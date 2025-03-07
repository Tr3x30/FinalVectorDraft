function keyPressed() {
    if (!keyIsDown(CONTROL) && !keyIsDown(SHIFT) && !keyIsDown(91)) {
        promptForVectors();
    }
}

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