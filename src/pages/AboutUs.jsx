
import heroImage from "../assets/staticImages/heroimage.png"
import aboutus1 from "../assets/staticImages/aboutus1.png"
import aboutus2 from "../assets/staticImages/aboutus2.png"
import aboutus3 from "../assets/staticImages/aboutus3.png"
import aboutus4 from "../assets/staticImages/aboutus4.png"


const AboutUs = () => {
    return (
        <div className="font-sans text-gray-700">
            {/* AI WRITING DETECTION SECTION */}
            {/* HERO SECTION */}
            <section className="bg-gray-50 py-12 md:py-40">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="flex-1 md:mr-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                           About us
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

            {/* HERO SECTION */}
            <section className="bg-gray-50 py-12 md:py-20">
                <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row-reverse items-center">
                    {/* Left content */}
                    <div className="flex-1 mt-8 lg:mt-0">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Built by educators, <br className="hidden md:block" /> for educators
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Intelligent Evaluation & Feedback Platform was founded more than 20
                            years ago by a small group of instructors. Since that time, we have
                            always put the needs and experiences of educators and the students
                            they teach at the center of all we do.
                        </p>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            From innovations in assessment to preventing plagiarism, everything
                            we do is focused on empowering educators to help students do
                            their best, original work.
                        </p>
                    </div>

                    {/* Right image */}
                    <div className="flex-1 flex justify-center lg:justify-end mb-8 lg:mb-0">
                        <img src={aboutus1}              alt="About Us Hero"  className="rounded shadow-md"/>
                    </div>
                </div>
            </section>
      
       
            <section className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                    {/* Text */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We’re on a mission to provide educators with powerful tools to
                            assess student work, detect plagiarism, and give meaningful, timely
                            feedback. Our approach is grounded in promoting original thinking,
                            improving learning outcomes, and supporting academic integrity.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="order-1 md:order-2 flex justify-center">
                        <img
                            src={aboutus2}
                            alt="Mission"
                            className="rounded shadow-md" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                    {/* Image */}
                    <div className="flex justify-center">
                        <img
                            src={aboutus4}
                            alt="Integration"
                            className="rounded shadow-md"
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Unparalleled Access
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Our Intelligent Evaluation & Feedback Platform tools are LTI-certified and
                            integrate with more than 100 platforms in the educational ecosystem,
                            including learning management systems, single sign-on providers,
                            student information systems, and collaboration tools.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Text */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Human-centered AI
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Our people-centered approach to artificial intelligence puts machine
                            learning to work, easing educator workloads, anticipating the
                            integrity needs of tomorrow, and improving assessment for everyone.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="flex justify-center">
                        <img
                            src={aboutus3}
                            alt="AI Approach"
                            className="rounded shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-teal-900 text-white py-8">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">About Us</h3>
                        <p className="text-sm mb-2">
                            Our project, the Intelligent Evaluation & Feedback Platform,
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
                                <a href="#login" className="hover:text-gray-200 transition">
                                    Login
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

export default AboutUs;
