// src/utils/mockData.ts

export const getMockHoldings = (rra: number) => {
  // Aggressive (Low RRA: ~1-4)
  if (rra < 4) {
    return [
      { symbol: "BTC", name: "Bitcoin Core", qty: 0.42, price: 5420000, change: "+5.2%", allocation: "35%" },
      { symbol: "NVDA", name: "Nvidia Corp", qty: 15, price: 78000, change: "+3.8%", allocation: "25%" },
      { symbol: "ETH", name: "Ethereum", qty: 4.5, price: 280000, change: "+6.1%", allocation: "20%" },
      { symbol: "TSLA", name: "Tesla Inc", qty: 10, price: 18000, change: "-1.2%", allocation: "15%" },
      { symbol: "SOL", name: "Solana", qty: 50, price: 12000, change: "+12.4%", allocation: "5%" },
    ];
  } 
  // Conservative (High RRA: ~7-10)
  else if (rra > 7) {
    return [
      { symbol: "GOLD", name: "Sovereign Gold Bond", qty: 500, price: 6200, change: "+0.2%", allocation: "40%" },
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", qty: 250, price: 1450, change: "+0.5%", allocation: "25%" },
      { symbol: "LIQUIDBEES", name: "Liquid ETF", qty: 1000, price: 1000, change: "+0.01%", allocation: "20%" },
      { symbol: "RELIANCE", name: "Reliance Industries", qty: 40, price: 2650, change: "+0.8%", allocation: "10%" },
      { symbol: "TCS", name: "Tata Consultancy", qty: 10, price: 3820, change: "-0.1%", allocation: "5%" },
    ];
  }
  // Moderate (Mid RRA: ~4-7)
  else {
    return [
      { symbol: "RELIANCE", name: "Reliance Industries", qty: 100, price: 2650, change: "+2.5%", allocation: "30%" },
      { symbol: "INFY", name: "Infosys Ltd", qty: 75, price: 1620, change: "+3.1%", allocation: "25%" },
      { symbol: "NIFTYBEES", name: "Nifty 50 ETF", qty: 500, price: 220, change: "+1.2%", allocation: "20%" },
      { symbol: "AAPL", name: "Apple Inc", qty: 5, price: 15000, change: "+0.9%", allocation: "15%" },
      { symbol: "GOLD", name: "Gold ETF", qty: 100, price: 5000, change: "+0.1%", allocation: "10%" },
    ];
  }
};