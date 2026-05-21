import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: path.join(__dirname, 'src/components/MdsvexLayout.svelte')
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions)],
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md')) ? undefined : true
	},
	kit: { adapter: adapter() }
};

export default config;
