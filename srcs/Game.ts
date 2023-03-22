import { Socket } from "socket.io-client";
import { ft_pong } from "./ft_pong";
import { Bind, User, GameSettings, Setup } from "./interfaces/ft_pong.interface";



export const defaultGameSettings: GameSettings = {
    bind: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        ready: " "
    },
    width: 0,
    height: 0,
    user: null,
}

export class Game {
    private socketGame: Socket;
    private socketMatchmaking: Socket;
    private pong: ft_pong;
    private gameFind: Array<string>;
    private ctx: CanvasRenderingContext2D;
    private gameSettings: GameSettings;


    constructor(socket: Socket, socketGame: Socket, user: User, ctx: CanvasRenderingContext2D) {
        this.socketGame = socket;
        this.socketMatchmaking = socketGame;
        this.ctx = ctx;
        this.pong = null;
        this.gameSettings = defaultGameSettings;
        this.gameSettings.user = user;
        this.gameSettings.width = ctx.canvas.width;
        this.gameSettings.height = ctx.canvas.height;
        this.socketGame.on("game:search", this.handleSearchGame.bind(this));
        this.socketGame.on("game:join", this.handleJoinGame.bind(this));

    }

    public searchGame() {
        this.socketGame.emit("game:search");
    }

    public getSearchGame() {
        return this.gameFind;
    }

    public joinGame(gameId: string) {
        this.socketGame.emit("game:join", gameId);
    }

    public leaveGame() {
        if (this.pong) {
            this.socketGame.emit("game:leave");
            this.pong.stop();
            delete this.pong;
        }
    }

    public spectateGame(id: string) {
        this.socketGame.emit("game:spec", id);
    }

    private handleJoinGame(gameSetup: Setup) {
        console.log(gameSetup);
        if (!this.pong) {
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup);
        }
        else {
            this.pong.stop();
            delete this.pong;
            this.pong = new ft_pong(this.socketGame, this.gameSettings, this.ctx, gameSetup);
        }
    }

    private handleSearchGame(ids: string[]) {
        this.gameFind = ids;
        if (ids.length > 0) {
            this.joinGame(ids[0]);
        }
    }

    public joinQueue() {
        this.socketMatchmaking.emit("matchmaking:join");
        this.socketMatchmaking.on("matchmaking:foundMatch", this.handleQueue.bind(this));
        console.log("join");
    }

    public leaveQueue() {
        this.socketMatchmaking.emit("matchmaking:leave");
        this.socketMatchmaking.off("matchmaking:foundMatch");
    }

    private handleQueue(id: string) {
        console.log(id);
        this.joinGame(id);
    }
}