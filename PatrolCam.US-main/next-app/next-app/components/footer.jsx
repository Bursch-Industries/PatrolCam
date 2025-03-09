// footer used throughout all of Patrol Cam

export default function Footer() {
    return (
        <>
            <footer>
                {/* style for footer using Tailwind CSS */}
                <div className="flex bg-black text-white p-7 opacity-90 justify-center"> 
                    <p className="text-xl">© 2024 PatrolCam. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}