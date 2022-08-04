import fs from 'fs';
import path from 'path';
import {expect, test} from 'vitest';
import {getLottieMetadata} from '../get-lottie-metadata';

test('Should be able to get Lottie metadata', () => {
	const file = fs.readFileSync(path.join(__dirname, 'example.json'), 'utf-8');

	const parsed = JSON.parse(file);

	expect(getLottieMetadata(parsed)).toEqual({
		durationInFrames: 90,
		durationInSeconds: 3.0030030030030037,
		fps: 29.9700012207031,
		height: 1080,
		width: 1920,
	});
});
