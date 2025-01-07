import SearchFilter from "../components/SearchFilter";
import CardSection from "../components/CardSection";

const Dashboard = () => {
    return (
        <div className="min-h-screen ">
     
            <main className=" mx-auto mt-4 py-20 px-4">
                <SearchFilter />
                <CardSection />
            </main>
        </div>
    );
};

export default Dashboard;
