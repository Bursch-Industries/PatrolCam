//layout for landing page of Patrol Cam
import '../../styles/globals.css';
import Provider from '@/context/page';

//metadata for the landing page
export const metadata = {
    title: "PatrolCam",
    icons: "/PatrolCamLogo.png",
};

export default function LandingLayout({ children }) {
    return (
        <html lang="en">
            {/* Wrap in provider to allow for use of 'useSession' hooks */}
            <Provider> 
                <body>
                    { children }
                </body> 
            </Provider>
        </html>
    );
}