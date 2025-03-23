// page for the surveillance of PatrolCam
'use client';
import Image  from 'next/image';
import { useState } from 'react'; 


function SurvCamera( { src } ){
	return (
		<div className="flex justify-center items-center">
			{/* TODO: insert camera logic here for camera component */}
			<iframe src={src} className="w-[90%] h-[90%]"></iframe>
		</div>
	);
};


export default function Surveillance(){
	// state for camera grids
	const [row, setRows] = useState(3); // state var to get and set rows
	const [col, setCols] = useState(3); // state var to get and set cols
	const demoCameras = {
		camera1: "/Camera_1.mp4",
		camera2: "/Camera_2.mp4",
		camera3: "/Camera_3.mp4",
		camera4: "/Camera_4.mp4",
		camera5: "/Camera_5.mp4",
		camera6: "/Camera_6.mp4",
		camera7: "/Camera_7.mp4",
		camera8: "/Camera_8.mp4",
		camera9: "/Camera_9.mp4",
	}

    return (
        <div className="bg-[#2E8BC0] flex flex-col h-screen">
			{/* Temporary dropdown until the navbar is fixed */}
			<div className="flex justify-end">
				<button className="mr-4 mt-2 bg-primary p-2 px-3 rounded-md text-white text-2xl">☰</button>
			</div>
			{/* grid camera container */}
			<div className="flex w-[100%] h-[100%] m-8">
				<div className={`grid grid-rows-${row} grid-cols-${col} w-[100%]`}> 
					{/* insert video frames here */}
					<SurvCamera src={demoCameras.camera1} />
				</div>
			</div>
		</div>

    );
}


// IDEAS
// 1.) Create a camera componenent that will contain all the logic needed for it
// 2.) 


// NEEDS
// Dropdown to change state of cameras ( this needs to be on the navbar ) 
// Dropdowns within each camera to change which camera is displayed in that grid
// 

