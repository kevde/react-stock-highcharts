import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { Grid } from '@material-ui/core';
import CallPutForm from './CallPutForm';
import { StockChartContext } from './StockChartContext';
import { BET, ONE_SECOND } from './constants';
class StockChart extends React.Component {
  static contextType = StockChartContext

  handleLoad = (event) => {
    const { onChartLoaded } = this.props;
    onChartLoaded && onChartLoaded(event);
    setInterval(() => {
      this.context.movePurchaseTimeBar(event.target)
      this.context.evaluateBetOpen(event.target)
    }, ONE_SECOND)
  }

  options = {
    chart: {
      zoomType: 'x',
      events: {
        load: this.handleLoad
      }

    },
    title: {
      text: this.props.title,
    },
    exporting: {
      enabled: false
    },
    xAxis: {
      minRange: 30 * ONE_SECOND,
      overscroll: 30 * ONE_SECOND,
      plotLines: [{
        value: moment().unix() * ONE_SECOND,
        width: 1,
        color: '#000000',
        label: {
          text: 'Purchase Time'
        }
      }, {
        value: (moment().unix() + 15) * ONE_SECOND,
        width: 1,
        color: '#000000',
        label: {
          text: 'Result'
        }
      }],
    },
    navigator: {
      enabled: this.props.navigatorEnabled || false,
      xAxis: {
        minRange: 30 * ONE_SECOND,
        overscroll: 60 * ONE_SECOND,
        maxZoom: 90 * ONE_SECOND,
      }
    },
    rangeSelector: {
      allButtonsEnabled: true,
      selected: 1,
      buttons: [{
        type: 'millisecond',
        count: 15000,
        text: '15s'
      }, {
        type: 'minute',
        count: 1,
        text: '1m',
        title: '1 minute'
      },
      {
        type: 'minute',
        count: 30,
        text: '30m',
        title: '30 minutes'
      }
        , {
        type: 'hour',
        count: 1,
        text: '1h',
        title: '1 Hour'
      }, {
        type: 'hour',
        count: 2,
        text: '2h',
        title: '2 Hours'
      }, {
        type: 'hour',
        count: 4,
        text: '4h',
        title: '4 Hours'
      }]
    },
    series: [{
      name: this.props.currencyPair,
      type: 'area',
      data: (() => {
        // generate an array of random data
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
      })(),
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
      },
      threshold: null
    }, {
      type: 'flags',
    }],
    yAxis: {
      title: {
        text: 'Exchange rate'
      },
      crosshair: true,
      // plotBands: [{
      //   from: 34000,
      //   to: 0,
      //   color: 'rgba(68, 170, 213, 0.2)',
      //   label: {
      //     text: 'Last quarter year\'s value range'
      //   }
      // }]
    }
  }

  getPrices() {
    return this.props.prices || [];
  }

  render() {
    return (
      <Grid container>
        <Grid item>
          <HighchartsReact
            ref={this.context.chartRef}
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={this.options}
          />
        </Grid>
        <Grid item>
          <CallPutForm />
        </Grid>
      </Grid>
    )
  }
}

export default StockChart;