import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import _ from 'lodash'
import { Grid } from '@material-ui/core';
import CallPutForm from './CallPutForm';
import { StockChartContext } from './StockChartContext';
import { BET, ONE_SECOND } from './constants';
import CronSchedule from './utils/CronSchedule';
import ChartOptionBuilder from './utils/ChartOptionBuilder';
class StockChart extends React.Component {
  static contextType = StockChartContext

  state = {
    chartOptions: null,
    chartOptionBuilder: new ChartOptionBuilder(this),
  }

  handleRangeSelectorClicked = (range) => () => {
    console.log(range);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigatorEnabled !== this.props.navigatorEnabled) {
      this.context.chartRef.current.chart.navigator.update({ enabled: this.props.navigatorEnabled });
      this.context.chartRef.current.chart.redraw()
    }

    if (this.props.closedBetGap > 0 && prevProps.closedBetGap !== this.props.closedBetGap) {
      const nextSchedule = CronSchedule.getNextBetSchedule(this.props.betInterval);
      const resultTime = CronSchedule.getResultTime(nextSchedule, this.props.closedBetGap);
      const chartOptionBuilder = this.state.chartOptionBuilder
        .withNextSchedule(nextSchedule, resultTime)
      this.setState({
        chartOptions: chartOptionBuilder.build()
      })
      this.context.chartRef.current.chart.redraw()
    }
  }

  handleLoad(event) {
    const { onChartLoaded } = this.props;
    onChartLoaded && onChartLoaded(event);
    setInterval(() => {
      this.context.movePurchaseTimeBar(event.target, this.props)
      this.context.evaluateBetOpen(event.target)
    }, ONE_SECOND)

    setInterval(() => {
      this.context.reloadFlags(this.props.profit)
    }, ONE_SECOND / 2)
  }

  componentDidMount() {
    const nextSchedule = CronSchedule.getNextSchedule(this.props.betInterval);
    const resultTime = CronSchedule.getResultTime(nextSchedule, this.props.closedBetGap);
    const initialValues = _.isFunction(this.props.initialValues) ? this.props.initialValues() : this.props.initialValues;
    const chartOptionBuilder = this.state.chartOptionBuilder
      .withTitle(this.props.title)
      .withNextSchedule(nextSchedule, resultTime)
      .withNavigator(this.props.navigatorEnabled)
      .withYAxis(`Exchange Rate for ${this.props.currencyPair}`)
      .withRangeSelectors()
      .withData(initialValues, this.props.currencyPair);

    this.context.changePurchaseAndResultTime(nextSchedule, resultTime)
    this.setState({
      chartOptions: chartOptionBuilder.build(),
    })
  }

  render() {
    return (
      <Grid container>
        <Grid item>
          {this.state.chartOptions &&
            <HighchartsReact
              ref={this.context.chartRef}
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={this.state.chartOptions}
            />
          }
        </Grid>
        <Grid item>
          <CallPutForm
            profit={this.props.profit}
          />
        </Grid>
      </Grid>
    )
  }
}

export default StockChart;