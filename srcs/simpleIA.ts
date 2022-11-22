import { Player } from "./player";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";

export class easyAI extends Player
{
    private ball: Ball;

    constructor(name: string, paddle: Paddle, _ball: Ball)
    {
        super("Easy Bot", null, paddle);
        this.ball = _ball
    }

    public moove()
    {
        if (this.paddle.getPosY() > this.ball.getPosY())
        {
            this.paddle.keyDownUp();
            this.paddle.keyUpY();
        }
        else
        {
            this.paddle.keyDownUp();
            this.paddle.keyUpY();
        }
    }
}
