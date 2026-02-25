import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { Command } from "commander";
import { getOptions } from "./prompts.js";
import { checkDir, copyTemplate, installDependencies, initGit } from "./utils.js";

const packageJson = JSON.parse(
    await fs.readFile(new URL("../package.json", import.meta.url))
);

export async function main() {
    console.log(chalk.bold.cyan("\n🚀 Welcome to Create RAG App!\n"));

    let projectName;

    const program = new Command(packageJson.name)
        .version(packageJson.version)
        .arguments('[project-directory]')
        .usage(`${chalk.green('[project-directory]')} [options]`)
        .option('-t, --template <template>', 'Specify the template (nextjs-rag, express-rag, fastapi-rag)')
        .option('-p, --provider <provider>', 'Specify the LLM provider (openai, ollama, gemini)')
        .option('-v, --vector-db <vectorDb>', 'Specify the Vector Database (chroma, pinecone, weaviate)')
        .option('--skip-install', 'Skip dependency installation')
        .option('--no-git', 'Skip git initialization')
        .action((name) => {
            projectName = name;
        })
        .parse(process.argv);

    const cliOptions = program.opts();
    const options = await getOptions(projectName, cliOptions);
    const projectPath = path.resolve(process.cwd(), options.projectName);

    console.log(`\nCreating a new RAG app in: ${chalk.green(projectPath)}\n`);

    // Ensure directory doesn't exist
    checkDir(projectPath);

    // Copy template
    // We need to map the template option to a folder name
    // The 'value' in prompts.js choices is 'nextjs-rag', so ensure that folder exists in templates/
    const templateName = options.template;
    await copyTemplate(templateName, projectPath);

    // Configure Environment Variables
    const envExamplePath = path.join(projectPath, ".env.example");
    const envPath = path.join(projectPath, ".env");

    if (await fs.pathExists(envExamplePath)) {
        await fs.copy(envExamplePath, envPath);
        console.log(chalk.green("✔ Created .env file from example"));

        // Inject selected provider config
        let envContent = await fs.readFile(envPath, "utf-8");
        envContent += `\n# Auto-generated config\n`;
        envContent += `LLM_PROVIDER=${options.provider}\n`;
        envContent += `VECTOR_DB=${options.vectorDb}\n`;
        await fs.writeFile(envPath, envContent);
    }

    // Update package.json based on selections
    const pkgPath = path.join(projectPath, "package.json");
    if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);

        // Inject Pinecone dependencies if selected
        if (options.vectorDb === "pinecone") {
            pkg.dependencies = {
                ...pkg.dependencies,
                "@pinecone-database/pinecone": "^4.1.0",
                "@langchain/pinecone": "^0.1.3"
            };
        }

        // Inject Weaviate dependencies if selected
        if (options.vectorDb === "weaviate") {
            pkg.dependencies = {
                ...pkg.dependencies,
                "weaviate-ts-client": "^2.2.0",
                "@langchain/weaviate": "^0.0.3"
            };
        }

        // Inject Gemini dependencies if selected
        if (options.provider === "gemini") {
            pkg.dependencies["@langchain/google-genai"] = "^0.1.3";
        }

        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // Install Dependencies (user requested automatic installation)
    let installed = false;
    if (!options.skipInstall) {
        installed = await installDependencies(projectPath);
    } else {
        console.log(chalk.yellow("\n⚠ Skipping dependency installation."));
    }

    // Initialize Git
    if (options.git) {
        await initGit(projectPath);
    }

    // Final Success Message
    if (installed) {
        console.log(chalk.bold.green("\n🎉 Success! Your RAG app is ready."));
    } else if (options.skipInstall) {
        console.log(chalk.bold.green("\n🎉 Project created successfully."));
    } else {
        console.log(chalk.bold.yellow("\n⚠️  Project created, but dependencies failed to install."));
    }
    console.log(chalk.yellow("\nNext steps:"));
    console.log(chalk.cyan(`  cd ${options.projectName}`));
    console.log(chalk.cyan(`  npm run dev`));
    console.log("");
}
