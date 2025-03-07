class VectorObject {
    constructor(number, magnitude, direction) {
        this.number = number;
        this.magnitude = magnitude;
        this.direction = direction;
        this.angle = VectorMath.calculateAngle(direction);
        this.xDisp = magnitude * sin(this.angle);
        this.yDisp = -magnitude * cos(this.angle);
        this.startX = 0;
        this.startY = 0;
        this.endX = this.startX + this.xDisp;
        this.endY = this.startY + this.yDisp;
    }

    updatePosition(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = this.startX + this.xDisp;
        this.endY = this.startY + this.yDisp;
    }
}
