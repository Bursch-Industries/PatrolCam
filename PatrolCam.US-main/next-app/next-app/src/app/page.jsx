//landing page for PatrolCam 
import '../../styles/globals.css';
import Image from 'next/image';
import FeatContainer from '../../components/featContainer';

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
      
      {/* Features Section*/}
      <div id="features" className="bg-[#145DA0] text-white">
        <div className="flex">
          <h1>WHAT PATROLCAM BRINGS TO YOUR SECURITY</h1>
        </div>

        <div className="">
          {/* First Subset of Features */}
          <div className="flex">
            <FeatContainer>
              <h1> 24/7 SURVEILLANCE</h1>
            </FeatContainer>
          </div>

          {/* Second Subset of Features */}
          <div className="flex">
            <FeatContainer>
              <h1> AI-DRIVEN <br/> VEHICLE TRACKING </h1>
            </FeatContainer>  
          </div>

          {/* Third and Final Subset of Features */}
          <div className="flex">
            <FeatContainer>
              <h1> EASY PING FOR <br/> RAPID RESPONSE </h1>
            </FeatContainer>
          </div>
        </div>

      </div>

      {/* TODO Contact Us section */}
      <div id="contact-us" className="flex bg-[#145DA0] text-white">
        <h1>Contact us</h1>
      </div>

    </div>
  )
}