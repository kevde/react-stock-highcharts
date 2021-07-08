import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { StockChartContext } from './StockChartContext';

class CallPutForm extends React.Component {
  static contextType = StockChartContext;

  render() {
    return (
      <Grid container direction="column" spacing="3">
        <Grid item>
          <TextField label="Bet Price"
            value={this.context.betPrice}
          disabled={!this.context.isBetOpen}
            onChange={this.context.handleChangeBetPrice} />
        </Grid>
        <Grid item>
          <Button
            onClick={this.context.handleAddCall}
            disabled={!this.context.isBetOpen}
            variant="contained"
            color="primary">Call</Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.context.handleAddPut}
            disabled={!this.context.isBetOpen}
            variant="contained"
            color="secondary">Put</Button>
        </Grid>
      </Grid>
    )
  }
}

export default CallPutForm;