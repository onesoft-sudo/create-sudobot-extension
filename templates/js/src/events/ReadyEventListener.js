const { default: EventListener } = require("@sudobot/core/EventListener");

module.exports = class ReadyEventListener extends EventListener {
    name = "ready";

    async execute() {
        console.log("Your new shiny extension is ready!");
    }
};
