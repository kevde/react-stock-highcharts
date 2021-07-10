import React from 'react';
import moment from 'moment';
import { BET, ONE_SECOND } from './constants';
import CronSchedule from './utils/CronSchedule';
import ProfitCalculator from './utils/ProfitCalculator';

export const StockChartContext = React.createContext();

class StockChartContextProvider extends React.Component {
  chartRef = React.createRef()

  state = {
    prices: [],
    isBetting: false,
    isBetOpen: true,
    betPrice: 1,
    profit: 0,
    currentPoint: null,
    isFinishedBetSubmitted: false,
    bets: [],
    purchaseTime: null,
    resultTime: null,
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

  evaluateBetOpen = () => {
    const currentUnixTime = moment().unix() * ONE_SECOND;
    const isBetOpen = (currentUnixTime < this.state.purchaseTime) && (this.state.resultTime > currentUnixTime);
    this.setState({ isBetOpen })
  }

  reloadFlags = (profit) => {
    if (this.chartRef.current) {
      const winningCallSeries = this.chartRef.current.chart.series[1];
      const losingCallSeries = this.chartRef.current.chart.series[2];
      const evenCallSeries = this.chartRef.current.chart.series[3];

      const winningPutSeries = this.chartRef.current.chart.series[4];
      const losingPutSeries = this.chartRef.current.chart.series[5];
      const evenPutSeries = this.chartRef.current.chart.series[6];

      winningCallSeries.setData(this.getWinningCallFlags(profit));
      losingCallSeries.setData(this.getLosingCallFlags(profit));
      evenCallSeries.setData(this.getEvenCallFlags(profit));

      winningPutSeries.setData(this.getWinningPutFlags(profit));
      losingPutSeries.setData(this.getLosingPutFlags(profit));
      evenPutSeries.setData(this.getEvenPutFlags(profit));
    }
  }

  movePurchaseTimeBar = (chart, props) => {
    const currentUnixTime = moment().unix();
    const purchaseBar = _.get(chart, `xAxis.0.plotLinesAndBands.0`);
    const resultBar = _.get(chart, `xAxis.0.plotLinesAndBands.1`);
    const resultBarValue = _.get(resultBar, `options.value`);
    const isBettingDone = this.isBettingDone(resultBarValue, currentUnixTime);

    if (isBettingDone === true && !this.state.isFinishedBetSubmitted) {
      this.finalizeBets(props.onBettingFinished);
      this.setState({ isFinishedBetSubmitted: true })
    }

    if (isBettingDone === true && this.state.isFinishedBetSubmitted) {
      const purchaseTime = CronSchedule.getNextSchedule(props.betInterval);
      const resultTime = CronSchedule.getResultTime(purchaseTime, props.closedBetGap);
      purchaseBar.options.value = purchaseTime;
      resultBar.options.value = resultTime;
      this.setState({
        purchaseTime,
        resultTime,
        isFinishedBetSubmitted: false,
        bets: []
      }, () => {
        this.reloadFlags(props.profit);
      });
    }
  }

  isBettingDone(resultBarValue, currentUnixTime) {
    return resultBarValue < ((currentUnixTime - 2) * ONE_SECOND);
  }

  finalizeBets(onBettingFinished) {
    const bets = this.state.bets;
    const currentPrice = this.state.currentPoint[1];
    const finalizedBets = _.map(bets, (bet) => {
      if (bet.price === currentPrice) {
        bet.profit = bet.betPrice
      }

      if (bet.price < currentPrice && bet.state == BET.CALL) {
        bet.profit = ProfitCalculator.getTotalProfit(bet.betPrice, bet.expectedProfit, 1);
      }

      if (bet.price > currentPrice && bet.state == BET.CALL) {
        bet.profit = 0;
      }

      if (bet.price > currentPrice && bet.state == BET.PUT) {
        bet.profit = ProfitCalculator.getTotalProfit(bet.betPrice, bet.expectedProfit, 1);
      }

      if (bet.price < currentPrice && bet.state == BET.PUT) {
        bet.profit = 0;
      }

      bet.result = 'FINISHED'

      return bet;
    });

    onBettingFinished && onBettingFinished(finalizedBets, this.state.currentPoint);
  }


  changePurchaseAndResultTime = (purchaseTime, resultTime) => {
    this.setState({ purchaseTime, resultTime })
  }

  handleAddCall = (profit) => () => {
    const [currentUnixTime, currentPrice] = this.state.currentPoint;
    const bet = {
      date: currentUnixTime,
      betPrice: this.state.betPrice,
      price: currentPrice,
      state: BET.CALL,
      expectedProfit: profit,
      result: 'PENDING'
    };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] }, () => {
      this.reloadFlags(profit);
    })
  }

  handleAddPut = (profit) => () => {
    const currentPrice = this.state.currentPoint[1];
    const bet = {
      date: this.state.currentPoint[0],
      betPrice: this.state.betPrice,
      price: currentPrice,
      state: BET.PUT,
      expectedProfit: profit,
      result: 'PENDING'
    };
    this.setState({ isBetting: true, bets: [...this.state.bets, bet] }, () => {
      this.reloadFlags();
    })
  }

  getWinningCallFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.CALL
      && b.price < this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit, this.createWinningCallFlagText)
  }

  getLosingCallFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.CALL
      && b.price > this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit,
      (sortedFlags, profit) => this.createLosingCallFlagText(sortedFlags, profit))
  }

  getEvenCallFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.CALL
      && b.price === this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit,
      (sortedFlags, profit) => this.createEvenCallFlagText(sortedFlags))
  }

  getWinningPutFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.PUT
      && b.price > this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit, this.createWinningCallFlagText)
  }

  getLosingPutFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.PUT
      && b.price < this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit,
      (sortedFlags, profit) => this.createLosingCallFlagText(sortedFlags, profit))
  }

  getEvenPutFlags(profit) {
    const flags = _.filter(this.state.bets, (b) =>
      b.result === 'PENDING' && b.state === BET.PUT
      && b.price === this.state.currentPoint[1]
    );

    const flagGroups = this.groupFlagsByDate(flags)
    return this.createFlagsByGroups(flagGroups, profit,
      (sortedFlags, profit) => this.createEvenCallFlagText(sortedFlags))
  }

  createFlagsByGroups(flagGroups, profit, generateTextCommand) {
    return _.map(flagGroups || [], (sortedFlags, date) => {
      const newText = generateTextCommand(sortedFlags, profit);
      return {
        x: Number(date),
        y: sortedFlags[0].price,
        title: `${sortedFlags[0].state} ${sortedFlags[0].betPrice} x ${sortedFlags.length}`,
        text: newText,
      };
    });
  }

  createWinningCallFlagText = (sortedFlags, profit) => {
    return `
          ${sortedFlags[0].state}: ${sortedFlags[0].price}
          current price: ${this.state.currentPoint[1]}
          profit: ${ProfitCalculator.getTotalProfit(this.state.betPrice, profit, sortedFlags.length)}
        `;
  }

  createLosingCallFlagText = (sortedFlags, profit) => {
    return `
          ${sortedFlags[0].state}: ${sortedFlags[0].price}
          current price: ${this.state.currentPoint[1]}
          profit: 0
        `;
  }

  createEvenCallFlagText = (sortedFlags) => {
    return `
          ${sortedFlags[0].state}: ${sortedFlags[0].price}
          current price: ${this.state.currentPoint[1]}
          profit: ${ProfitCalculator.getTotalProfit(this.state.betPrice, 0, sortedFlags.length)}
        `;
  }

  groupFlagsByDate(flags) {
    return _.groupBy(flags, (flag) => {
      return flag.date;
    });
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