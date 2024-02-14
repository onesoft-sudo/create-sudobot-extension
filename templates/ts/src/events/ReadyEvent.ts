import { Event } from '@sudobot/core/Event';

export default class ReadyEvent extends Event {
    public readonly name = "ready";

    async execute() {
        console.log("Your new shiny extension is ready!");
    }
}
