class VectorMath {
	static calculateAngle(direction) {
		const baseAngles = {
			N: 0,
			E: 90,
			S: 180,
			W: 270
		};
		const firstLetter = direction.charAt(0);
		const middleAngle = parseFloat(direction.match(/(\d+\.?\d*)/)?. [0]) || 0;
		const lastLetter = direction.charAt(direction.length - 1);
		let baseAngle = baseAngles[firstLetter] || 0;

		if (firstLetter === 'N') baseAngle += (lastLetter === 'E' ? middleAngle : -middleAngle);
		else if (firstLetter === 'E') baseAngle += (lastLetter === 'S' ? middleAngle : -middleAngle);
		else if (firstLetter === 'S') baseAngle += (lastLetter === 'W' ? middleAngle : -middleAngle);
		else if (firstLetter === 'W') baseAngle += (lastLetter === 'N' ? middleAngle : -middleAngle);

		return (baseAngle + 360) % 360;
	}


	static calculateResultant(vectors) {
		let totalX = vectors.reduce((sum, v) => sum + v.xDisp, 0);
		console.log(totalX)
		let totalY = vectors.reduce((sum, v) => sum - v.yDisp, 0);
		console.log(totalY)
		// Calculate magnitude correctly
		let magnitude = sqrt(totalX * totalX + totalY * totalY);

		// Corrected angle calculation (atan2 correctly handles quadrants)
		let angle = (180 - (2 * atan((magnitude + totalY) / totalX)));

		let direction = VectorMath.calculateDirection(angle);
		return {
			magnitude,
			direction,
			xDisp: totalX,
			yDisp: totalY
		};
	}
	
	static calculateDirection(angle) {
	const baseDirections = ['N', 'E', 'S', 'W'];
	const baseAngles = [0, 90, 180, 270];

	// Find the closest base direction
	let closestBaseIndex = baseAngles.reduce((bestIndex, currAngle, i) =>
		Math.abs(currAngle - angle) < Math.abs(baseAngles[bestIndex] - angle) ? i : bestIndex, 0
	);

	let baseDir = baseDirections[closestBaseIndex];
	let baseAngle = baseAngles[closestBaseIndex];

	let diff = angle - baseAngle;
	if (diff === 0) return baseDir; // Exact match for N, E, S, W

	let secondaryDir = baseDirections[(closestBaseIndex + (diff > 0 ? 1 : -1) + 4) % 4];

	if (angle >= 315 && angle < 360) {
		baseDir = 'N';
		secondaryDir = 'W';
		diff = 360 - angle;
	}

	return `${baseDir}${round(Math.abs(diff), 3)}°${secondaryDir}`;
	}
}