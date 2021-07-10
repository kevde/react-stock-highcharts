
class ProfitCalculator {
  getTotalProfit(betPrice, profit, numberOfBets) {
      const profitFromBetPrice = betPrice * (profit/100)
      const totalFromOneBet = betPrice + profitFromBetPrice;
      return totalFromOneBet * numberOfBets;
  }
}

export default new ProfitCalculator();