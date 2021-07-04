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
        data: this.props.prices || []
      }, {
        type: 'flags',
        data: this.props.buys || []
      }, {
        type: 'flags',
        data: this.sellFlags || []
      }]
    }
  }

  get sellFlags() {
    const sells = this.props.sells;
    return _.map(sells || [], (sell) => {
      return {
        x: sell[0],
        title: `BUY: ${sell[1]}`,
        text: `BUY: ${sell[1]}`
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