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
      }]
    }
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