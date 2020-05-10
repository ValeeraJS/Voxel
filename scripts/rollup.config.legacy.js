import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

export default {
	input: 'src/index.ts',
	plugins: [
		json(),
		typescript({
			tsconfig: './tsconfig.legacy.json'
		})
	],
	output: [
		{
			format: 'umd',
			name: 'Fetcher',
			file: 'build/Fetcher.legacy.js',
			sourcemap: true,
			indent: '\t',
			globals: {
				"@valeera/eventdispatcher": "EventDispatcher",
				"@valeera/fetcher": "Fetcher",
				"@valeera/mathx": "Mathx",
				"@valeera/tree": "Tree",
				"three": "THREE"
			}
		},
		{
			format: 'es',
			file: 'build/Fetcher.legacy.module.js',
			sourcemap: true,
			indent: '\t',
			globals: {
				"@valeera/eventdispatcher": "EventDispatcher",
				"@valeera/fetcher": "Fetcher",
				"@valeera/mathx": "Mathx",
				"@valeera/tree": "Tree",
				"three": "THREE"
			}
		}
	],
	external: ["@valeera/eventdispatcher", "@valeera/fetcher", "@valeera/mathx", "@valeera/tree", "three"]
};
