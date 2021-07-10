import React from 'react';
import { Button, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import { StockChartContext } from './StockChartContext';

class CallPutForm extends React.Component {
  static contextType = StockChartContext;

  render() {
    return (
      <Grid container direction="column" spacing="3">
        <Grid item>
          <TextField label="Bet Price"
            variant="outlined"
            type="number"
            min={1}
            value={this.context.betPrice}
            disabled={!this.context.isBetOpen}
            onChange={this.context.handleChangeBetPrice}
            InputProps={{
              min: 1,
              endAdornment: (
                <InputAdornment position="end">
                  $
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="body1">Profit</Typography>
          <Typography variant="h4">{this.props.profit || 0}%</Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={this.context.handleAddCall(this.props.profit)}
            disabled={!this.context.isBetOpen}
            variant="contained"
            color="primary">Call</Button>
        </Grid>
        <Grid item>
          <Button
            onClick={this.context.handleAddPut(this.props.profit)}
            disabled={!this.context.isBetOpen}
            variant="contained"
            color="secondary">Put</Button>
        </Grid>
      </Grid>
    )
  }
}

export default CallPutForm;