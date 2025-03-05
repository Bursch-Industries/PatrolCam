//layout for landing page of Patrol Cam

import Head from 'next/head';
import Footer from '@/app/ui/footer';

export default function LandingLayout({ children }) {
    return (
        <>
            <Head>
                <meta charSet="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>PatrolCam</title>
            </Head>
            <html lang="en">
                <body>
                    <main> {children} </main>
                    <Footer />
                </body>
            </html>
        </>
    );
}