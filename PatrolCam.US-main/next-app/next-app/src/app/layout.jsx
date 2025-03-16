//layout for landing page of Patrol Cam
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
                <main> {children} </main>
            </body>
        </html>
    );
}