import EventListener from "@sudobot/core/EventListener";
import { Events } from "@sudobot/types/ClientEvents";

export default class ReadyEventListener extends EventListener<Events.Ready> {
    public readonly name = Events.Ready;

    async execute() {
        console.log("Your new shiny extension is ready!");
    }
}
