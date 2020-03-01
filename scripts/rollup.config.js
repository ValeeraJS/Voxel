import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

export default {
	input: 'src/index.ts',
	plugins: [
		json(),
		typescript({
			tsconfig: './tsconfig.json'
		})
	],
	output: [
		{
			format: 'umd',
			name: 'Voxel',
			file: 'build/Voxel.js',
			sourceMap: true,
			indent: '\t',
			external: ["@valeera/eventdispatcher", "@valeera/fetcher", "three"],
			globals: {
				"@valeera/eventdispatcher": "EventDispatcher",
				"@valeera/fetcher": "Fetcher",
				"three": "THREE"
			}
		},
		{
			format: 'es',
			file: 'build/Voxel.module.js',
			sourceMap: true,
			indent: '\t',
			external: ["@valeera/eventdispatcher", "@valeera/fetcher", "three"],
			globals: {
				"@valeera/eventdispatcher": "EventDispatcher",
				"@valeera/fetcher": "Fetcher",
				"three": "THREE"
			}
		}
	]
};
