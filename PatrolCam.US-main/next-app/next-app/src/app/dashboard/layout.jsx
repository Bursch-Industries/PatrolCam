// Common layout for PatrolCam
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { UserNavbar } from "@/components/navbar";

export default function DashboardLayout({ children }) {

    return (
        <>
            <Navbar />
                { children }
            <Footer />
        </>
    )
}