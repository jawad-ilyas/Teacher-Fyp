import resourceImage from "../assets/staticImages/resources1.png"
const Resources = () => {
    return (
        <div className="font-sans text-gray-700">
        

            {/* HERO SECTION */}
            <section className="bg-gray-50 pt-12 md:py-40">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="flex-1 md:mr-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Explore Our Resources
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Stay Informed with the Latest Blogs, Case Studies, and Whitepapers
                        </p>
                        <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition">
                            Discover More
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center mt-8 md:mt-0">
                       
                    </div>
                </div>
            </section>

            {/* INTRODUCTION SECTION */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    {/* Left text */}
                    <div className="flex-1 mb-8 md:mb-0 md:pr-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 uppercase">
                            INTRODUCTION
                        </h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            At Cyber Guardians, we understand that each industry faces unique
                            cybersecurity challenges. Our industry-specific solutions are
                            designed to address these challenges and provide comprehensive
                            protection for your business. Explore how we can help your
                            organization stay secure in an increasingly digital world.
                        </p>
                    </div>
                    {/* Right image */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={resourceImage}
                            alt="Industry Team"
                            className="rounded shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* BLOGS SECTION */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold">Blogs</h2>
                    <p className="text-gray-600">Stay Updated with the Latest Trends</p>
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blog Card 1 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Blog Card 2 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Blog Card 3 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Blog Card 4 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>
                </div>
            </section>

            {/* WHITEPAPERS SECTION */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold">WHITEPAPERS</h2>
                    <p className="text-gray-600">Stay Updated with the Latest Trends</p>
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Whitepaper Card 1 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Whitepaper Card 2 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Whitepaper Card 3 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Whitepaper Card 4 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Whitepaper Card 5 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
                    </div>

                    {/* Whitepaper Card 6 */}
                    <div className="border border-gray-200 p-4 rounded hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold mb-2">
                            Protecting Intellectual Property in the Manufacturing Industry
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This whitepaper provides insights into protecting intellectual
                            property and securing operational technologies in the
                            manufacturing sector. Topics include threat detection, mitigation
                            strategies, and incident response planning.
                        </p>
                        <a
                            href="#"
                            className="text-teal-600 text-sm font-semibold hover:underline"
                        >
                            READ MORE &gt;&gt;
                        </a>
                        <p className="text-gray-500 text-xs mt-2">June 30,24</p>
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
                            Our project the Intelligent Evaluation and Feedback Platform
                            addresses the critical need for effective feedback mechanisms
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
                                <a href="#terms-of-use" className="hover:text-gray-200 transition">
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

export default Resources;
