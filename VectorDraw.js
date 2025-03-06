class VectorRenderer {
    static draw(vector, offset, adjustment, isDarkMode) {
        let startX = vector.startX * adjustment + offset.x;
        let startY = vector.startY * adjustment + offset.y;
        let endX = vector.endX * adjustment + offset.x;
        let endY = vector.endY * adjustment + offset.y;

			
				push();
				strokeWeight(3)
        // Draw the vector line
        stroke(vector.number === "" ? 'blue' : 'red');
        line(startX, startY, endX, endY);
				pop();
			
        // Calculate angle for the arrowhead (from the vector)
        let angle = VectorMath.calculateAngle(vector.direction);
        
			
			        // Draw the label (if any)
        fill(vector.number === "" ? 'blue' : 'red');
        textSize(15);
        textAlign(CENTER, CENTER);
        text(vector.number, endX, endY-windowHeight/45);
			
        // Draw the arrowhead
        let arrowSize = 15; // Size of the arrowhead
        push(); // Save the current drawing state
        translate(endX, endY); // Move to the end of the vector

        // Rotate by the vector's angle so the arrowhead points in the right direction
        rotate(angle);

        // Draw the arrowhead (equilateral triangle pointing in the direction of the vector)
        beginShape();
        vertex(0, 0); // Tip of the arrow (pointing forward)
        vertex(-arrowSize / 2.4, arrowSize); // Left side of the arrowhead
        vertex(arrowSize / 2.4, arrowSize); // Right side of the arrowhead
        endShape(CLOSE);

        pop(); // Restore the drawing state



    }
}
