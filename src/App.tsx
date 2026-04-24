import { useState } from "react";
import "./App.css";
import Logo from "./assets/images/trip-planner-logo.png";

function App() {
  const [passoAtual, setPassoAtual] = useState(1);

  const [cidadeOrigem, setCidadeOrigem] = useState("");
  const [cidadeDestino, setCidadeDestino] = useState("");
  
  // const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (cidadeOrigem.trim() !== "") {
      setPassoAtual(2);
    } else {
      alert("Por favor, insira a cidade de origem.");
    }
  };

  const backOneStap = () => {
    setPassoAtual(1);
  };

  const handleAddLocation = () => {
    // Logic to add a location
  };
  const handleAddDestination = () => {
    // Logic to add a destination
    setIsVisible(true);
  };

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <header className="flex items-center justify-center">
          <h1 className="text-red-500 font-bold text-4xl p-4">Trip Planner</h1>
        </header>
        <main className="flex justify-center items-center">
          {passoAtual === 1 && (
            <div className="">
              <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Enter a destination..."
                  className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-5 py-2 px-4 rounded w-64"
                  value={cidadeOrigem}
                  onChange={(e) => setCidadeOrigem(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer"
                  onClick={nextStep}
                >
                  Add Location
                </button>
              </div>
            </div>
          )}
          {passoAtual === 2 && (
            <div className="">
              <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Enter your current city..."
                  className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-5 py-2 px-4 rounded w-64"
                  value={cidadeDestino}
                  onChange={(e) => setCidadeDestino(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer"
                  onClick={nextStep}
                >
                  Add Destination
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
