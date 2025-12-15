import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type IntlayerConfig, Locales } from 'intlayer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: IntlayerConfig = {
	internationalization: {
		defaultLocale: Locales.ENGLISH,
		locales: [Locales.ENGLISH, Locales.SPANISH],
	},
	content: {
		baseDir: __dirname.replace(/\\/g, '/'),
	},
};

export default config;
