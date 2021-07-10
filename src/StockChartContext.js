import React from 'react';
import moment from 'moment';
import { BET, ONE_SECOND } from './constants';
import CronSchedule from './utils/CronSchedule';

export const StockChartContext = React.createContext();

class StockChartContextProvider extends React.Component {
  chartRef = React.createRef()

  state = {
    prices: [],
    isBetting: false,
    isBetOpen: true,
    betPrice: 1,
    currentPoint: null,
    bets: [],
  }

  addPrice = ([date, price]) => {
    const series = this.chartRef.current.chart.series[0];
    series.addPoint([date, price], true, true)
    this.setState({ currentPoint: [date, price] })
  }

  redrawPoint = (chart) => {
    const series = chart.series[0];
    if (this.state.currentPoint) {
      series.addPoint([moment().unix() * ONE_SECOND, this.state.currentPoint[1]], true, true)
    }
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

  movePurchaseTimeBar = (chart, props) => {
    const currentUnixTime = moment().unix();
    const purchaseBar = _.get(chart, `xAxis.0.plotLinesAndBands.0`);
    const resultBar = _.get(chart, `xAxis.0.plotLinesAndBands.1`);
    const resultBarValue = _.get(resultBar, `options.value`);
    if (resultBarValue < ((currentUnixTime - 2) * ONE_SECOND)) {
      const purchaseTime = CronSchedule.getNextSchedule(props.betInterval);
      const resultTime = CronSchedule.getResultTime(purchaseTime, props.closedBetGap);
      purchaseBar.options.value = purchaseTime;
      resultBar.options.value = resultTime;
      this.setState({ purchaseTime, resultTime, bets: [] }, () => {
        this.reloadFlags();
      });
    }
  }

  changePurchaseAndResultTime = (purchaseTime, resultTime) => {
    this.setState({ purchaseTime, resultTime })
  }

  handleAddCall = () => {
    const currentUnixTime = moment().unix() * ONE_SECOND;
    const currentPrice = this.state.currentPoint[1];
    this.addPrice([currentUnixTime, currentPrice])
    const bet = { date: currentUnixTime, price: currentPrice, state: BET.CALL, interval: '15s', result: 'PENDING' };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] }, () => {
      this.reloadFlags();
    })
  }

  handleAddPut = () => {
    const currentUnixTime = moment().unix() * ONE_SECOND;
    const currentPrice = this.state.currentPoint[1];
    this.addPrice([currentUnixTime, currentPrice])
    const bet = { date: currentUnixTime, price: currentPrice, state: BET.PUT, interval: '15s', result: 'PENDING' };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] }, () => {
      this.reloadFlags();
    })
  }

  get flags() {
    const flags = _.filter(this.state.bets, (b) => b.result === 'PENDING');
    return _.map(flags || [], (flag) => {
      return {
        x: flag.date,
        y: flag.price,
        title: `${flag.state}: ${flag.price}`,
        text: `${flag.state}: ${flag.price}`,
        color: "red"
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