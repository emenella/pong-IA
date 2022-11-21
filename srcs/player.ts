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

    public setKeyBindings(): void {
        document.addEventListener("keydown", (event) => { this.handleKeyDown(event) }, false);
        document.addEventListener("keyup", (event) => { this.handleKeyUp(event) }, false);
    }

    public unbindKeys(): void {
        document.removeEventListener("keydown", () => this.handleKeyDown, false);
        document.removeEventListener("keyup", () => this.handleKeyUp, false);
    }

    public handleKeyDown(event: KeyboardEvent): void
    {
        switch (event.key) {
            case this.bind.up:
                this.paddle.keyDownUp();
                break;
            case this.bind.down:
                this.paddle.keyDownDown();
                break;
            case this.bind.left:
                this.paddle.keyDownLeft();
                break;
            case this.bind.right:
                this.paddle.keyDownRight();
                break;
            default:
                break;
        }
    }
    
    public handleKeyUp(event: KeyboardEvent): void
    {
        switch (event.key) {
            case this.bind.up:
                this.paddle.keyUpY();
                break;
            case this.bind.down:
                this.paddle.keyUpY();
                break;
            case this.bind.left:
                this.paddle.keyUpX();
                break;
            case this.bind.right:
                this.paddle.keyUpX();
                break;
            default:
                break;
        }
    }

    public getScore(): number {
        return this.score;
    }

    public getName(): string {
        return this.name;
    }
}