import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment'
import _ from 'lodash'

class BuyForm extends Component {
  state = {
    date: new Date(),
    price: 10,
  }

  handleDateChange = (newDate) => {
    this.setState({ date: newDate });
  }

  handleChangePrice = (event) => {
    this.setState({ price: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    const unixTimestamp = moment(this.state.date).format('x');
    onSubmit && onSubmit([Number(unixTimestamp), Number(this.state.price)]);
    this.setState({ date: new Date() });
  }

  renderForm() {
    const { latestPrice } = this.props;
    return <Form onSubmit={this.handleSubmit}>
      <Form.Group controlId="formPrice">
        <Form.Label>Price</Form.Label>
        {latestPrice[1]}
      </Form.Group>
      <Button variant="primary" type="submit">
        Buy
    </Button>
    </Form>
  }

  render() {
    const { latestPrice } = this.props;
    return !_.isEmpty(latestPrice) ? this.renderForm() : <></>;
  }
}

export default BuyForm