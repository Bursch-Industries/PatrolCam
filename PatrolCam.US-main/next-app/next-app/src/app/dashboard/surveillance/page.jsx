// page for the surveillance of PatrolCam
'use client';
import { useState } from 'react'; 




export default function Surveillance(){
	// state for camera grids
	const [row, setRows] = useState(1); // will initially render 1 row
	const [col, setCols] = useState(1); // will initially render 1 column
	
	let totalGrids = row * col; // total amount of grids --> total amount of cameras
	
	// Demo cameras will be replaced with the streaming cameras when implemented
	const demoCameras = [
		"/Camera_1.mp4","/Camera_2.mp4",
		"/Camera_3.mp4","/Camera_4.mp4",
		"/Camera_5.mp4","/Camera_6.mp4",
		"/Camera_7.mp4","/Camera_8.mp4",
		"/Camera_9.mp4",
	];
	
	// State to track which camera is displayed in each grid tile
	const [cameras, setCameras] = useState(demoCameras.slice(0, totalGrids));

	// Function to update the camera for a specific tile
	function updateCamera(gridIndex, newCameraSrc) {
		setCameras(prevCameras => {
			const updatedCameras = [...prevCameras]; // make a copy of the previous state
			updatedCameras[gridIndex] = newCameraSrc; // update the src of the tile at grid index
			return updatedCameras; // return the new state array
		});
	}

	// create and handle logic for camera selection dropdown
	function CameraSelection({ gridIndex }){
		const [isDropdownOpen, setDropdownOpen] = useState(false);	// used for toggling display of dropdown

		return (
			<div className="absolute top-2 left-2">
				<button
					onClick={() => setDropdownOpen(!isDropdownOpen)} // display dropdown
					className="text-white text-2xl"
				>
					⚙
				</button>

				{isDropdownOpen && (
					<div className="absolute z-50 text-white top-10 left-2 bg-primary opacity-90 rounded-md shadow-lg">
						<div className="flex flex-col">
							<div className="flex">
								{demoCameras.slice(0,5).map((cam, i) => (
									<button
										key={i}
										onClick={() => {
											updateCamera(gridIndex, cam);
											setDropdownOpen(false); // no longer display dropdown
										}}
										className="p-2 hover:bg-blue-600"
									>
										Cam {i+1}
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

	// Camera component
	function SurvCamera( { src, gridIndex } ){
		
		return (
			<div className="relative flex items-center justify-center bg-black shadow-lg">
				<iframe src={src} allowFullScreen className="w-[90%] h-[90%]" />
				<CameraSelection gridIndex={gridIndex} />
			</div>	
		)	
	};

	// dropdown that will let the user select what grid layout they want
	function GridDropdown() {
		const [isDropdownOpen, setDropdownOpen] = useState(false);

		function changeLayout(newRows, newCols) {
			// change state of rows and columns to new values passed in
			setRows(newRows); 
			setCols(newCols);
			setDropdownOpen(false); // no longer display dropdown
			setCameras(demoCameras.slice(0, newRows * newCols)); // Reset Cameras to default
		}

		return (
			<div className="relative">
				{/* dropdown button */}
				<button onClick={() => setDropdownOpen(!isDropdownOpen)} className="mr-4 mt-2 bg-primary p-2 px-3 rounded-md text-white text-2xl">☰</button>
				{/* dropdown menu */}
				{isDropdownOpen && ( 
					<div className="absolute right-0 mt-2 w-32 bg-primary opacity-90 rounded-md shadow-lg z-50 flex flex-col text-white text-lg">
						<button onClick={() => changeLayout(1,1)} className="p-2 hover:bg-blue-600">1x1</button>
						<button onClick={() => changeLayout(1,2)} className="p-2 hover:bg-blue-600">1x2</button>
						<button onClick={() => changeLayout(2,2)} className="p-2 hover:bg-blue-600">2x2</button>
						<button onClick={() => changeLayout(3,3)} className="p-2 hover:bg-blue-600">3x3</button>
					</div>
				)}
			</div>
		);
	}

    return (
        <div className=" base-background flex flex-col h-screen">
			
				{/* Temporary dropdown until the navbar is fully implemented */}
				<div className="flex justify-end mr-2">
					<GridDropdown />
				</div>
			
				{/* grid camera container */}
				<div className="flex justify-center mb-4 w-[100%] h-[100%]">
					<div 
						className="grid gap-2 w-[90%]"
						style={{gridTemplateRows: `repeat(${row}, 1fr)`, gridTemplateColumns: `repeat(${col}, 1fr)`}} // initial creation of grids
					> 
						{/* insert Camera component into each grid */}
						{Array.from({length: totalGrids}, (_, i) => (
							<SurvCamera key={i} src={cameras[i]} gridIndex={i}/>
						))}
					</div>
				</div>
			</div>
    );
}

// TODOS & Improvements
	// use live camera feed instead of demo videos
	// improve styling for better UI and UX
	// make camera not re render when switching cams

