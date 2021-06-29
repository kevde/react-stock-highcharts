import React from 'react';
import moment from 'moment';

export const StockChartContext = React.createContext();

class StockChartContextProvider extends React.Component {
  state = {
    prices: [],
  }

  addStockPrice = (time, price) => {
    const newPricePoint = [moment(time).unix(), price];
    const newPrices = [...this.state.prices, newPricePoint];
    this.setState({ prices: newPrices })
  }

  render() {
    return (
      <StockChartContext.Provider
        value={{
          ...this.state,
          addStockPrice: this.addStockPrice
        }}>
        {this.props.children}
      </StockChartContext.Provider>
    )
  }
}

export default StockChartContextProvider;