import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from "./navbar";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock functions for fetching data (same as before)
// Mock function to fetch stocks list
const baseUrl = "http://127.0.0.1:5000/api/stocks"
const fetchStocks = async () => {
  // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$##############")
  const response = await axios.get(baseUrl)
  console.log(response , "response")
  return response.data;
};

// Mock function to fetch current data for a specific stock
const fetchCurrentData = async (symbol) => {
  const response = await axios.get(baseUrl+"/current/"+symbol)
  return response.data;

};

// Mock function to fetch historical data for a specific stock
const fetchHistoricalData = async (symbol) => {
const response = await axios.get(`${baseUrl}/historical/${symbol}`)
return response.data;
};

// Mock function to fetch changes data for a specific stock
const fetchChangesData = async (symbol) => {
    const response = await axios.get(`${baseUrl}/changes/${symbol}`)
  return response.data;
};
export default function Home() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedClose, setSelectedClose] = useState(null);

  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [changesData, setChangesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const response = await fetchStocks();
        setStocks(response.stocks);
      } catch (error) {
        setError("Failed to load stocks data.");
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  useEffect(() => {
    const loadStockData = async (symbol) => {
      try {
        setLoading(true);
        console.log(symbol)
        const currentData = await fetchCurrentData(symbol);
        const historicalData = await fetchHistoricalData(symbol);
        const changesData = await fetchChangesData(symbol);
        const value = historicalData.slice(0,4)
        setCurrentData(currentData);
        setHistoricalData(value);
        setChangesData(changesData);
      } catch (error) {
        setError("Failed to load stock details.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedStock) {
      loadStockData(selectedStock);
    }
  }, [selectedStock]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  const handleNavigateToDetails = () => {
    router.push(`/stock-details?symbol=${selectedClose+"("+selectedStock+")"}`);
  };

  return (
    <div className="container mx-auto p-4">
    <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="border p-4 rounded-lg shadow-sm cursor-pointer hover:bg-cyan"
            onClick={() => {
              setSelectedStock(stock.symbol)
              setSelectedClose(stock.close)
            }}
          >
            <h3 className="text-lg font-semibold">{stock.close}</h3>
            <p>Symbol: {stock.symbol}</p>
          </div>
        ))}
      </div>

      {selectedStock && currentData && changesData && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setSelectedStock(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">
              Details for {selectedStock}
            </h2>

            <div className="text-gray-800">
              <h3 className="text-lg font-semibold">Current Price</h3>
              <p className="text-gray-600">
                Price: <span className="font-bold">${currentData.current_price}</span>
              </p>

              <h3 className="text-lg font-semibold mt-4">Changes</h3>
              <p className="text-gray-600">
                Today Change:{" "}
                <span className="font-bold">
                  {changesData["today_Change(%)"]}%
                </span>
              </p>
              <p className="text-gray-600">
                One Month Change:{" "}
                <span className="font-bold">
                  {changesData["one_month_change(%)"]}%
                </span>
              </p>
              <p className="text-gray-600">
                One Year Change:{" "}
                <span className="font-bold">
                  {changesData["one_year_change(%)"]}%
                </span>
              </p>

              <h3 className="text-lg font-semibold mt-4">Historical Data</h3>
              <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="w-full bg-gray-200 text-left">
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Open</th>
                  <th className="px-4 py-2 border-b">High</th>
                  <th className="px-4 py-2 border-b">Low</th>
                  <th className="px-4 py-2 border-b">Close</th>

                </tr>
              </thead>
              <tbody>
                {historicalData.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{new Date(data.Date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b">{data.Open.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{data.High.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{data.Low.toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{data.Close.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleNavigateToDetails}
              >
                View Detailed Charts
              </button>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setSelectedStock(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
