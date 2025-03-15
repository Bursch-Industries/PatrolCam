//Demo page for the surveilaince feature


export default function Demo() {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#145DA0]">

            {/* header text */}
            <h1 className="self-start mb-10 ml-10 text-white m-0 text-[30px] font-light leading-[1.5] border-b-2 border-white/20 pb-[10px] w-[90%]">
                <span className="hover:text-pcYellow">Simple, Powerful and Affordable</span>
            </h1>

            {/* video container */}
            <div className="flex justify-center">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    controls 
                    poster="/PatrolCam_Thumbnail.png"
                    className="bg-[#145DA0] rounded-[10px] shadow-[0_10px_20px_rgba(0,0,0,0.2)] w-[100%] h-[calc(100vh-10rem)]"
                >
                    <source src="/PatrolCam_Coming_Soon.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

        </div>
    )
}
