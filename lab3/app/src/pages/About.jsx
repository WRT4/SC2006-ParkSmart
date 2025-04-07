import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthWrapper";

export default function About() {
    const { user, setUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [aboutText, setAboutText] = useState("We are a team of passionate developers dedicated to creating a platform that helps users find available carparks quickly and easily.");
    const [missionText, setMissionText] = useState("Our mission is to provide a seamless experience for users to locate and reserve parking spaces, reducing stress and saving time. We also wish to provide a space where users can share their thoughts, ideas, and experiences while also having fun and learning from each other.");

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/about-mission/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ aboutText, missionText }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert("Error updating About and Mission. Please try again.");
                return;
            }

            // Update the frontend or context with the updated data if needed
            alert("About and Mission updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating About and Mission:", error);
            alert("Error updating About and Mission. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">About Us</h1>
                {isEditing && user.username === 'admin' ? (
                    <textarea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    />
                ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
                        {aboutText}
                    </p>
                )}
                
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Mission</h2>
                {isEditing && user.username === 'admin' ? (
                    <textarea
                        value={missionText}
                        onChange={(e) => setMissionText(e.target.value)}
                        className="p-2 mb-4 border border-gray-300 rounded"
                    />
                ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl">
                        {missionText}
                    </p>
                )}

                {user.username === 'admin' && (
                    <button
                        onClick={() => {
                            if (isEditing) {
                                handleSave(); // Save changes if in edit mode
                            }
                            setIsEditing(!isEditing); // Toggle edit mode
                        }}
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                    >
                        {isEditing ? 'Save Changes' : 'Edit About & Mission'}
                    </button>
                )}
            </div>
            <Footer />
        </>
    );
}
