import { ft_pong } from "./ft_pong";
import { bind } from "./player";
import { io, Socket } from "socket.io-client";


let userid = 0;
let opponentid = 0;

export interface User {
    id: number;
    username: string;
    isProfileComplete: boolean;
    elo: number;
}

const bindUser: bind = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    ready: " "	
}

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
    let user = await fetch("https://localhost/api/users/?id=" + id, {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
    }
});
return await user.json() as User;
}


async function main(): Promise<void> {
    console.log(userid);
    console.log(opponentid);
    let token: string = await login(userid);
    console.log(token);
    let opposant: User = await getUser(opponentid, token);
    let user: User = await getMe(token);
    console.log(user);
    let socket: Socket = io("https://localhost/game", { extraHeaders: { Authorization: token } });
    socket.on("game:search", (_ids :Array<string>) => {
        socket.emit("game:join", _ids[0]);
    });
    socket.on("game:join", () => {
        console.log("join");
        const game = new ft_pong(socket, user, bindUser);
    });
    socket.emit("game:search");
}

// execute main when press button with id join and get id user and id room
document.getElementById("join").addEventListener("click", main);
document.getElementById("user").addEventListener("change", (event) => {
    userid = parseInt((<HTMLInputElement>event.target).value);
});
document.getElementById("opposant").addEventListener("change", (event) => {
    opponentid = parseInt((<HTMLInputElement>event.target).value);
});