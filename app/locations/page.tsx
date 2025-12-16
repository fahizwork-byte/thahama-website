import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StoreLocator from "../components/StoreLocator";

export const metadata = {
    title: "Locations | Thahama Market",
    description: "Find a Thahama Market near you. We have over 30 locations across the region.",
};

export default function LocationsPage() {
    return (
        <>
            <Navbar />
            <main className="h-screen w-full relative pt-[88px] flex flex-col">
                <StoreLocator />
            </main>
            <Footer />
        </>

    );
}
