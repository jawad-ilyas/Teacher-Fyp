import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

// ----- Replace with your actual clientId & clientSecret (or retrieve from .env) -----
const JDOODLE_CLIENT_ID = "d662af665b47d314f1801d986e930514";
const JDOODLE_CLIENT_SECRET = "2d26928100db356e53974d4f27dd0105d26f7db054dc13d0f06e023ba62b4216";

// A small helper to map our UI language names to JDoodle's "language" param
const jdoodleLanguageMap = {
    "C++": { language: "cpp", versionIndex: "3" },     // C++14
    "Java": { language: "java", versionIndex: "4" },   // Java (OpenJDK 17) 
    "Python": { language: "python3", versionIndex: "3" } // Python 3 
};

// -------------------------------------------------------------------
// REAL JDoodle code execution call
// -------------------------------------------------------------------
async function runCodeWithJDoodle(languageLabel, code) {
    const jdoodleInfo = jdoodleLanguageMap[languageLabel];
    if (!jdoodleInfo) {
        throw new Error(`Unsupported language: ${languageLabel}`);
    }

    const payload = {
        script: code,
        language: jdoodleInfo.language,
        versionIndex: jdoodleInfo.versionIndex,
        clientId: JDOODLE_CLIENT_ID,
        clientSecret: JDOODLE_CLIENT_SECRET,
    };

    const res = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`JDoodle API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.output; // We'll just return the "output" field
}

const Home = () => {
    // State for mobile menu toggle
    const [menuOpen, setMenuOpen] = useState(false);

    // -------------------------------------------------------------------
    // INTERACTIVE CODE EDITOR (JDoodle)
    // -------------------------------------------------------------------
    const languages = ["C++", "Java", "Python"];
    const [activeTab, setActiveTab] = useState(languages[0]);

    // Default code for each language
    const [codeStore, setCodeStore] = useState({
        "C++": `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}`,
        "Java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
        "Python": `def main():
    print("Hello World!")

if __name__ == "__main__":
    main()`,
    });

    // For storing the code execution output
    const [runOutput, setRunOutput] = useState("");
    const [loading, setLoading] = useState(false);

    // Update code in state as user types
    const handleCodeChange = (lang, newCode) => {
        setCodeStore({ ...codeStore, [lang]: newCode });
    };

    // Attempt to run code via JDoodle
    const handleRunCode = async () => {
        setLoading(true);
        setRunOutput("");
        try {
            const output = await runCodeWithJDoodle(activeTab, codeStore[activeTab]);
            setRunOutput(output);
        } catch (error) {
            setRunOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Clear any displayed output
    const handleClearOutput = () => {
        setRunOutput("");
    };

    // -------------------------------------------------------------------
    // SIMPLE TESTIMONIAL CAROUSEL (same as before)
    // -------------------------------------------------------------------
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const testimonials = [
        {
            id: 1,
            userImg: "https://via.placeholder.com/80?text=User+1",
            text: "At our mission is to help you improve yourself and land your dream job. We have a sizable repository of interview resources.",
            location: "SAN FRANCISCO STATE",
        },
        {
            id: 2,
            userImg: "https://via.placeholder.com/80?text=User+2",
            text: "In the past few years, our users have landed jobs at top companies around the world.",
            location: "SAN FRANCISCO STATE",
        },
        {
            id: 3,
            userImg: "https://via.placeholder.com/80?text=User+3",
            text: "We have a sizable repository of interview resources for many companies.",
            location: "SAN FRANCISCO STATE",
        },
        {
            id: 4,
            userImg: "https://via.placeholder.com/80?text=User+4",
            text: "Join our community and get the help you need to thrive in your career.",
            location: "SAN FRANCISCO STATE",
        },
    ];

    const handlePrevTestimonial = () => {
        setTestimonialIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };
    const handleNextTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <div className="font-sans text-gray-700">
     

         

            {/* AI WRITING DETECTION SECTION */}
            <section className="py-12">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
                    {/* Left side */}
                    <div className="flex-1 mb-8 lg:mb-0">
                        <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                            Advance learning with an AI writing detection solution built for educators
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Our advanced AI writing detection technology is highly reliable in
                            distinguishing between AI and human-written text. It integrates seamlessly
                            into your workflow, saving you time and ensuring academic integrity.
                        </p>
                        <a
                            href="#"
                            className="inline-block text-teal-600 border-b border-teal-600 hover:text-teal-800 transition font-medium"
                        >
                            Learn More &rarr;
                        </a>
                    </div>

                    {/* Right side */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative group">
                            <img
                                src="https://via.placeholder.com/400x300?text=AI+Detection+Image"
                                alt="AI detection"
                                className="rounded-md shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow">
                                <span className="text-sm font-bold">AI<br />37%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ... other sections (Use Your Existing Assignments, etc.) ... */}

            {/* START EXPLORING */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-center">
                        Start Exploring
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left column */}
                        <div>
                            {/* Some text sections */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">
                                    Questions, Community & Contests
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Over 3400 questions for you to practice. Join one of the largest
                                    tech communities with thousands of active users and participate
                                    in contests to earn rewards.
                                </p>
                                <a
                                    href="#"
                                    className="text-teal-600 border-b border-teal-600 hover:text-teal-800 transition font-medium"
                                >
                                    View Questions &rarr;
                                </a>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">Companies & Candidates</h3>
                                <p className="text-gray-600 mb-4">
                                    Over 3400 questions for you to practice. Join the largest
                                    tech communities and participate in our contests.
                                </p>
                                <a
                                    href="#"
                                    className="text-teal-600 border-b border-teal-600 hover:text-teal-800 transition font-medium"
                                >
                                    Business Opportunities &rarr;
                                </a>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-2">Developer</h3>
                                <p className="text-gray-600 mb-4">
                                    Improve your coding skills and compete with others in our
                                    developer community.
                                </p>
                            </div>
                        </div>

                        {/* Right column: JDoodle Code Editor */}
                        <div className="flex flex-col items-center">
                            {/* Language Tabs */}
                            <div className="flex space-x-4 mb-4">
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setActiveTab(lang)}
                                        className={`px-3 py-1 rounded shadow transition-colors ${activeTab === lang
                                            ? "bg-teal-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>

                            {/* Code Editor */}
                            <div className="w-full bg-gray-100 rounded shadow p-4 mb-4">
                                <textarea
                                    className="w-full h-48 p-2 text-sm border rounded focus:outline-none resize-none"
                                    value={codeStore[activeTab]}
                                    onChange={(e) => handleCodeChange(activeTab, e.target.value)}
                                />
                            </div>

                            {/* Run Output */}
                            {runOutput && (
                                <div className="w-full bg-black text-green-300 rounded p-4 mb-4 h-48 overflow-auto text-xs">
                                    <pre>{runOutput}</pre>
                                </div>
                            )}
                            {loading && (
                                <div className="mb-4 text-sm text-gray-500">
                                    Running code, please wait...
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
                                    onClick={handleRunCode}
                                    disabled={loading}
                                >
                                    {loading ? "Running..." : "Run Code"}
                                </button>
                                <button
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition"
                                    onClick={handleClearOutput}
                                >
                                    Clear Output
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR PARTNERS, TESTIMONIAL CAROUSEL, FOOTER ... same as before */}

            {/* TESTIMONIAL CAROUSEL */}
            <section className="py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl lg:text-3xl font-semibold mb-6">
                        What Our Client Say
                    </h2>

                    <div className="max-w-xl mx-auto relative flex flex-col items-center">
                        {/* Current testimonial */}
                        <div className="p-4 bg-gray-50 rounded shadow-sm w-full transition-all">
                            <img
                                src={testimonials[testimonialIndex].userImg}
                                alt={`User ${testimonials[testimonialIndex].id}`}
                                className="mx-auto rounded-full mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-4">
                                {testimonials[testimonialIndex].text}
                            </p>
                            <div className="text-teal-600 text-sm font-medium">
                                {testimonials[testimonialIndex].location}
                            </div>
                        </div>

                        {/* Carousel Buttons */}
                        <div className="flex mt-4 space-x-4 justify-center">
                            <button
                                className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                                onClick={handlePrevTestimonial}
                            >
                                Prev
                            </button>
                            <button
                                className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                                onClick={handleNextTestimonial}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-teal-900 text-white py-8 mt-8">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">About Us</h3>
                        <p className="text-sm mb-2">
                            Our project, the Intelligent Evaluation and Feedback Platform,
                            addresses the critical need for improved feedback mechanisms.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#about-us" className="hover:text-gray-200 transition">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-gray-200 transition">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#register" className="hover:text-gray-200 transition">
                                    Register
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#practice-questions"
                                    className="hover:text-gray-200 transition"
                                >
                                    Practice Questions
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#privacy-policy" className="hover:text-gray-200 transition">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#terms" className="hover:text-gray-200 transition">
                                    Terms of Use
                                </a>
                            </li>
                            <li>
                                <a href="#accessibility" className="hover:text-gray-200 transition">
                                    Accessibility
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#documentation" className="hover:text-gray-200 transition">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#community" className="hover:text-gray-200 transition">
                                    Community
                                </a>
                            </li>
                            <li>
                                <a href="#support" className="hover:text-gray-200 transition">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm">
                    © 2024 University of Central Punjab. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
