import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">About Us</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
                    We are a team of passionate developers dedicated to creating a platform that helps users find available carparks quickly and easily.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
                    Our mission is to provide a seamless experience for users to locate and reserve parking spaces, reducing stress and saving time.
                    We also wish to provide a space where users can share their thoughts, ideas, and experiences while also having fun and learning from each other.
                </p>
            </div>
            <Footer />
        </>
    );
}

