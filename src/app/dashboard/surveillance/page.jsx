'use client';
import { useState, useEffect } from 'react';
import LiveStreamPlayer from './LiveStreamPlayer';
import useCameras from '@/hooks/useCameras';

// Helper to test whether a stream URL is reachable via a HEAD request
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

	// Fetch camera info from backend
	const { cameras: cameraInfo, loading: camsLoading, error: camsError } = useCameras();

	const [jetsonLink, setJetsonLink] = useState(null);
	const [checkingStream, setCheckingStream] = useState(true);
	const [cameras, setCameras] = useState([]);

	// Choose whether to try to access stream from local or public IP address
	useEffect(() => {
		let cancelled = false;
		let attempt = 0;

		const chooseBestStream = async () => {
			while (!cancelled) {
				attempt++;
				console.log(`🔁 Attempt ${attempt}: checking stream availability...`);

				if (!camsLoading && cameraInfo?.length) {
					const JetsonNano = cameraInfo.find(obj => obj.camera_Name === "Jetson1");
					console.log("cameraInfo:", cameraInfo);
					console.log("Found Jetson1:", JetsonNano);

					if (JetsonNano?.local_ip && JetsonNano?.ip) {
						const publicUrl = `http://${JetsonNano.ip}:8080/hls/jetsontest/stream.m3u8`;
						const localUrl = `http://${JetsonNano.local_ip}:8080/hls/jetsontest/stream.m3u8`;

						console.warn("Checking public stream at:", publicUrl);
						const isPublicAvailable = await testStreamUrl(publicUrl);
						if (isPublicAvailable) {
							console.log("✅ Public stream is available");
							if (!cancelled) {
								setJetsonLink(publicUrl);
								break;
							}
						} else {
							// Fallback to local stream
							console.log("❌ Public stream is unavailable. Checking local stream...");
							console.log("Checking local stream at:", localUrl);
							const isLocalAvailable = await testStreamUrl(localUrl);
							if (isLocalAvailable) {
								console.log("✅ Local stream is available");
								if (!cancelled) {
									setJetsonLink(localUrl);
									break;
								}
							} else {
								console.log("❌ No stream available yet. Retrying...");
							}
						}
					} else {
						console.warn("⚠️ Missing IP info for Jetson1");
					}
				}
				await new Promise(res => setTimeout(res, 5000)); // wait 5s before next try
			}

			if (!cancelled) setCheckingStream(false);
		};

		chooseBestStream();

		return () => { cancelled = true; }; // Clean up on unmount
	}, [cameraInfo, camsLoading]);

	// Update specific camera in grid when changed via UI
	useEffect(() => {
		if (jetsonLink) {
			setCameras(Array(row * col).fill(jetsonLink));
		}
	}, [jetsonLink, row, col]);

	function updateCamera(gridIndex, newCameraSrc) {
		setCameras(prevCameras => {
			const updated = [...prevCameras];
			updated[gridIndex] = newCameraSrc;
			return updated;
		});
	}

	// Settings dropdown for each grid cell
	function CameraSelection({ gridIndex }) {
		const [isDropdownOpen, setDropdownOpen] = useState(false);

		return (
			<div className="absolute top-2 left-2">
				<button onClick={() => setDropdownOpen(!isDropdownOpen)} className="text-white text-2xl">⚙</button>
				{isDropdownOpen && (
					<div className="absolute z-50 text-white top-10 left-2 bg-primary opacity-90 rounded-md shadow-lg">
						<div className="flex flex-col">
							<div className="flex">
								{cameras.slice(0, 5).map((cam, i) => (
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
								{cameras.slice(5).map((cam, i) => (
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

	// Grid cell for a single stream
	function SurvCamera({ src, gridIndex }) {
		if (!src) return <div className="bg-white flex items-center justify-center">Loading...</div>;
		return (
			<div className="relative flex items-center justify-center bg-black shadow-lg">
				<LiveStreamPlayer streamUrl={src} allowFullScreen className="w-[100%] h-[100%]" />
				<CameraSelection gridIndex={gridIndex} />
			</div>
		);
	}

	const totalGrids = row * col;

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