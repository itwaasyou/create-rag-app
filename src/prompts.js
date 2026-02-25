
import { input, select } from "@inquirer/prompts";

export async function getOptions(initialProjectName, cliOptions = {}) {
    let projectName = initialProjectName;

    if (projectName) {
        if (!/^([a-z0-9\-\_\.]+)$/.test(projectName)) {
            console.log("⚠ Invalid project name provided via CLI.");
            projectName = null; // Force prompt
        }
    }

    if (!projectName) {
        projectName = await input({
            message: "What is your project named?",
            default: "my-rag-app",
            validate: (value) => {
                if (/^([a-z0-9\-\_\.]+)$/.test(value)) return true;
                return "Project name may only include letters, numbers, dashes, and underscores.";
            },
        });
    }

    let template = cliOptions.template;
    if (!template) {
        template = await select({
            message: "Choose template",
            choices: [
                { name: "Next.js", value: "nextjs-rag" },
                { name: "Express", value: "express-rag" },
                { name: "FastAPI", value: "fastapi-rag" },
            ],
            default: "nextjs-rag",
        });
    }

    let provider = cliOptions.provider;
    if (!provider) {
        provider = await select({
            message: "Choose LLM",
            choices: [
                { name: "OpenAI", value: "openai" },
                { name: "Gemini", value: "gemini" },
                { name: "Ollama", value: "ollama" },
            ],
            default: "openai",
        });
    }

    let vectorDb = cliOptions.vectorDb;
    if (!vectorDb) {
        vectorDb = await select({
            message: "Choose Vector DB",
            choices: [
                { name: "Chroma", value: "chroma" },
                { name: "Pinecone", value: "pinecone" },
                { name: "Weaviate", value: "weaviate" },
            ],
            default: "chroma",
        });
    }

    return {
        projectName,
        template,
        provider,
        vectorDb,
        ...cliOptions
    };
}
