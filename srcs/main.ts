import { ft_pong, Setup } from "./ft_pong";

const setup: Setup = {
    general: {
        ScoreWin: 5,
        Overtime: false
    },
    player0: {
        name: "Player 0",
        bind: {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        },
        color: "red",
        length: 100,
        width: 10,
        speedX: 0,
        speedY: 5
    },
    player1: {
        name: "Player 1",
        bind: {
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight"
        },
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
const game = new ft_pong(setup);
game.startGame();