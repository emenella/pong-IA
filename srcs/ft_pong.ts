import { Player, bind } from "./player";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";

export interface general {
    ScoreWin: number;
    Overtime: boolean;
}

export interface player {
    name: string;
    bind: bind;
    color: string;
    length: number;
    width: number;
    speedX: number;
    speedY: number;
}

export interface ball {
    color: string;
    radius: number;
    speed: number;
}

export interface Setup {
    general: general;
    player0: player;
    player1: player;
    ball: ball;
}

export class ft_pong {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private player0: Player;
    private player1: Player;
    private ball: Ball;
    private isLive: boolean;
    private isFinish: boolean;
    private startSpeed: number;
    private setup: Setup;

    constructor(_setup: Setup)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById("pong");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        // TODO player and ball setup
        this.setup = _setup;
        this.startSpeed = this.setup.ball.speed;
        this.player0 = new Player(this.setup.player0.name, this.setup.player0.bind, new Paddle(this.setup.player0.color, this.setup.player0.width, this.setup.player0.length, 10, (this.ctx.canvas.height / 2) - this.setup.player0.length / 2, this.setup.player0.speedX, this.setup.player0.speedY));
        this.player1 = new Player(this.setup.player1.name, this.setup.player1.bind, new Paddle(this.setup.player1.color, this.setup.player1.width, this.setup.player1.length, this.ctx.canvas.width - 10, (this.ctx.canvas.height / 2) - this.setup.player1.length / 2, this.setup.player1.speedX, this.setup.player1.speedY));
        this.ball = new Ball(this.setup.ball.radius, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.startSpeed, 0, this.setup.ball.color);	
        this.isLive = false;
        this.isFinish = false;
        this.player0.setKeyBindings();
        this.player1.setKeyBindings();
        document.addEventListener("keydown", (event) => {
            if (event.key == " ")
            {
                this.isLive = true;
            }
        });
        this.draw();
    }

    private draw(): void
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.player0.paddle.draw(this.ctx);
        this.player1.paddle.draw(this.ctx);
        this.ball.draw(this.ctx);
        this.showScore();
        if(!this.isLive)
        {
            this.ctx.font = "30px Arial";
            this.ctx.fillText("Press space to start", this.canvas.width / 2 - 150, this.canvas.height / 2 - 150);
        }
    }

    private async loop(): Promise<void>
    {
        if (!this.isFinish)
        {
            if (this.isLive)	
            {
                this.ball.move(this.ctx, this.player0, this.player1);
                this.checkGoal();
                this.draw();
            }
        }
        await setTimeout(() => {}, 1000/144);
        window.requestAnimationFrame(() => this.loop());
    }

    private checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.canvas.width)
        {
            this.player0.score++;
            console.log(this.player0.getName() + " score");
            this.ball = new Ball(this.ball.getRadius(), this.ctx.canvas.width / 2, this.ctx.canvas.height / 2,this.startSpeed , 0, this.ball.getColor());
            this.isLive = false;
            this.player0.unbindKeys();
            this.player1.unbindKeys();
            console.log(this.player0.getScore() + "-" + this.player1.getScore());
            // this.showScore();
        }
        else
        {
            if (this.ball.getPosX() - this.ball.getRadius() <= 0)
            {
                this.player1.score++;
                console.log(this.player1.getName() + " score");
                this.ball = new Ball(this.ball.getRadius(), this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.startSpeed, 0, this.ball.getColor());
                this.isLive = false;
                this.player0.unbindKeys();
                this.player1.unbindKeys();
                console.log(this.player0.getScore() + "-" + this.player1.getScore());
                // this.showScore();
            }
        }
    }

    public showScore(): void
    {
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(this.player0.getName() + " : " + this.player0.getScore(), 10, 30);
        this.ctx.fillText(this.player1.getName() + " : " + this.player1.getScore(), this.canvas.width - 150, 30);
        if (this.player1.getScore() >= this.setup.general.ScoreWin)
        {
            this.ctx.fillText(this.player1.getName() + " win", this.canvas.width / 2 - 50, this.canvas.height / 2);
            console.log(this.player1.getName() + " win");
            this.isFinish = true;
        }
        else if (this.player0.getScore() >= this.setup.general.ScoreWin)
        {
            this.ctx.fillText(this.player0.getName() + " win", this.canvas.width / 2 - 50, this.canvas.height / 2);
            console.log(this.player0.getName() + " win");
            this.isFinish = true;
        }
    }

    public startGame(): void
    {
        window.requestAnimationFrame(() => this.loop());
    }

}