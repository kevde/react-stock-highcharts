import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import { render } from 'react-dom'
import 'rc-picker/assets/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import StockChart from '../../src'
import PriceForm from './PriceForm';
import StockChartContextProvider from '../../src/StockChartContext';

export default class Demo extends Component {
  state = {
    prices: [],
  }

  handleAddPrice = (pricePoint) => {
    const newPrices = [...this.state.prices, pricePoint];
    this.setState({ prices: newPrices })
  }

  render() {
    return <div className="m-4">
      <Row>
        <h1>stock-highcharts Demo</h1>

      </Row>
      <Row>
        <StockChart
          title="Sample Stock Chart"
          prices={this.state.prices}
        />
      </Row>
      <Row>
        <Col>
          <PriceForm 
            onSubmit={this.handleAddPrice}
          />
        </Col>
      </Row>
    </div>
  }
}

render(
  <StockChartContextProvider>
    <Demo />
  </StockChartContextProvider>
  , document.querySelector('#demo'))
