import { Controller, Get } from "@nestjs/common";
import { Server } from "socket.io";

@Controller('game')
export class GameController
{
    @Get('/')
    Hello(): string {
        return "hello"
    }
    @Get(':id')
    GameServer(): void 
    {

    }
}
