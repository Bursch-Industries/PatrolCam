// Common layout for PatrolCam
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function DashboardLayout({ children }) {

    return (
        <div>
            <Navbar />
            <main>{ children }</main>
            <Footer />
        </div>
    );
}