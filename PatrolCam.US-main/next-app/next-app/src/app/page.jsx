//landing page for PatrolCam 
import '../../styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import FeatContainer from '../../components/featContainer';

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
      <div id="features" className="bg-[#145DA0] text-white">
        <div className="flex justify-center text-3xl py-8">
          <h1>WHAT PATROLCAM BRINGS TO YOUR SECURITY</h1>
        </div>

        <div>

          {/* First Subset of Features */}
          <div>
            <div className="flex justify-between py-10">
              <div className="ml-65">
                <Image
                  src="/SurveillanceImage.jpg"
                  alt="Surveillance Image"
                  width={400}
                  height={400}
                  />
              </div>
              <div className="mr-65">
                <FeatContainer>
                  <h1> 24/7 SURVEILLANCE</h1>
                </FeatContainer>
              </div>
            </div>
          </div>

          {/* Second Subset of Features */}
          <div className="flex justify-between py-10">
            <div className="ml-65">
              <FeatContainer>
                <h1> AI-DRIVEN <br/> VEHICLE TRACKING </h1>
              </FeatContainer>
            </div>
            <div className="mr-65">
                <Image
                  src="/VehicleTrackingImage.png"
                  alt="VehicleTracking Image"
                  width={400}
                  height={400}
                  />
            </div>
          </div>

          {/* Third and Final Subset of Features */}
          <div className="flex justify-between py-10">
            <div className="ml-65">
                <Image
                  src="/PingImage.jpg"
                  alt="Surveillance Image"
                  width={400}
                  height={400}
                  />
            </div>
            <div className="mr-65">
              <FeatContainer>
                <h1> EASY PING FOR <br/> RAPID RESPONSE </h1>
              </FeatContainer>
            </div>
          </div>

        </div>

      </div>

      {/* TODO Contact Us section */}
      <div id="contact-us" className="flex bg-[#145DA0] justify-center">
        <h1 className="text-6xl">Contact us Section</h1>
      </div>

    </div>
  )
}