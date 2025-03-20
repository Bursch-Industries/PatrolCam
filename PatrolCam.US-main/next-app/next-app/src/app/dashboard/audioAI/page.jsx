'use client';
// AudioAI page for PatrolCam

export default function AudioAI(){

    return (
        <div className="flex flex-col h-dvh text-white bg-[#2E8BC0]">
            {/* Heading and Description text */}
            <div className="text-center">
                <h1 className="">Audio.Ai Page</h1>
                <p className="">description</p>
            </div>
            {/* audio ai feature section */}
            <div className=""> 
                {/* reset button */}
                <div className="flex">
                    <button className="bg-primary rounded-md py-2 px-6">reset</button>
                </div>
                {/* audio ai text container */}
                <div className="flex justify-center">
                    <div className="text-black bg-white border-2 py-8 px-12">
                        audio ai text box
                    </div>
                </div>
                {/* upload file button and reset files button */}
                <div className="">
                    <button>Choose File</button>
                    <button>File upload</button>
                </div>

            </div>
        </div>
    );
}