#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { startChat, askQuestion } from "../lib/cli.js";
import { readFileContent, formatCodeBlock } from "../lib/utils.js";

const program = new Command();

program
    .name("zyn-agent")
    .description("A powerful AI coding agent CLI powered by Gemini 2.0 Flash")
    .version("1.0.0");

program
    .command("chat")
    .description("Start an interactive chat session with ZynAgent")
    .action(() => {
        startChat();
    });

program
    .command("code")
    .description("Generate code based on a prompt")
    .argument("<prompt>", "The description of the code to generate")
    .action((prompt) => {
        askQuestion(prompt, "CODING_AGENT");
    });

program
    .command("review")
    .description("Review a file for bugs and improvements")
    .argument("<file>", "Path to the file to review")
    .action(async (file) => {
        try {
            const content = await readFileContent(file);
            const prompt = `Please review the following code from file "${file}":\n\n${formatCodeBlock(content)}`;
            askQuestion(prompt, "REVIEWER");
        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}`));
        }
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
