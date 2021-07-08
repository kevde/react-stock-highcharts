import React from 'react';
import moment from 'moment';
import { BET, ONE_SECOND } from './constants';

export const StockChartContext = React.createContext();

class StockChartContextProvider extends React.Component {
  chartRef = React.createRef()

  state = {
    prices: [],
    isBetting: false,
    isBetOpen: true,
    betPrice: 0,
    currentPoint: null,
    bets: [],
  }

  addPrice = ([date, price]) => {
    const series = this.chartRef.current.chart.series[0];
    series.addPoint([date, price], true, true)
    this.setState({ currentPoint: [date, price] })
  }
  
  handleChangeBetPrice = (event) => {
    this.setState({ betPrice: event.target.value })
  }
  
  evaluateBetOpen = (chart) => {
    const currentUnixTime = moment().unix() * ONE_SECOND;
    const purchaseBar = _.get(chart, `xAxis.0.plotLinesAndBands.0`);
    const resultBar = _.get(chart, `xAxis.0.plotLinesAndBands.1`);
    const purchaseTimeValue = _.get(purchaseBar, `options.value`);
    const resultBarValue = _.get(resultBar, `options.value`);
    const isBetOpen = (currentUnixTime < purchaseTimeValue) && (resultBarValue > currentUnixTime);
    this.setState({ isBetOpen })
  }
  
  reloadFlags = () => {
    const series = this.chartRef.current.chart.series[1];
    series.setData(this.flags);
  }

  movePurchaseTimeBar = (chart) => {
    const currentUnixTime = moment().unix();
    const purchaseBar = _.get(chart, `xAxis.0.plotLinesAndBands.0`);
    const resultBar = _.get(chart, `xAxis.0.plotLinesAndBands.1`);
    const resultBarValue = _.get(resultBar, `options.value`);
    if (resultBarValue < (currentUnixTime * ONE_SECOND)) {
      purchaseBar.options.value = (currentUnixTime * ONE_SECOND) + (15 * ONE_SECOND);
      resultBar.options.value = (currentUnixTime * ONE_SECOND) + (30 * ONE_SECOND);
    }
  }

  handleAddCall = () => {
    const bet = { date: this.state.currentPoint[0], price: this.state.currentPoint[1], state: BET.CALL, interval: '15s', result: 'PENDING' };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] })
    this.reloadFlags();
  }
  
  handleAddPut = () => {
    const bet = { date: this.state.currentPoint[0], price: this.state.currentPoint[1], state: BET.PUT, interval: '15s', result: 'PENDING' };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] });
    this.reloadFlags();
  }

  get flags() {
    const flags = _.filter(this.state.bets, (b) => b.result === 'PENDING');
    return _.map(flags || [], (flag) => {
      return {
        x: flag.date,
        y: flag.price,
        title: `${flag.state}: ${flag.price}`,
        text: `${flag.state}: ${flag.price}`
      }
    })
  }

  render() {
    return (
      <StockChartContext.Provider
        value={{
          ...this.state,
          ...this,
        }}>
        {this.props.children}
      </StockChartContext.Provider>
    )
  }
}

export default StockChartContextProvider;