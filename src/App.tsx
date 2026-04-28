import { useState } from "react";
import "./App.css";
import Logo from "./assets/images/trip-planner-logo.png";
import { TbArrowBackUp } from "react-icons/tb";

function App() {
  const [passoAtual, setPassoAtual] = useState(1);

  const [cidadeOrigem, setCidadeOrigem] = useState("");
  const [cidadeDestino, setCidadeDestino] = useState("");
  const [climaDestino, setClimaDestino] = useState<any>(null);
  const [curiosidade, setCuriosidade] = useState("");
  const [imagemCidade, setImagemCidade] = useState(null);

  const [distanciaFinal, setDistanciaFinal] = useState(0);

  // const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => {
    if (cidadeOrigem.trim() !== "") {
      setPassoAtual(2);
    } else {
      alert("Por favor, insira a cidade de origem.");
    }
  };

  const backOneStep = () => {
    setPassoAtual(1);
  };

  async function catchCoordinates(cityName: string) {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    //API GeoCoding
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        console.log(
          `📍Cidade: ${cityName} latitude: ${latitude}, longitude: ${longitude}`,
        );
        return { latitude, longitude };
      } else {
        alert(
          `Ops, o mapa nao encontrou a cidade ${cityName}. Por favor, tente novamente.`,
        );
        return null;
      }
    } catch (error) {
      console.error("error ao buscar coordenadas:", error);
      return null;
    }
  }

  async function catchWeather(lat: number, lon: number) {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setClimaDestino({
        temperatura: Math.round(data.main.temp),
        descricao: data.weather[0].description,
        icone: data.weather[0].icon,
      });
      console.log("⛅ Clima capturado:", data.weather[0].description);
    } catch (error) {
      console.error("Error ao buscar clima:", error);
    }
  }

  async function catchCuriosity(cityName: string){
    const url =  `https://pt.wikipedia.org/api/rest_v1/page/summary/${cityName}`

    try{
      const response = await fetch(url);
      const data = await response.json();

      setCuriosidade(data.extract);
    }catch(error){
      console.error("Error ao buscar curiosidade:", error);
    }
  }

  async function catchImageCity(cityName: string){
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${cityName}`

    try{
      const response = await fetch(url);
      const data = await response.json();
      setImagemCidade(data.thumbnail.source);
    }catch(error){
      console.error("Error ao buscar imagem:", error);
      
    }
  }

  function calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const RaioTerra = 6371; // Raio da Terra em Quilômetros

    // Transformando graus em radianos (coisa de matemática)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = RaioTerra * c;

    return Math.round(distancia); // Arredonda para não ter números quebrados!
  }

  async function travelCalculator() {
    const originCoords = await catchCoordinates(cidadeOrigem);
    const destinationCoords = await catchCoordinates(cidadeDestino);

    if (originCoords !== null && destinationCoords !== null) {
      console.log("✅ Sucesso! Temos as coordenadas das duas cidades!");
      const kilometers = calcularDistancia(
        originCoords.latitude,
        originCoords.longitude,
        destinationCoords.latitude,
        destinationCoords.longitude,
      );
      setDistanciaFinal(kilometers);
      await catchWeather(
        destinationCoords.latitude,
        destinationCoords.longitude,
      );
      await catchCuriosity(cidadeDestino);
      setPassoAtual(3);
    } else {
      console.log(
        "❌ Falha ao obter as coordenadas de uma ou ambas as cidades.",
      );
    }
  }

  return (
    <>
      <div className="bg-gray-900 min-h-screen">
        <header className="flex items-center justify-center">
          <h1 className="text-red-500 font-bold text-4xl p-4">Trip Planner</h1>
        </header>
        <main className="flex justify-center items-center">
          {passoAtual === 1 && (
            <div>
              <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Enter your current city..."
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
            <div>
              <img src={Logo} alt="Trip Planner Logo" className="mb-5" />
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Enter a destination city..."
                  className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-5 py-2 px-4 rounded w-64"
                  value={cidadeDestino}
                  onChange={(e) => setCidadeDestino(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mr-3 border border-blue-700 rounded cursor-pointer"
                  onClick={travelCalculator}
                >
                  Calculate Route
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 border border-blue-700 rounded cursor-pointer"
                  onClick={backOneStep}
                >
                  <TbArrowBackUp />
                </button>
              </div>
            </div>
          )}
          {passoAtual === 3 && (
            <div>
              <img src={imagemCidade} alt="Imagem da cidade" className="mb-5" />
              <div className="flex justify-center items-center">
                <div className="flex justify-around gap-40 ">
                  <div>
                    <h2 className="text-3xl text-white">
                      {climaDestino?.temperatura}°C
                    </h2>
                    <h6 className="text-white">{climaDestino?.descricao}</h6>
                  </div>
                  <h2 className="text-3xl text-white">
                    {distanciaFinal} km de distância ✈️
                  </h2>
                </div>
              </div>
              <div className="flex justify-center items-center mt-7">
                <p className="text-white">{curiosidade}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
