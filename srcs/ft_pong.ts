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
    username: string;
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
    private player0: PlayerClient;
    private player1: PlayerClient;
    private ball: Ball;
    private isLive: boolean;
    private isFinish: boolean;
    private startSpeed: number;
    private setup: Setup;
    private precFrame: number;

    private user: User;
    private bind: bind;

    private ratioX: number;
    private ratioY: number;

    private socket: Socket;

    constructor(_socket: Socket, user: User, bind: bind)
    {
        this.canvas = <HTMLCanvasElement>document.getElementById("pong");
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        // get setup from server
        this.socket = _socket;
        this.user = user;
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
            this.player0 = new PlayerClient(this.setup.player0.id, this.bind, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.setup.player0.username);
            this.player0.setKeyBindings();
            this.player1 = new PlayerRemote(this.setup.player1.id, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.setup.player1.username);
        }
        else
        {
            this.player0 = new PlayerRemote(this.setup.player0.id, new Paddle(this.setup.player0.color, this.setup.player0.width * this.ratioX, this.setup.player0.length * this.ratioY, 10, this.ctx.canvas.height / 2, this.setup.player0.speedX * this.ratioX, this.setup.player0.speedY * this.ratioY), this.socket, this.setup.player0.username);
            this.player1 = new PlayerClient(this.setup.player1.id, this.bind, new Paddle(this.setup.player1.color, this.setup.player1.width * this.ratioX, this.setup.player1.length * this.ratioY, this.ctx.canvas.width - 10 - this.setup.player1.width, this.ctx.canvas.height / 2, this.setup.player1.speedX * this.ratioX, this.setup.player1.speedY * this.ratioY), this.socket, this.setup.player1.username);
            this.player1.setKeyBindings();
        }
        this.startSpeed = this.setup.ball.speed * this.ratioX;
        this.ball = new Ball(this.setup.ball.radius * this.ratioY, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2, this.startSpeed, 0, this.setup.ball.color);
        this.isLive = false;
        this.isFinish = false;
        this.socket.on("game:info", this.handleGameUpdate);
        this.socket.on("game:finish", this.handleGameFinish);
        this.socket.on("game:live", this.handleLive);
        this.socket.on("game:unready", this.handlerUnready);
        this.socket.emit("game:info");
        this.startGame();
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
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        console.log(this.player0.isReady, this.player1.isReady);
        if(!this.isLive && this.player0.isReady == this.player1.isReady)
        {
            this.ctx.fillText("Press space to start", this.canvas.width / 2 - 150, this.canvas.height / 2 - 150);
        }
        else if (!this.isLive)
        {
            this.ctx.fillText("Waiting for opponent", this.canvas.width / 2 - 150, this.canvas.height / 2 - 150);
        }
        if (this.isFinish)
        {
            this.screenFinish();
        }
    }

    private loop(): void
    {
        if (!this.isFinish)
        {
            this.precFrame = Date.now();
            if (this.isLive)	
            {
                this.ball.move(this.ctx, this.player0, this.player1);
                this.player0.paddle.move(this.ctx);
                this.player1.paddle.move(this.ctx);
            }
            this.draw();
            this.ctx.fillStyle = "white";
            this.ctx.fillText("FPS: " + 1000 / (Date.now() - this.precFrame), 10, 60);
            setTimeout(() => this.loop(), 1000/60);
        }
    }

    public showScore(): void
    {
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(this.player0.getName() + " : " + this.player0.getScore(), 10, 30);
        this.ctx.fillText(this.player1.getName() + " : " + this.player1.getScore(), this.canvas.width - 150, 30);
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
        this.player0.paddle.setPos(data.player0.paddle.x * this.ratioX, data.player0.paddle.y * this.ratioY);
        this.player1.paddle.setPos(data.player1.paddle.x * this.ratioX, data.player1.paddle.y * this.ratioY);
        this.ball.setPos(data.ball.x * this.ratioX, data.ball.y * this.ratioY, data.ball.dx * this.ratioX, data.ball.dy * this.ratioY);
        this.player0.score = data.player0.score;
        this.player1.score = data.player1.score;
        this.draw();
    }

    private handleLive = (): void => {
        this.isLive = true;
    }

    private handlerUnready = (id: number): void => {
        console.log("unready");
        this.isLive = false;
        const player = this.player0.id == id ? this.player0 : this.player1;
        player.isReady = false;
    }

    private handleGameFinish = (): void => {
        console.log("game finish");
        this.isFinish = true;
    }

}