import { writeFile, mkdir } from "node:fs/promises";
import { createContext, runInContext } from "node:vm";
const RANKINGS_URL = "https://wca-seniors.org/data/Senior_Rankings.js";
const DESTINATION_DIR = "dist/data";
const outputFilePath = `${DESTINATION_DIR}/senior-rankings.json`;
async function fetchRankingsData() {
    const response = await fetch(RANKINGS_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch rankings data: ${response.status} ${response.statusText}`);
    }
    return response.text();
}
async function convertToJson(sourceCode) {
    const sandbox = {};
    const context = createContext(sandbox);
    runInContext(sourceCode, context);
    if (!sandbox.rankings) {
        throw new Error('"rankings" is not defined.');
    }
    return sandbox.rankings;
}
async function writeJsonToFile(data) {
    await mkdir(DESTINATION_DIR, { recursive: true });
    await writeFile(outputFilePath, JSON.stringify(data, null, 0), "utf8");
}
async function main() {
    const code = await fetchRankingsData();
    const data = await convertToJson(code);
    await writeJsonToFile(data);
    process.stdout.write("✅ Data conversion completed successfully.\n");
}
void main().catch((error) => {
    console.error(error);
    process.exit(1);
});
