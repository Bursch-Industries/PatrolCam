//landing page for PatrolCam 
import '../../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '../../components/contactUs';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export default function LandingPage() {
  return ( 
    <div>
      <Navbar />
      {/* hero section*/}
      <div className="bg-[url(/hero-background.jpg)] bg-cover bg-center">
      {/* hero text section */}
        <div className="flex flex-col-2 justify-around text-white border-primary">
          <div className="content-center font-bold">
            <h1 className="text-6xl">
              The Most Advanced<br/>
              Surveillance<br/>
              Solutions For<br/>
              Defense Agencies
            </h1>
            <Link href="#contact-us" className="text-xl bg-pcYellow text-black inline-block mt-5 px-6 py-2 rounded-md">
              Get Started
            </Link>
          </div>
          <div>
            <Image 
              src="/trial_logo.svg" 
              alt="PatrolCam Home Logo"
              width={470}
              height={470}
            />
          </div>
        </div>
      </div>
      
      {/* Features Section*/}
       <div id="features" className="bg-[#145DA0] text-white"> {/* bg-[#145DA0] */}
        <div className="flex justify-center text-3xl py-8 bg-primary">
          <h1>WHAT PATROLCAM BRINGS TO YOUR SECURITY</h1>
        </div>
        
        <div>
          {/* First Subset of Features */}
            <div className="py-10">
              <div className="feature-container">
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
                  <div className="feature-card">
                    <Image
                      src="/camera-icon.png"
                      alt="Little Camera Icon"
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
          <div className="feature-container">
            <div className="max-w-lg w-full">
              <div className="feature-card">
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
            <div className="feature-container">
              {/* Image container */}
              <div>
                <Image
                  src="/PingImage.jpg"
                  alt="Ping Image"
                  width={400}
                  height={400}
                  />
              </div>
              {/* Text Content */}
              <div className="max-w-lg w-full">
                <div className="feature-card">
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
      <Footer />
    </div>
  );
}