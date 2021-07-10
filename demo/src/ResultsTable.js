import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Grid, Typography } from '@material-ui/core';

class ResultsTable extends React.Component {

  renderBet(bet) {
    return <tr>
      <td><Typography variant="body1">{moment(bet.date).toLocaleString()}</Typography></td>
      <td><Typography variant="body1">{bet.price} {this.props.currencyPair}</Typography></td>
      <td><Typography variant="body1">{bet.state}</Typography></td>
      <td><Typography variant="body1">{bet.betPrice}</Typography></td>
      <td><Typography variant="body1">{bet.profit}$</Typography></td>
    </tr>
  }

  render() {
    return (
      <Grid container direction="column" spacing="3">
        <Grid item md={12}>
          <Typography variant="h4">
            Results from the last finished bets
          </Typography>
        </Grid>
        <Grid item md={12}>
          <Typography variant="h6">
            Result Submitted At: {moment(this.props.lastPricePoint[0]).toLocaleString()}
          </Typography>
          <Typography variant="h6">
            Price At: {this.props.lastPricePoint[1]} {this.props.currencyPair}
          </Typography>
        </Grid>
        <Grid item>
          <table cellSpacing={2} cellPadding={2} border={2}>
            <thead>
              <td><Typography variant="h6">Date Purchased</Typography></td>
              <td><Typography variant="h6">Currency Pair Price</Typography></td>
              <td><Typography variant="h6">Action</Typography></td>
              <td><Typography variant="h6">Bet Price</Typography></td>
              <td><Typography variant="h6">Profit</Typography></td>
            </thead>
            {_.map(this.props.bets, (bet) => this.renderBet(bet))}
            <tr>
              <td colspan={3}>Total Profit</td>
              <td>{_.sumBy(this.props.bets, (bet) => bet.profit)}$</td>
            </tr>
          </table>
        </Grid>
      </Grid>
    )
  }
}

export default ResultsTable;