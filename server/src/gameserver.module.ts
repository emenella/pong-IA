import { Module } from "@nestjs/common";
import { GameController } from "./gameserver.controller";
import { GameService } from "./gameserver.service";

@Module(
{
    controllers: [GameController],
    providers: [GameService],
})
export class GameModule {}