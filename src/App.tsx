import "./App.css";
import Logo from "./assets/images/trip-planner-logo.png";

function App() {
  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <header className="flex items-center justify-center">
          <h1 className="text-red-500 font-bold text-4xl p-4">Trip Planner</h1>
        </header>
        <main className="flex justify-center items-center">
          <div className="hidden">
            <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
            <div className="flex justify-center items-center">
              <input
                type="text"
                placeholder="Enter a destination..."
                className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-5 py-2 px-4 rounded w-64"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer">
                Add Destination
              </button>
            </div>
          </div>
          <div className="">
            <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
            <div className="flex justify-center items-center">
            <input
              type="text"
              placeholder="Enter your current city..."
              className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-5 py-2 px-4 rounded w-64"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer">
              Add Location
            </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
