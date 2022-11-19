export class Paddle
{
    //Position of paddle
    private posX: number;
    private posY: number;

    // size of paddle
    private width: number;
    private length: number;
    private color: string;
    
    // speed of paddle
    private veloX: number;
    private veloY: number;

    constructor(_color: string ,_width: number, _length: number, _startX: number, _startY: number, _speedX: number, _speedY: number)
    {
        this.posX = _startX;
        this.posY = _startY;
        this.width = _width;
        this.length = _length;
        this.veloX = _speedX;
        this.veloY = _speedY;
        this.color = _color;
        console.log("Paddle created: " + this.posX + " " + this.posY + " " + this.width + " " + this.length + " " + this.veloX + " " + this.veloY);
    }

    public moveUp(ctx: CanvasRenderingContext2D): void
    {
        console.log("Move up " + this.posY + " " + this.veloY);
        if (this.posY - this.veloY >= 0)
            this.posY -= this.veloY;
    }

    public moveDown(ctx: CanvasRenderingContext2D): void
    {
        console.log("Move down " + this.posY + " " + this.veloY);
        if (this.posY + this.veloY <= ctx.canvas.height - this.length)
            this.posY += this.veloY;
    }

    public moveLeft(ctx: CanvasRenderingContext2D): void
    {
        if (this.posX - this.veloX >= 0)
            this.posX -= this.veloX;
    }

    public moveRight(ctx: CanvasRenderingContext2D): void
    {
        if (this.posX + this.veloX <= ctx.canvas.width - this.width)
            this.posX += this.veloX;
    }

    public draw(ctx :CanvasRenderingContext2D): void
    {
        // Draw paddle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width/2, this.length);
        ctx.fillRect(this.posX, this.posY, -this.width/2, this.length);
    }

    public getPosX(): number
    {
        return this.posX;
    }

    public getPosY(): number
    {
        return this.posY;
    }

    public getWidth(): number
    {
        return this.width;
    }

    public getLength(): number
    {
        return this.length;
    }
}