import { readFile, writeFile } from "node:fs/promises";
import { createContext, runInContext } from "node:vm";
;
const dataFilePath = "dist/data/senior-rankings.js";
const outputFilePath = "dist/data/senior-rankings.json";
const sandbox = {};
async function main() {
    // Read the content of your data file
    const code = await readFile(dataFilePath, "utf8");
    // Create a sandbox object to run the code
    // Run the code in the sandbox
    const context = createContext(sandbox);
    runInContext(code, context);
    // After execution, 'rankings' should be in sandbox
    if (!sandbox.rankings) {
        console.error('"rankings" is not defined.');
        process.exit(1);
    }
    // Write the data to JSON file
    await writeFile(outputFilePath, JSON.stringify(sandbox.rankings, null, 0), "utf8");
    process.stdout.write("✅ Data conversion completed successfully.\n");
}
main().catch(console.error);
