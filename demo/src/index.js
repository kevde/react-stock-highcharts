import React, { Component } from 'react'
import { render } from 'react-dom'
import 'rc-picker/assets/index.css';
import StockChart from '../../src'
import WebsocketWrapper from './WebsocketWrapper';
import StockChartContextProvider, { StockChartContext } from '../../src/StockChartContext';
import { Card, Grid } from '@material-ui/core';
import DemoPropsForm from './DemoPropsForm';
import ResultsTable from './ResultsTable';

export default class Demo extends Component {
  static contextType = StockChartContext;
  state = {
    profit: 70,
    betInterval: 30,
    closedBetGap: 5,
    currencyPair: "BTC/USDT",
  }

  componentDidMount() {
    this.websocketWrapper = new WebsocketWrapper(this.handleWebsocketAddPrice)
  }

  componentWillUnmount() {
    this.websocketWrapper.close();
  }

  handleWebsocketAddPrice = (priceData) => {
    const currentPoint = [priceData.E, Number(priceData.p)];
    this.context.addPrice(currentPoint);
  }

  handleStateChange = (newState) => {
    this.setState(newState);
  }

  handleSummarizeResults = (bets, lastPricePoint) => {
    this.setState({ bets, lastPricePoint })
  }

  handleInitialValues = () => {
    var data = [],
      time = (new Date()).getTime(),
      i;

    for (i = -999; i <= 0; i += 1) {
      data.push([
        time + i * 1000,
        Math.round(Math.random() * 100) + 33800
      ]);
    }
    return data;
  }

  renderDemoCard() {
    return (
      <Grid container>
        <Grid item md={6}>
          <DemoPropsForm
            value={this.state}
            // disabled={this.context.isBetOpen}
            onChange={this.handleStateChange}
          />
        </Grid>
        <Grid item md={6}>
          {this.state.bets && <ResultsTable
            bets={this.state.bets}
            lastPricePoint={this.state.lastPricePoint}
            currencyPair={this.state.currencyPair}
          />}
        </Grid>
      </Grid>
    )
  }

  render() {
    return (
      <div>
        <Grid container style={{ backgroundColor: 'lightgray' }}>
          <Grid item md={12}>
            <h1>stock-highcharts Demo</h1>
          </Grid>
          <Grid item md={12}>
            <Card style={{ margin: '20px', padding: '20px' }}>
              <StockChart
                title="Sample Stock Chart"
                ref={this.chart}
                currencyPair={this.state.currencyPair}
                profit={this.state.profit}
                initialValues={this.handleInitialValues}
                closedBetGap={this.state.closedBetGap}
                betInterval={this.state.betInterval}
                navigatorEnabled={this.state.navigatorEnabled}
                onBettingFinished={this.handleSummarizeResults}
              />
            </Card>
          </Grid>
          <Grid item md={12} style={{ padding: '30px' }}>
            <i>Below are properties that needs to be configured for this react component</i>
            {this.renderDemoCard()}
          </Grid>
        </Grid>
      </div>
    )
  }
}

render(
  <StockChartContextProvider>
    <Demo />
  </StockChartContextProvider>
  , document.querySelector('#demo'))
