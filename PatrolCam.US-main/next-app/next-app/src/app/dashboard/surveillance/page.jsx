// page for the surveillance of PatrolCam
'use client';
import Image  from 'next/image';
import { useState } from 'react'; 




export default function Surveillance(){
	// state for camera grids
	const [row, setRows] = useState(1); // state var to get and set rows
	const [col, setCols] = useState(1); // state var to get and set cols 
	let totalGrids = row * col;

	// Demo cameras will be replaced with the streaming cameras when implemented
	const demoCameras = [
		"/Camera_1.mp4",
		"/Camera_2.mp4",
		"/Camera_3.mp4",
		"/Camera_4.mp4",
		"/Camera_5.mp4",
		"/Camera_6.mp4",
		"/Camera_7.mp4",
		"/Camera_8.mp4",
		"/Camera_9.mp4",
	];

	// surveillance camera iframe and styling for it
	function SurvCamera( { src } ){
		return (
			<div className="flex justify-center items-center">
				{/* TODO: insert camera logic here for camera component */}
				<iframe src={src} className="w-[90%] h-[90%]"></iframe>
			</div>
		);
	}

	// component for selecting the current layout of grid
	function GridDropdown() {
		// dropdown element for chaning the grid layout of cameras
		const [view, setView] = useState(true); // if true will just dislay button else if false will dispay grid selection

		// used to change the state of view when option is selected
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
				<div className="flex w-[100%] h-[100%]">
					<div 
						className={`grid w-[100%]`}
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

