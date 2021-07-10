import React from 'react';
import { FormControlLabel, Grid, InputAdornment, Switch, TextField, Typography } from '@material-ui/core';

class DemoPropsForm extends React.Component {
  handleNavigatorEnabled = (event) => {
    const value = Boolean(event.target.checked);
    this.setState({ navigatorEnabled: value })
    process.nextTick(() => {
      this.props.onChange && this.props.onChange(this.state)
    })
  }

  handleChangeText = (propertyName) => (event) => {
    const value = Number(event.target.value);
    this.setState({ [propertyName]: value })
    process.nextTick(() => {
      this.props.onChange && this.props.onChange(this.state)
    })
  }

  renderNavigatorEnabled() {
    return (
      <FormControlLabel
        value={true}
        disabled={this.props.disabled}
        onChange={this.handleNavigatorEnabled}
        control={<Switch color="primary" />}
        label="Is Navigator Enabled"
        labelPlacement="start"
      />
    )
  }

  renderProfit() {
    return (
      <FormControlLabel
        value={this.props.value.profit}
        disabled={this.props.disabled}
        onChange={this.handleChangeText('profit')}
        control={<TextField
          variant="outlined"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                %
              </InputAdornment>
            ),
          }}
          style={{ paddingLeft: '20px' }} />}
        label="Profit"
        labelPlacement="start"
      />
    )
  }

  renderBetInterval() {
    return (
      <FormControlLabel
        value={this.props.value.betInterval}
        disabled={this.props.disabled}
        onChange={this.handleChangeText('betInterval')}
        control={<TextField
          variant="outlined"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                seconds
              </InputAdornment>
            ),
          }}
          style={{ paddingLeft: '20px' }} />}
        label="Bet Interval"
        labelPlacement="start"
      />
    )
  }

  renderClosedBetGap() {
    return (
      <FormControlLabel
        value={this.props.value.closedBetGap}
        disabled={this.props.disabled}
        onChange={this.handleChangeText('closedBetGap')}
        control={<TextField
          variant="outlined"
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                seconds
              </InputAdornment>
            ),
          }}
          style={{ paddingLeft: '20px' }} />}
        label="Closed Bet Gap"
        labelPlacement="start"
      />
    )
  }

  render() {
    return (
      <Grid container direction="column" spacing="3">
        <Grid item>
          <Typography variant="h5">Props of Stock Highchart</Typography>
        </Grid>
        <Grid item>
          {this.renderNavigatorEnabled()}
        </Grid>
        <Grid item>
          {this.renderProfit()}
        </Grid>
        <Grid item>
          {this.renderBetInterval()}
        </Grid>
        <Grid item>
          {this.renderClosedBetGap()}
        </Grid>
      </Grid>
    )
  }
}

export default DemoPropsForm;