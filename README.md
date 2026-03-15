# ZynAgent CLI 🚀

A powerful AI coding agent built with Node.js and Google's Gemini 2.0 Flash API. ZynAgent helps you write, review, and chat about code directly from your terminal.

## Features

- 💬 **Interactive Chat**: Real-time streaming conversation with an AI coding expert.
- 🏗️ **Project Building**: Automatically create and write files for entire projects.
- 🐚 **Command Execution**: Execute shell commands to run, test, and debug code (requires user approval).
- 🔍 **Code Review**: Analyze your local files for bugs, security issues, and performance improvements.
- 🎨 **Visual Feedback**: Styled output with `chalk` and interactive spinners with `ora`.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd cdoeagent
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### AI Provider Configuration
You can use either Google's Gemini API or a local Ollama server.

1.  **Set up your AI Provider in `.env`**:
    ```env
    # Choose 'gemini' or 'ollama'
    AI_PROVIDER=gemini 
    ```

#### Gemini Setup
- Get an API key from [Google AI Studio](https://aistudio.google.com/).
- Set `GEMINI_API_KEY` in your `.env`.

#### Ollama (Local) Setup
1.  **Install Ollama**: Download from [ollama.com](https://ollama.com/).
2.  **Pull a model**:
    ```bash
    ollama pull mistral
    ```
3.  **Update `.env`**:
    ```env
    AI_PROVIDER=ollama
    OLLAMA_MODEL=mistral
    ```

## Usage

### Start an Interactive Chat
```bash
zyn-agent chat
```

### Generate Code
```bash
zyn-agent code "Create a simple Express server with a single GET route"
```

### Review a File
```bash
zyn-agent review path/to/your/file.js
```

## Built With

- [Google Generative AI SDK](https://github.com/google-gemini/generative-ai-js)
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [Chalk](https://github.com/chalk/chalk)
- [Ora](https://github.com/sindresorhus/ora)
# zyn_agent_cli
