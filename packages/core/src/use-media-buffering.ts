import type React from 'react';
import {useEffect} from 'react';
import {useBufferState} from './use-buffer-state';

export const useMediaBuffering = ({
	element,
	shouldBuffer,
	isPremounting,
}: {
	element: React.RefObject<HTMLVideoElement | HTMLAudioElement>;
	shouldBuffer: boolean;
	isPremounting: boolean;
}) => {
	const buffer = useBufferState();

	useEffect(() => {
		let cleanupFns: Function[] = [];

		const {current} = element;
		if (!current) {
			return;
		}

		if (!shouldBuffer) {
			return;
		}

		if (isPremounting) {
			return;
		}

		const cleanup = () => {
			cleanupFns.forEach((fn) => fn());
			cleanupFns = [];
		};

		const onWaiting = () => {
			const {unblock} = buffer.delayPlayback();
			const onCanPlay = () => {
				cleanup();
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				init();
			};

			const onError = () => {
				cleanup();
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				init();
			};

			current.addEventListener('canplay', onCanPlay, {
				once: true,
			});
			cleanupFns.push(() => {
				current.removeEventListener('canplay', onCanPlay);
			});

			current.addEventListener('error', onError, {
				once: true,
			});
			cleanupFns.push(() => {
				current.removeEventListener('error', onError);
			});
			cleanupFns.push(() => {
				unblock();
			});
		};

		const init = () => {
			if (current.readyState < current.HAVE_FUTURE_DATA) {
				onWaiting();
			} else {
				current.addEventListener('waiting', onWaiting);
				cleanupFns.push(() => {
					current.removeEventListener('waiting', onWaiting);
				});
			}
		};

		init();

		return () => {
			cleanup();
		};
	}, [buffer, element, isPremounting, shouldBuffer]);
};
