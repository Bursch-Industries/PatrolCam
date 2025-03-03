//layout for landing page
import Head from 'next/head';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';

export default function LandingLayout({ children }) {
    return (
        <html lang="en">
        <Head>
            <meta charSet="UTF-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <title>PatrolCam</title>
        </Head>
        <body>
            <Navbar />
                {children}
            <Footer />
        </body>
        </html>
    )
}