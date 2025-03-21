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
	const [row, setRows] = useState(1); // state var to get and set rows
	const [col, setCols] = useState(1); // state var to get and set cols
	let demoVid = "/Camera_1.mp4"

    return (
        <div className="bg-[#2E8BC0] flex h-screen">

            {/* grid camera container */}
			<div className="flex w-[100%] m-8">
				<div className={`grid grid-rows-${row} grid-cols-${col} w-[100%]`}> 
					{/* insert video frames here */}
					<SurvCamera src={demoVid} />
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

