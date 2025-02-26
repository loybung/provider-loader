import { Provider, Type } from "@nestjs/common";
import * as glob from "glob";
import * as path from "path";

export interface ProvideHandlersOptions {
	folderPath: string;
	filePattern: string;
	logProviders?: boolean;
}

export async function provideHandlers(
	options: ProvideHandlersOptions
): Promise<Provider[]> {
	const { folderPath, filePattern, logProviders = true } = options;
	const files = glob.sync(`${folderPath}/**/${filePattern}.{js,ts}`);
	const providers: Type<any>[] = [];

	for (const file of files) {
		try {
			const module = await import(path.resolve(file));
			for (const exportedKey of Object.keys(module)) {
				const exported = module[exportedKey];
				if (typeof exported === "function" && exported.prototype) {
					providers.push(exported as Type<any>);
				}
			}
		} catch (error) {
			console.error(`Failed to load file ${file}:`, error);
		}
	}

	if (logProviders) {
		console.log(
			"Providers loaded:",
			providers.map((p) => p.name)
		);
	}
	return providers;
}
