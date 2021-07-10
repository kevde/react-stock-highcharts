import React, { Component } from 'react'
import { render } from 'react-dom'
import 'rc-picker/assets/index.css';
import StockChart from '../../src'
import WebsocketWrapper from './WebsocketWrapper';
import StockChartContextProvider, { StockChartContext } from '../../src/StockChartContext';
import { Grid } from '@material-ui/core';
import DemoPropsForm from './DemoPropsForm';

export default class Demo extends Component {
  static contextType = StockChartContext;
  state = {
    profit: 70,
    betInterval: 30,
    closedBetGap: 5,
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

  handleInitialValues = () => {
    var data = [],
      time = (new Date()).getTime(),
      i;

    for (i = -999; i <= 0; i += 1) {
      data.push([
        time + i * 1000,
        Math.round(Math.random() * 100)
      ]);
    }
    return data;
  }

  render() {
    return <Grid container>
      <Grid item md={12}>
        <h1>stock-highcharts Demo</h1>
      </Grid>
      <Grid item md={12}>
        <StockChart
          title="Sample Stock Chart"
          ref={this.chart}
          currencyPair="BTC/USDT"
          profit={this.state.profit}
          initialValues={this.handleInitialValues}
          closedBetGap={this.state.closedBetGap}
          betInterval={this.state.betInterval}
          navigatorEnabled={this.state.navigatorEnabled}
        />
      </Grid>
      <Grid item md={12}>
        <DemoPropsForm
          value={this.state}
          // disabled={this.context.isBetOpen}
          onChange={this.handleStateChange}
        />
      </Grid>
    </Grid>
  }
}

render(
  <StockChartContextProvider>
    <Demo />
  </StockChartContextProvider>
  , document.querySelector('#demo'))
