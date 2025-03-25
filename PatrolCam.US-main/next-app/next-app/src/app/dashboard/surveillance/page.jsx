// page for the surveillance of PatrolCam
'use client';
import { useState } from 'react'; 




export default function Surveillance(){
	// state for camera grids
	const [row, setRows] = useState(1); // state var to get and set rows
	const [col, setCols] = useState(1); // state var to get and set cols
	
	let totalGrids = row * col; // total amount of grids --> total amount of cameras
	
	// Demo cameras will be replaced with the streaming cameras when implemented
	const demoCameras = [
		"/Camera_1.mp4","/Camera_2.mp4",
		"/Camera_3.mp4","/Camera_4.mp4",
		"/Camera_5.mp4","/Camera_6.mp4",
		"/Camera_7.mp4","/Camera_8.mp4",
		"/Camera_9.mp4",
	];
	

	function CameraSelection(){
		const [cam, setCam] = useState(true);

		function selectionDropdown() {
			setCam(!cam);
		};

		return (
			<div>
				{/* camera selection button */}
				<button onClick={selectionDropdown} className="absolute place-self-start top-2 left-2 text-white text-2xl mt-2">⚙</button>
				{/* camera selection dropdown */}
				{!cam && (<div className="flex flex-col absolute z-50 text-white top-10 left-2 bg-primary opacity-90 rounded-md shadow-lg">
					<button className="p-2 hover:bg-blue-600">Camera 1</button>
					<button className="p-2 hover:bg-blue-600">Camera 2</button>
					<button className="p-2 hover:bg-blue-600">Camera 3</button>
					<button className="p-2 hover:bg-blue-600">Camera 4</button>
					<button className="p-2 hover:bg-blue-600">Camera 5</button>
					<button className="p-2 hover:bg-blue-600">Camera 6</button>
					<button className="p-2 hover:bg-blue-600">Camera 7</button>
					<button className="p-2 hover:bg-blue-600">Camera 8</button>
					<button className="p-2 hover:bg-blue-600">Camera 9</button>
				</div>)}
			</div>
		)
	};

	// surveillance camera iframe and styling for it
	function SurvCamera( { src } ){
		
		return (
			<div className="flex relative items-center justify-center bg-black">
				<iframe src={src} allowFullScreen className="w-[90%] h-[90%]"></iframe>
				{/* <button onClick={() => {console.log("This works")}} className="absolute place-self-start top-2 left-2 text-white text-xl mt-2">⚙</button> */}
				<CameraSelection />
			</div>	
		)	
	};

	// component for selecting the current layout of grid
	function GridDropdown() {
		const [view, setView] = useState(true);	

		function ChangeDropdown() {
			setView(!view);
		};

		return (
			<div className="relative">
				{/* dropdown button */}
				<button onClick={ChangeDropdown} className="mr-4 mt-2 bg-primary p-2 px-3 rounded-md text-white text-2xl">☰</button>
				{/* dropdown menu */}
				{!view && ( 
					<div className="absolute right-0 mt-2 w-32 bg-primary opacity-90 rounded-md shadow-lg z-50 flex flex-col text-white text-lg">
						<button onClick={() => { setRows(1); setCols(1); setView(false); }} className="p-2 hover:bg-blue-600">1x1</button>
						<button onClick={() => { setRows(1); setCols(2); setView(false); }} className="p-2 hover:bg-blue-600">1x2</button>
						<button onClick={() => { setRows(2); setCols(2); setView(false); }} className="p-2 hover:bg-blue-600">2x2</button>
						<button onClick={() => { setRows(3); setCols(3); setView(false); }} className="p-2 hover:bg-blue-600">3x3</button>
					</div>
				)}
			</div>
		);
	}

    return (
        <div className="bg-[#2E8BC0] flex flex-col h-screen">
			
				{/* Temporary dropdown until the navbar is fixed */}
				<div className="flex justify-end">
					{/* <button className="mr-4 mt-2 bg-primary p-2 px-3 rounded-md text-white text-2xl">☰</button> */}
					<GridDropdown />
				</div>
			
				{/* grid camera container */}
				<div className="flex justify-center mb-4 w-[100%] h-[100%]">
					<div 
						className="grid gap-2 w-[90%]"
						style={{gridTemplateRows: `repeat(${row}, 1fr)`, gridTemplateColumns: `repeat(${col}, 1fr)`}} // create grids 
					> 
						{/* insert Surveillance camera into each iframe */}
						{Array.from({length: totalGrids}, (_, i) => (
							<SurvCamera key={i} src={demoCameras[i]}/>
						))}
					</div>
				</div>
			</div>
		

    );
}

// TODO 
// 	Create a way to switch between cams,
//  Add better SEO and accessibility to each cam 
// 	complete the styling of the page, 
// 	add the dropdown to the navbar when that is completed
