import { Game } from "./Game";
import { User } from "./interfaces/ft_pong.interface";
import { Socket, io } from "socket.io-client";


let userid = 0;
let gameId : string;
let game: Game;
let isQueue = false;

async function getMe(token: string): Promise<User> {
    let user = await fetch("https://localhost/api/users/me", {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    }
    });
    return await user.json() as User;
}

async function login(id: number): Promise<string> {
    let json = { user: {id: id} };
    let user = await fetch("https://localhost/api/auth/admin", {
    method: "POST",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
    });
    return await user.json().then( s => s.access_token) as string;
}

async function getUser(id: number, token: string): Promise<User> {
    let user = await fetch("https://localhost/api/users/id/?id=" + id, {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    }
});
return await user.json() as User;
}


async function init(): Promise<void> {
    let canva = document.getElementById("pong") as HTMLCanvasElement;
    let ctx = canva.getContext("2d");
    console.log(userid);
    const token = await login(userid);
    console.log(await getUser(userid, token));
    const user = await getMe(token);
    console.log(user);
    let socketGame: Socket = io("https://localhost/game", { extraHeaders: { Authorization: token } });
    let socketMatchmaking: Socket = io("https://localhost/matchmaking", { extraHeaders: { Authorization: token } });
    game = new Game(socketGame, socketMatchmaking ,user, ctx);
}

async function join(): Promise<void> {
    game.joinGame(gameId);
}

async function leave(): Promise<void> {
    game.leaveGame();
}

async function Spectate(): Promise<void> {
    game.spectateGame(gameId);
}

async function searchGame(): Promise<void> {
    game.searchGame();
    await setTimeout(() => {
        console.log(game.getSearchGame());
    }  , 1000);
}

async function matchmaking(): Promise<void> {
    if (isQueue) {
        game.leaveQueue();
        isQueue = false;
        document.getElementById("matchmaking").innerHTML = "Matchmaking";
    } else {
        game.joinQueue();
        isQueue = true;
        document.getElementById("matchmaking").innerHTML = "Leave Queue";
    }
}

// execute main when press button with id join and get id user and id room
document.getElementById("join").addEventListener("click", join);
document.getElementById("leave").addEventListener("click", leave);
document.getElementById("spectate").addEventListener("click", Spectate);
document.getElementById("search").addEventListener("click", searchGame);
document.getElementById("login").addEventListener("click", init);
document.getElementById("matchmaking").addEventListener("click", matchmaking);
document.getElementById("user").addEventListener("change", (event) => {
    userid = parseInt((<HTMLInputElement>event.target).value);
});
document.getElementById("gameId").addEventListener("change", (event) => {
    gameId = (<HTMLInputElement>event.target).value;
});