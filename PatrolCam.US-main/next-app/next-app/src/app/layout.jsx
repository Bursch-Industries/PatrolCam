//layout for landing page of Patrol Cam
import Footer from '@/app/ui/footer';
import '@/app/styles/globals.css';

//metadata for the landing page
export const metadata = {
    title: "PatrolCam",
    icons: "/PatrolCamLogo.png",
};

export default function LandingLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main> {children} </main>
                <Footer />
            </body>
        </html>
    );
}