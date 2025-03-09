//landing page for PatrolCam 
import '../../styles/globals.css';
import Image from 'next/image';

export default function LandingPage() {
  return ( 
    <div>
      {/* First part of the website that users see */}
      <div className="flex bg-[url(/hero-background.jpg)] bg-cover bg-center">
      {/* hero text section */}
        <div className="flex text-white">
          <div className="flex">
            <h1>
              The Most Advanced<br/>
              Surveillance<br/>
              Solutions For<br/>
              Defense Agencies
            </h1>
            <button>Get Started</button>
          </div>
          <div className="flex">
            <Image 
              src="/trial_logo.svg" 
              alt="PatrolCam Home Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
      
      {/* TODO features section */}
      <div id="features" className="flex border-2 border-black">
        <h1>Features</h1>
      </div>
      {/* TODO Contact Us section */}
      <div id="contact-us" className="flex border-2 border-black">
        <h1>Contact us</h1>
      </div>
    </div>
  )
}