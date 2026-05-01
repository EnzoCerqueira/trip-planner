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
  const [imagemCidade, setImagemCidade] = useState<string | undefined>(
    undefined,
  );

  const [distanciaFinal, setDistanciaFinal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

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

  async function catchCuriosity(cityName: string) {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${cityName}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setCuriosidade(data.extract);
      if (data.thumbnail && data.thumbnail.source) {
        setImagemCidade(data.thumbnail.source);
      } else {
        setImagemCidade(undefined);
      }
    } catch (error) {
      console.error("Error ao buscar curiosidade:", error);
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
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Ocorreu um erro durante o cálculo da viagem:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="bg-gray-900 min-h-screen flex flex-col">
        <header className="flex items-center justify-center">
          <h1 className="text-blue-200 font-bold text-4xl p-4 md:p-8">
            Trip Planner
          </h1>
        </header>

        <main className="flex-1 flex justify-center items-center p-6">
          {passoAtual === 1 && (
            <div className="flex flex-col items-center">
              {/* Logo mantém o tamanho original, mas diminui um pouco no mobile se necessário */}
              <img src={Logo} alt="Trip Planner Logo" className="mb-10 w-full max-w-[500px]" />
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter your current city..."
                  className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4 rounded w-full md:w-80 h-12"
                  value={cidadeOrigem}
                  onChange={(e) => setCidadeOrigem(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 border border-blue-700 rounded cursor-pointer w-full md:w-auto h-12 whitespace-nowrap transition-colors"
                  onClick={nextStep}
                >
                  Add Location
                </button>
              </div>
            </div>
          )}

          {passoAtual === 2 && (
            <div className="flex flex-col items-center">
              <img src={Logo} alt="Trip Planner Logo" className="mb-10 w-full max-w-[500px]" />
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter a destination city..."
                  className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4 rounded w-full md:w-80 h-12"
                  value={cidadeDestino}
                  onChange={(e) => setCidadeDestino(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    className={`flex-1 md:flex-none font-bold py-2 px-6 border rounded text-white h-12 transition-colors ${
                      isLoading
                        ? "bg-gray-500 border-gray-600 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 border-blue-700 cursor-pointer"
                    }`}
                    onClick={travelCalculator}
                    disabled={isLoading}
                  >
                    {isLoading ? "⏳" : "Calculate Route"}
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer h-12"
                    onClick={backOneStep}
                  >
                    <TbArrowBackUp />
                  </button>
                </div>
              </div>
            </div>
          )}

          {passoAtual === 3 && (
            <div className="flex flex-col items-center w-full max-w-4xl px-4">
              {imagemCidade && (
                <img
                  src={imagemCidade}
                  alt="Imagem da cidade"
                  className="mb-8 rounded-xl shadow-2xl object-cover"
                />
              )}
              
              {/* Container de Clima e KM com gap original (40) no desktop */}
              <div className="flex flex-col md:flex-row justify-around items-center gap-10 md:gap-40 mb-10 w-full border-b border-gray-700 pb-10">
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-white mb-2">
                    {climaDestino?.temperatura}°C
                  </h2>
                  <p className="text-blue-400 text-lg capitalize">
                    {climaDestino?.descricao}
                  </p>
                </div>

                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {distanciaFinal} <span className="text-2xl font-normal">km</span>
                  </h2>
                  <p className="text-gray-400 text-lg">distância ✈️</p>
                </div>
              </div>

              <div className="max-w-2xl text-center">
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic">
                  {curiosidade}
                </p>
              </div>

              <button
                onClick={backOneStep}
                className="mt-12 bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-full text-lg transition-all cursor-pointer flex items-center gap-3 border border-gray-600"
              >
                <TbArrowBackUp /> Nova pesquisa
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
