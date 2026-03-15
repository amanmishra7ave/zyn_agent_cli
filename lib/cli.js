import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import * as gemini from "./gemini.js";
import * as ollama from "./ollama.js";
import { SYSTEM_PROMPTS } from "./prompts.js";
import { writeFileContent, executeCommand } from "./utils.js";
import dotenv from "dotenv";

dotenv.config();

const getProvider = () => {
    return process.env.AI_PROVIDER === "ollama" ? ollama : gemini;
};

async function handleTools(content) {
    const writeRegex = /<write_file path="([^"]+)">([\s\S]*?)<\/write_file>/g;
    const executeRegex = /<execute_command>([\s\S]*?)<\/execute_command>/g;

    let match;
    let anyToolUsed = false;


    while ((match = writeRegex.exec(content)) !== null) {
        anyToolUsed = true;
        const filePath = match[1];
        const fileContent = match[2].trim();

        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: chalk.yellow(`Agent wants to write to ${filePath}. Allow?`),
                default: true,
            },
        ]);

        if (confirm) {
            try {
                await writeFileContent(filePath, fileContent);
                console.log(chalk.green(`✓ Successfully wrote to ${filePath}`));
            } catch (error) {
                console.error(chalk.red(`✗ Error writing to ${filePath}: ${error.message}`));
            }
        }
    }


    while ((match = executeRegex.exec(content)) !== null) {
        anyToolUsed = true;
        const command = match[1].trim();

        const { confirm } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: chalk.red.bold(`Agent wants to execute command: "${command}". Allow?`),
                default: false,
            },
        ]);

        if (confirm) {
            const spinner = ora("Executing command...").start();
            try {
                const result = await executeCommand(command);
                spinner.stop();
                if (result.stdout) {
                    console.log(chalk.dim("\nStdout:"));
                    console.log(result.stdout);
                }
                if (result.stderr) {
                    console.log(chalk.red("\nStderr:"));
                    console.log(result.stderr);
                }
                if (result.exitCode && result.exitCode !== 0) {
                    console.log(chalk.red(`\nCommand exited with code ${result.exitCode}`));
                }
            } catch (error) {
                spinner.fail(`Command failed: ${error.message}`);
            }
        }
    }

    return anyToolUsed;
}

export async function startChat() {
    console.log(chalk.cyan.bold("\nWelcome to ZynAgent Chat! 🚀"));
    console.log(chalk.dim(`Using provider: ${process.env.AI_PROVIDER || "gemini"}\n`));
    console.log(chalk.dim("Type 'exit' to quit.\n"));

    const provider = getProvider();

    while (true) {
        const { message } = await inquirer.prompt([
            {
                type: "input",
                name: "message",
                message: chalk.green("You:"),
            },
        ]);

        if (!message || message.toLowerCase() === "exit" || message.toLowerCase() === "quit") {
            console.log(chalk.yellow("Goodbye!"));
            break;
        }

        const spinner = ora("ZynAgent is thinking...").start();

        try {
            console.log(chalk.blue.bold("ZynAgent:"));

            let fullResponse = "";
            const stream = provider.streamContent(message, SYSTEM_PROMPTS.CODING_AGENT);
            spinner.stop();

            for await (const chunk of stream) {
                process.stdout.write(chunk);
                fullResponse += chunk;
            }
            console.log("\n");


            await handleTools(fullResponse);

        } catch (error) {
            spinner.fail("Error generating response.");
            console.error(chalk.red(error.message));
        }
    }
}

export async function askQuestion(question, promptKey = "CODING_AGENT") {
    const spinner = ora("Processing...").start();
    const provider = getProvider();
    try {
        let fullResponse = "";
        const stream = provider.streamContent(question, SYSTEM_PROMPTS[promptKey]);
        spinner.stop();

        console.log(chalk.blue.bold("\nZynAgent:"));
        for await (const chunk of stream) {
            process.stdout.write(chunk);
            fullResponse += chunk;
        }
        console.log("\n");

        if (promptKey === "CODING_AGENT") {
            await handleTools(fullResponse);
        }
    } catch (error) {
        spinner.fail("Failed to process request.");
        console.error(chalk.red(error.message));
    }
}
