import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function readFileContent(filePath) {
    try {
        const absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath);

        if (!(await fs.pathExists(absolutePath))) {
            throw new Error(`File not found: ${filePath}`);
        }

        return await fs.readFile(absolutePath, "utf-8");
    } catch (error) {
        throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
}

export async function writeFileContent(filePath, content) {
    try {
        const absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath);

        await fs.ensureDir(path.dirname(absolutePath));
        await fs.writeFile(absolutePath, content, "utf-8");
        return absolutePath;
    } catch (error) {
        throw new Error(`Error writing to file ${filePath}: ${error.message}`);
    }
}

export async function executeCommand(command) {
    try {
        const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });
        return { stdout, stderr };
    } catch (error) {
        return {
            stdout: error.stdout || "",
            stderr: error.stderr || error.message,
            exitCode: error.code || 1
        };
    }
}

export function formatCodeBlock(code, language = "javascript") {
    return `\`\`\`${language}\n${code}\n\`\`\``;
}
