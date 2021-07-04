import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'


class StockChart extends React.Component {
  get options() {
    return {
      title: {
        text: this.props.title,
      },
      series: [{
        type: 'area',
        data: this.props.prices || [],
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
        data: this.buyFlags || []
      }, {
        type: 'flags',
        data: this.sellFlags || []
      }]
    }
  }

  get buyFlags() {
    const buys = this.props.buys;
    return _.map(buys || [], (buy) => {
      return {
        x: buy[0],
        y: buy[1],
        title: `BUY: ${buy[1]}`,
        text: `BUY: ${buy[1]}`
      }
    })
  }

  get sellFlags() {
    const sells = this.props.sells;
    return _.map(sells || [], (sell) => {
      return {
        x: sell[0],
        y: sell[1],
        title: `SELL: ${sell[1]}`,
        text: `SELL: ${sell[1]}`
      }
    })
  }

  render() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={this.options}
      />
    )
  }
}

export default StockChart;