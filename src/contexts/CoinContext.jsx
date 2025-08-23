import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Создаём контекст с начальными значениями
const CoinContext = createContext({
  coins: 0,
  loading: true,
  addCoins: () => Promise.resolve(),
  deductCoins: () => Promise.resolve(false),
  fetchCoins: () => Promise.resolve()
});

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCoins = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get("/api/auth/coins", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoins(response.data.coins);
    } catch (error) {
      console.error("Coin fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deductCoins = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      
      await axios.post("/api/auth/coins/deduct", { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCoins();
      return true;
    } catch (error) {
      console.error("Coin deduct error:", error);
      return false;
    }
  };

  // Добавляем другие методы (addCoins и т.д.)

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <CoinContext.Provider value={{ coins, loading, deductCoins, fetchCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

// Хук с проверкой контекста
export const useCoins = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoins must be used within CoinProvider");
  }
  return context;
};