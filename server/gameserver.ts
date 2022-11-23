import { createServer, IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Ball } from "../srcs/Ball";
import { Player } from "../srcs/player";
import { Server as http } from "http";
import * as url from "url";
import * as fs from 'fs';

export interface general {
    ScoreWin: number;
    Overtime: boolean;
}

export interface player {
    name: string;
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

export interface server
{
    url: string;
}

export interface Setup {
    general: general;
    player0: player;
    player1: player;
    ball: ball;
    server: server;

}

export class Gameserver
{
    private io: Server;
    private httpServer: http;
    private setup: Setup;
    private player0: Player;
    private player1: Player;
    private ball: Ball;
    private client: string;
    private html: string;

    constructor (_setup: Setup, _id: number)
    {
        this.setup = _setup;
        this.httpServer = createServer();
        this.io = new Server(this.httpServer, {});
        this.httpServer.on('request', (req, res) => this.requestHandler);
        this.loadFiles();
        this.httpServer.listen(8080);
    }

    private async loadFiles(): Promise<void> 
    {
        await fs.readFile("./index.html", "utf8", (err, data) => {
            if (err)
                console.log(err);
            this.html = data;
        });
        await fs.readFile("dist/app-bundle.js", "utf8", (err, data) => {
            if (err)
                console.log(err);
            this.client = data;
            console.log(this);
        })
    }

    private requestHandler(req: IncomingMessage, res: ServerResponse): void
    {
        const path = url.parse(req.url).pathname;
        console.log(req);
        if (req.method === "GET")
        {
            if (path === "index.html")
            {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(this.html);
                res.end();
            }
            else if (path === "app-bundle.js")
            {
                res.writeHead(200, {"Content-Type": "text/json"});
                res.write(this.client);
                res.end();
            }
            else
            {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.write("404 Error");
                res.end();
            }
        }
    }
}

const setup: Setup = {
    general: {
        ScoreWin: 5,
        Overtime: false
    },
    player0: {
        name: "Player 0",
        color: "red",
        length: 100,
        width: 10,
        speedX: 0,
        speedY: 5
    },
    player1: {
        name: "Player 1",
        color: "blue",
        length: 100,
        width: 10,
        speedX: 0,
        speedY: 5
    },
    ball: {
        color: "green",
        radius: 10,
        speed: 10
    },
    server: { url: undefined }
};

const game = new Gameserver(setup, 0);