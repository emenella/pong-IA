import { Paddle } from "./Paddle";

export interface bind {
    up: string;
    down: string;
    left: string;
    right: string;
}

export class Player {
    protected name: string;
    public score: number;
    public paddle: Paddle;
    private bind: bind;

    constructor(name: string, bind: bind, paddle: Paddle) {
        this.name = name;
        this.score = 0;
        this.paddle = paddle;
        this.bind = bind;
    }
    
    //set key bindings
    public setKeyBindings(): void {
        //TODO
        document.addEventListener("keydown", (event) => {
            const canvas = document.getElementById("pong") as HTMLCanvasElement;
            const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
            switch (event.key) {
                case this.bind.up:
                    this.paddle.moveUp(ctx);
                    break;
                case this.bind.down:
                    this.paddle.moveDown(ctx);
                    break;
                case this.bind.left:
                    this.paddle.moveLeft(ctx);
                    break;
                case this.bind.right:
                    this.paddle.moveRight(ctx);
                    break;
                default:
                    break;
            }
        }, false);
    }

    public unbindKeys(): void {
        document.removeEventListener("keydown", (event) => {
            const canvas = document.getElementById("pong") as HTMLCanvasElement;
            const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
            switch (event.key) {
                case this.bind.up:
                    this.paddle.moveUp(ctx);
                    break;
                case this.bind.down:
                    this.paddle.moveDown(ctx);
                    break;
                case this.bind.left:
                    this.paddle.moveLeft(ctx);
                    break;
                case this.bind.right:
                    this.paddle.moveRight(ctx);
                    break;
                default:
                    break;
            }
        }, false);
    }

    public getScore(): number {
        return this.score;
    }

    public getName(): string {
        return this.name;
    }
}