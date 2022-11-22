import { Player } from "./player";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";

export class easyAI extends Player
{
    private ball: Ball;

    constructor(name: string, paddle: Paddle, ballconst: Ball)
    {
        super("Easy Bot", null, paddle);
        this.ball = ballconst;
    }

    public moove()
    {
        if (Math.round(this.paddle.getPosY()) > Math.round(this.ball.getPosY()))
        {
            console.log(this.getName() + " move Up");
            this.paddle.keyUpY();
            this.paddle.keyDownUp();
        }
        else if (Math.round(this.paddle.getPosY()) < Math.round(this.ball.getPosY()))
        {
            console.log(this.getName() + " move Down");
            this.paddle.keyUpY();
            this.paddle.keyDownDown();
        }
        else
        {
            this.paddle.keyUpY();
        }
    }
}
