//layout for landing page of Patrol Cam
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';
import '../../styles/globals.css';

//metadata for the landing page
export const metadata = {
    title: "PatrolCam",
    icons: "/PatrolCamLogo.png",
};

export default function LandingLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                    <main> {children} </main>
                <Footer />
            </body>
        </html>
    );
}