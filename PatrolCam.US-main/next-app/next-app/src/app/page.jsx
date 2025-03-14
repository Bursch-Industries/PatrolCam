//landing page for PatrolCam 
import '../../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '../../components/contactUs';

export default function LandingPage() {
  return ( 
    <div>
      {/* First part of the website that users see */}
      <div className="bg-[url(/hero-background.jpg)] bg-cover bg-center">
      {/* hero text section */}
        <div className="flex text-white justify-between border-primary">
          <div className="content-center ml-50 font-bold">
            <h1 className="text-6xl">
              The Most Advanced<br/>
              Surveillance<br/>
              Solutions For<br/>
              Defense Agencies
            </h1>
            <div className="bg-pcYellow text-black inline-block mt-5 px-6 py-2 rounded-md">
              <Link href="#features" className="text-xl"> Get Started </Link>
            </div>
          </div>
            <Image 
              src="/trial_logo.svg" 
              alt="PatrolCam Home Logo"
              width={470}
              height={470}
              className="mr-50"
            />
        </div>
      </div>
      
      {/* Features Section*/}
       <div id="features" className="bg-[#145DA0] text-white"> {/* bg-[#145DA0] */}
        <div className="flex bg-primary opacity-90 justify-center text-3xl py-8">
          <h1>WHAT PATROLCAM BRINGS TO YOUR SECURITY</h1>
        </div>

        <div>
          {/* First Subset of Features */}
            <div className="py-10">
              <div className="flex flex-wrap justify-around items-center py-10">
                {/* Image Container */}
                <div>
                  <Image
                    src="/SurveillanceImage.jpg"
                    alt="Surveillance Image"
                    width={400}
                    height={400}
                  />
                </div>
                
                {/* Text Content */}
                <div className="max-w-lg w-full">
                  <div className="flex flex-col items-center bg-[#B1D4E0] text-black text-xl rounded-[1.25rem] px-4 py-20">
                    <Image
                      src="/camera-icon.png"
                      alt="LittleCameraIcon"
                      width={60}
                      height={60}
                      className="mb-4"
                    />
                    <h1 className="text-[2rem] text-center font-bold break-words max-w-xs">
                      24/7 SURVEILLANCE
                    </h1>
                    <p className="text-[1.5rem] text-center break-words max-w-xs whitespace-normal">
                      Stay protected around the clock with our continuous monitoring system.
                    </p>
                  </div>
                </div>
              </div>
            </div>


          {/* Second Subset of Features */}
          <div className="flex flex-wrap justify-around items-center py-10">
            <div className="max-w-lg w-full">
              <div className="flex flex-col items-center bg-[#B1D4E0] text-black text-xl rounded-[1.25rem] px-4 py-20">
                <Image
                  src="/VehicleTrackingIcon.png"
                  alt="AI icon"
                  width={60}
                  height={60}
                  className="mb-4"  
                />
                <h1 className="text-[2rem] text-center font-bold max-w-xs"> 
                  AI-DRIVEN VEHICLE TRACKING 
                </h1>
                <p className="text-[1.5rem] text-center break-words max-w-xs whitespace-normal"> 
                  Advanced Machine Learning algorithms are engineered to help you track suspicious vehicles with unparalleled precision 
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/VehicleTrackingImage.png"
                alt="VehicleTracking Image"
                width={400}
                height={400}
                />
            </div>
          </div>

          {/* Third and Final Subset of Features */}
          <div className="py-10">
            <div className="flex flex-wrap justify-around items-center py-10">
              {/* Image container */}
              <div>
                <Image
                  src="/PingImage.jpg"
                  alt="Surveillance Image"
                  width={400}
                  height={400}
                  />
              </div>
              {/* Text Content */}
              <div className="max-w-lg w-full">
                <div className="flex flex-col items-center bg-[#B1D4E0] text-black text-xl rounded-[1.25rem] px-4 py-20">
                  <Image
                    src="/Ping.png"
                    alt="Ping icon"
                    width={60}
                    height={60}
                    className="mb-4"
                  />
                  <h1 className="text-[2rem] text-center font-bold break-words max-w-xs"> 
                    EASY PING FOR <br/> RAPID RESPONSE 
                  </h1>
                  <p className="text-[1.5rem] text-center break-words max-w-xs whitespace-normal"> 
                    With a single tap, instantly access live feeds, send commands, or retrieve stored footage.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TODO Contact Us section */}
        <ContactForm />
    </div>
  )
}