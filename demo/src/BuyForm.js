import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import _ from 'lodash'

class BuyForm extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.props.latestPrice);
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