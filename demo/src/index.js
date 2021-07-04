import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'
import { render } from 'react-dom'
import 'rc-picker/assets/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockChart from '../../src'
import PriceForm from './PriceForm';
import StockChartContextProvider from '../../src/StockChartContext';
import WebsocketWrapper from './WebsocketWrapper';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

export default class Demo extends Component {
  state = {
    prices: [],
    sells: [],
    buys: [],
  }

  componentDidMount() {
    this.websocketWrapper = new WebsocketWrapper(this.handleWebsocketAddPrice)
  }

  componentWillUnmount() {
    this.websocketWrapper.close();
  }

  handleWebsocketAddPrice = (priceData) => {
    const currentPoint = [priceData.E, Number(priceData.p)];
    const newPrices = [...this.state.prices, currentPoint];
    this.setState({ prices: newPrices, latestPrice: currentPoint });
  }

  handleAddPrice = (pricePoint) => {
    const newPrices = [...this.state.prices, pricePoint];
    this.setState({ prices: newPrices, latestPrice: pricePoint })
  }

  handleAddBuyPoint = (buyPoint) => {
    const newBuys = [...this.state.buys, buyPoint];
    this.setState({ buys: newBuys })
  }

  handleAddSellPoint = (sellPoint) => {
    const newSells = [...this.state.sells, sellPoint];
    this.setState({ buys: newSells })
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
          buys={this.state.buys}
          sells={this.state.sells}
        />
      </Row>
      <Row>
        <Col>
          <BuyForm
            latestPrice={this.props.latestPrice}
            onSubmit={this.handleAddBuyPoint}
          />
          <SellForm
            latestPrice={this.props.latestPrice}
            onSubmit={this.handleAddBuyPoint}
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
