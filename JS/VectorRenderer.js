let arrowSize = 15; // Size of the arrowhead

class VectorRenderer {
  static drawVectorLine(vector, offset, adjustment) {
    let startX = vector.startX * adjustment + offset.x;
    let startY = vector.startY * adjustment + offset.y;
    let endX = vector.endX * adjustment + offset.x;
    let endY = vector.endY * adjustment + offset.y;

    let angle = VectorMath.calculateAngle(vector.direction);

    push();
    strokeWeight(3);
    stroke(vector.number === "Resultant" ? 'blue' : 'red'); 
    line(startX, startY, endX - arrowSize * sin(angle), endY + arrowSize * cos(angle));
    pop();
  }

  static drawArrowheadAndLabel(vector, offset, adjustment) {
    let endX = vector.endX * adjustment + offset.x;
    let endY = vector.endY * adjustment + offset.y;
    let angle = VectorMath.calculateAngle(vector.direction);

    // Draw the label (if any)
    fill(vector.number === "Resultant" ? 'blue' : 'red');
    stroke(vector.number === "Resultant" ? 'blue' : 'red');
    textSize(15);
    textAlign(CENTER, CENTER);
    text(vector.number, endX, endY - windowHeight / 45);

    // Draw the arrowhead separately
    push();
    translate(endX, endY);
    rotate(angle);

    beginShape();
    vertex(0, 0);
    vertex(-arrowSize / 2.4, arrowSize);
    vertex(arrowSize / 2.4, arrowSize);
    endShape(CLOSE);

    pop();
  }
}

function plotVectors() {
  vectors.forEach(vector => {
    VectorRenderer.drawVectorLine(vector, offset, adjustment, isDarkMode);
  });

  vectors.forEach(vector => {
    VectorRenderer.drawArrowheadAndLabel(vector, offset, adjustment, isDarkMode);
  });
}