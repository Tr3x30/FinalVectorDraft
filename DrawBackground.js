class DrawBackground {
	static init() {
		this.drawScaleBars();
		this.drawAxes();
		this.drawLabels();
	}

	static drawScaleBars() {
		let scaleInterval = getDynamicScaleInterval();
		['x', 'y'].forEach(axis => this.drawScaleBar(axis, scaleInterval));
	}

	static drawAxes() {
		stroke(isDarkMode ? 255 : 0);
		line(-width / 2, offset.y, width / 2, offset.y); // X-axis
		line(offset.x, -height / 2, offset.x, height / 2); // Y-axis
	}

	static drawLabels() {
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

	static drawScaleBar(axis, scaleInterval) {
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

				textAlign(CENTER);
				let textX1 = (axis === 'x') ? screenPos + offset.x + width / 230 : -width / 300 + offset.x;
				let textX2 = (axis === 'x') ? -screenPos + offset.x + width / 230 : -width / 300 + offset.x;
				textAlign(RIGHT);
				let textY1 = (axis === 'x') ? height / 35 + offset.y : screenPos + offset.y + height / 110;
				let textY2 = (axis === 'x') ? height / 35 + offset.y : -screenPos + offset.y + height / 110;

				text(label, textX1, textY1);
				text(negLabel, textX2, textY2);
			}
		}
	}
}

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