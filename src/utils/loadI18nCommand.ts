import * as fs from "fs";
import * as path from "path";

export function loadI18nCommand(directoryPath: string): Record<string, any> {
	const result: Record<string, any> = {};

	try {
		const files = fs.readdirSync(directoryPath);
		for (const file of files) {
			if (file.endsWith(".json")) {
				const filePath = path.join(directoryPath, file);
				const data = require(filePath);
				const langKey = file.replace(".json", "");
				result[langKey] = { commands: data.commands };
			}
		}
		return result;
	} catch (error) {
		console.error("Error loading i18n files:", error);
		throw error;
	}
}
