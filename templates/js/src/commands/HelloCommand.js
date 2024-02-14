const { default: Command } = require("@sudobot/core/Command");

module.exports = class HelloCommand extends Command {
    name = "hello";

    async execute(message, context) {
        return {
            __reply: true,
            content: "Hello world!"
        };
    }
};
