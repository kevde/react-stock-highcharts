import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment'

class PriceForm extends Component {
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

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="formDate">
          <Form.Label>Date</Form.Label>
          <DateTimePicker
            value={this.state.date}
            onChange={this.handleDateChange}
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={this.state.price}
            onChange={this.handleChangePrice}
            type="number" placeholder="Price" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
  </Button>
      </Form>
    )
  }
}

export default PriceForm