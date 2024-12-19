
const Header = () => {
    return (
        <header className="flex justify-between items-center p-4 border-b shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
            <nav className="flex items-center space-x-4">
                <p className="text-gray-600 font-medium">Courses</p>
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    <img
                        src="https://via.placeholder.com/150" // Replace with real user image
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </nav>
        </header>
    );
};

export default Header;
