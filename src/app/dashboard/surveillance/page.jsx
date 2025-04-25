'use client';
import { useState, useEffect } from 'react';
import LiveStreamPlayer from './LiveStreamPlayer';
import useCameras from '@/hooks/useCameras';

// Helper to test stream availability
const testStreamUrl = async (url) => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
		const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
		clearTimeout(timeoutId);
		return res.ok;
	} catch {
		return false;
	}
};

export default function Surveillance() {
	const [row, setRows] = useState(1);
	const [col, setCols] = useState(1);
	const { cameras: cameraInfo, loading: camsLoading, error: camsError } = useCameras();

	const [jetsonLink, setJetsonLink] = useState(null);
	const [checkingStream, setCheckingStream] = useState(true);

	useEffect(() => {
		const chooseBestStream = async () => {
			if (!camsLoading && cameraInfo?.length) {
				const JetsonNano = cameraInfo.find(obj => obj.camera_Name === "Jetson1");

				if (JetsonNano?.local_ip && JetsonNano?.public_ip) {
					const publicUrl = `http://${JetsonNano.public_ip}:8080/hls/stream/index.m3u8`;
					const localUrl = `http://${JetsonNano.local_ip}:8080/hls/stream/index.m3u8`;

					const isPublicAvailable = await testStreamUrl(publicUrl);
					const bestUrl = isPublicAvailable ? publicUrl : localUrl;

					setJetsonLink(bestUrl);
				}
			}
			setCheckingStream(false);
		};

		chooseBestStream();
	}, [cameraInfo, camsLoading]);

	// if (camsLoading || checkingStream) return <p>Loading cameras...</p>;
	// if (camsError) return <p>Error loading cameras</p>;
	// if (!jetsonLink) return <p>No available stream found for Jetson1.</p>;

	const totalGrids = row * col;
	const demoCameras = [jetsonLink];

	const [cameras, setCameras] = useState(demoCameras.slice(0, totalGrids));

	function updateCamera(gridIndex, newCameraSrc) {
		setCameras(prevCameras => {
			const updated = [...prevCameras];
			updated[gridIndex] = newCameraSrc;
			return updated;
		});
	}

	function CameraSelection({ gridIndex }) {
		const [isDropdownOpen, setDropdownOpen] = useState(false);

		return (
			<div className="absolute top-2 left-2">
				<button onClick={() => setDropdownOpen(!isDropdownOpen)} className="text-white text-2xl">⚙</button>
				{isDropdownOpen && (
					<div className="absolute z-50 text-white top-10 left-2 bg-primary opacity-90 rounded-md shadow-lg">
						<div className="flex flex-col">
							<div className="flex">
								{demoCameras.slice(0, 5).map((cam, i) => (
									<button
										key={i}
										onClick={() => {
											updateCamera(gridIndex, cam);
											setDropdownOpen(false);
										}}
										className="p-2 hover:bg-blue-600"
									>
										Cam {i + 1}
									</button>
								))}
							</div>
							<div className="flex">
								{demoCameras.slice(5).map((cam, i) => (
									<button
										key={i}
										onClick={() => {
											updateCamera(gridIndex, cam);
											setDropdownOpen(false);
										}}
										className="p-2 hover:bg-blue-600"
									>
										Cam {i + 6}
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	function SurvCamera({ src, gridIndex }) {
		if (!src) return <div className="bg-white flex items-center justify-center">Loading...</div>;
		return (
			<div className="relative flex items-center justify-center bg-black shadow-lg">
				<LiveStreamPlayer streamUrl={src} allowFullScreen className="w-[100%] h-[100%]" />
				<CameraSelection gridIndex={gridIndex} />
			</div>
		);
	}

	return (
		<div className="base-background flex flex-col h-screen">
			<div className="flex justify-center mb-4 w-[100%] h-[100%]">
				<div
					className="grid gap-2 w-[90%]"
					style={{ gridTemplateRows: `repeat(${row}, 1fr)`, gridTemplateColumns: `repeat(${col}, 1fr)` }}
				>
					{Array.from({ length: totalGrids }, (_, i) => (
						<SurvCamera key={i} src={cameras[i]} gridIndex={i} />
					))}
				</div>
			</div>
		</div>
	);
}