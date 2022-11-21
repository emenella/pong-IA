export class Paddle
{
    //Position of paddle
    private posX: number;
    private posY: number;

    // direction of paddle
    private dy: number;
    private dx: number;

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
        this.dx = 0;
        this.dy = 0;
        console.log("Paddle created: " + this.posX + " " + this.posY + " " + this.width + " " + this.length + " " + this.veloX + " " + this.veloY);
    }

    public keyDownUp(): void
    {
        this.dy = -this.veloY;
    }

    public keyDownDown(): void
    {
        this.dy = this.veloY;
    }

    public keyDownLeft(): void
    {
        this.dx = -this.veloX;
    }

    public keyDownRight(): void
    {
        this.dx = this.veloX;
    }

    public keyUpY(): void
    {
        this.dy = 0;
    }

    public keyUpX(): void
    {
        this.dx = 0;
    }

    public move(ctx: CanvasRenderingContext2D): void
    {
        this.posX = this.posX + this.dx;
        this.posY = this.posY + this.dy;
        this.draw(ctx);
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