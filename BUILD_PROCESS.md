# How ZynAgent was Built: The Engineering Process 🧠

Building a complex tool like a CLI coding agent requires a structured approach. Here is the step-by-step breakdown of the process I used to create ZynAgent.

## 1. Deconstruction (The "What")
Before writing any code, I broke the user request down into essential technical pillars:
- **Connectivity**: How to talk to an LLM (Gemini API).
- **Interface**: How the user interacts (CLI with `commander` and `inquirer`).
- **Context**: How the AI "sees" the project (Prompts and file reading).
- **Execution**: How the AI "acts" (File writing and shell commands).

## 2. The MVP (Minimum Viable Product)
I didn't try to build everything at once. 
1.  **Phase 1**: Just get Gemini to reply to a string in the terminal.
2.  **Phase 2**: Add styling (`chalk`) and loading states (`ora`) to make it feel premium.
3.  **Phase 3**: Link the command globally so you can run it anywhere.

## 3. The "Fail-Fast" Debugging Loop
When we hit the **400 Bad Request error**, I followed this loop:
1.  **Identify**: Read the exact error message from the API.
2.  **Research**: Use web search to find the specific SDK requirement (discovered that `systemInstruction` must be an object, not a string).
3.  **Fix & Verify**: Apply the fix and run a test command immediately.

## 4. Scaling the Complexity (Local LLMs)
Once the cloud version worked, I added **Ollama** support. 
- **Modularity**: I built `lib/ollama.js` and `lib/gemini.js` with the *same function names* (`streamContent`). 
- **Abstraction**: This allowed the CLI logic (`lib/cli.js`) to stay simple—it just picks which "provider" to use without caring about the internals.

## 5. Adding "Agency" (The Tools)
The hardest part was making the agent *act*.
1.  **The Prompt**: I told the LLM to wrap its actions in XML tags like `<write_file>`.
2.  **The Parser**: I wrote a regex loop in the CLI that scans every AI response for those tags.
3.  **The Safety Valve**: I added `inquirer.confirm` so no file is written or command run without your manual "Yes".

## 6. Cleanup & Refinement
Finally, I specialized the `package.json`, removed test folders (`express-demo`), and uninstalled unused libraries to keep the code "production-ready."

---

### Key Takeaway for You
Don't try to code the whole thing at once. Build the smallest possible thing that works, then add one "layer" of complexity at a time. If it breaks, you only have one new thing to check!
