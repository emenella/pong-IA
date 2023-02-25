import { Player, bind } from "./player";
import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Socket } from "socket.io-client";
import { PlayerClient } from "./playerClient";
import { PlayerRemote } from "./playerRemote";
import { User } from "./main";

export interface general {
    id: string;
    ScoreWin: number;
    Overtime: boolean;
    OvertimeScore: number;
    height: number;
    width: number;
}

export interface player {
    id: number;
    color: string;
    length: number;
    width: number;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
}

export interface ball {
    color: string;
    radius: number;
    speed: number;
}

export class GameInfo
{
    player0: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        };
    }
    player1: {
        score: number;
        paddle: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            width: number;
            height: number;
        }
    }
    ball: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        radius: number;
    }
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
    private lastFrame: number;
    private firstFrame: number;

    private user: User;
    private bind: bind;
    private opponent: User;

    private ratioX: number;
    private ratioY: number;

    private socket: Socket;

    constructor(_socket: Socket, user: User, bind: bind, opponent: User)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById("pong");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        // get setup from server
        this.socket = _socket;
        this.user = user;
        this.opponent = opponent;
        this.bind = bind;
        this.socket.on("game:setup", this.setupGame);
        this.socket.emit("game:setup");
    }

    public setupGame = (setup: Setup) => {
        this.setup = setup;
        console.log(this.setup);
        this.ratioX = this.canvas.width / this.setup.general.width;
        this.ratioY = this.canvas.height / this.setup.general.height;
        console.log(this.ratioX, this.ratioY);
        if (this.user.id == this.setup.player0.id)
        {
            this.player0 = new PlayerClient(this.setup.player0.id, this.bind, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.user.username);
            this.player0.setKeyBindings();
            this.player1 = new PlayerRemote(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.opponent.username);
        }
        else
        {
            this.player0 = new PlayerRemote(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.opponent.username);
            this.player1 = new PlayerClient(this.setup.player1.id, this.bind, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.user.username);
            this.player1.setKeyBindings();
        }
        this.startSpeed = this.setup.ball.speed * this.ratioX;
        this.ball = new Ball(this.setup.ball.radius * this.ratioY, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.startSpeed, 0, this.setup.ball.color);
        this.isLive = false;
        this.isFinish = false;
        this.socket.on("game:info", this.handleGameUpdate);
        this.socket.on("game:finish", this.handleGameFinish);
        this.socket.on("game:lives", this.handleLive);
        this.socket.emit("game:info");
        this.draw();
    }

    private draw(): void
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.ctx.canvas.width / 2, 0, 1, this.ctx.canvas.height)
        this.ball.draw(this.ctx);
        this.showScore();
        this.player0.paddle.draw(this.ctx);
        this.player1.paddle.draw(this.ctx);
        if(!this.isLive)
        {
            this.ctx.fillStyle = "white";
            this.ctx.font = "30px Arial";
            this.ctx.fillText("Press space to start", this.canvas.width / 2 - 150, this.canvas.height / 2 - 150);
        }
    }

    private loop(): void
    {
        if (!this.isFinish)
        {
            if (this.isLive)	
            {
                console.log("FPS: " + 1000 / (Date.now() - this.firstFrame));
                this.firstFrame = Date.now();
                this.ball.move(this.ctx, this.player0, this.player1);
                this.player0.paddle.move(this.ctx);
                this.player1.paddle.move(this.ctx);
                this.checkGoal();
                this.draw();
                this.lastFrame = Date.now();
                console.log("time to rending: " + (this.lastFrame - this.firstFrame) + "ms")
            }
            setTimeout(() => this.loop(), 1000/60);
        }
    }

    protected checkGoal(): void
    {
        if (this.ball.getPosX() + this.ball.getRadius() >= this.canvas.width)
        {
            this.player0.score++;
            this.player0.unbindKeys();
            this.player1.unbindKeys();
            this.player0.paddle.setPos(10, this.ctx.canvas.height / 2);
            this.player1.paddle.setPos(this.ctx.canvas.width - 10 - this.player1.paddle.getWidth(), this.ctx.canvas.height / 2);
            this.ball.setPos(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.setup.ball.speed, 0);
            this.isLive = false;
            console.log(this.player0.getScore() + "-" + this.player1.getScore());
        }
        else if (this.ball.getPosX() - this.ball.getRadius() <= 0)
        {
                this.player1.score++;
                this.player0.unbindKeys();
                this.player1.unbindKeys();
                this.player0.paddle.setPos(10, this.ctx.canvas.height / 2);
                this.player1.paddle.setPos(this.ctx.canvas.width - 10 - this.player1.paddle.getWidth(), this.ctx.canvas.height / 2);
                this.ball.setPos(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, -this.setup.ball.speed, 0);
                this.isLive = false;
                console.log(this.player0.getScore() + "-" + this.player1.getScore());
        }
    }

    public showScore(): void
    {
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(this.player0.getName() + " : " + this.player0.getScore(), 10, 30);
        this.ctx.fillText(this.player1.getName() + " : " + this.player1.getScore(), this.canvas.width - 150, 30);
        if (this.setup.general.Overtime && this.setup.general.ScoreWin - 1 == this.player0.score && this.setup.general.ScoreWin - 1 == this.player1.score)
        {
            this.setup.general.ScoreWin += this.setup.general.OvertimeScore;
        }
        else if (this.player1.getScore() >= this.setup.general.ScoreWin)
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

    public screenFinish(): void
    {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Finish", this.canvas.width / 2 - 150, this.canvas.height / 2 - 150);
    }

    public startGame(): void
    {
        this.loop();
    }

    private handleGameUpdate = (data: GameInfo): void => {
        console.log(this);
        this.player0.paddle.setPos(data.player0.paddle.x * this.ratioX, data.player0.paddle.y * this.ratioY);
        this.player1.paddle.setPos(data.player1.paddle.x * this.ratioX, data.player1.paddle.y * this.ratioY);
        this.ball.setPos(data.ball.x * this.ratioX, data.ball.y * this.ratioY, data.ball.dx * this.ratioX, data.ball.dy * this.ratioY);
        this.player0.score = data.player0.score;
        this.player1.score = data.player1.score;
        this.draw();
    }

    private handleLive = (): void => {
        this.isLive = true;
        this.player0.setKeyBindings();
        this.player1.setKeyBindings();
        this.draw();
    }

    private handleGameFinish = (): void => {
        console.log("game finish");
        this.isFinish = true;
        this.screenFinish();
    }

}