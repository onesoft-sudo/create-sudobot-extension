const { default: Event } = require("@sudobot/core/Event");

module.exports = class ReadyEvent extends Event {
    name = "ready";

    async execute() {
        console.log("Your new shiny extension is ready!");
    }
};
