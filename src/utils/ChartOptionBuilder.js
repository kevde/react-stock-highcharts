import Highcharts from "highcharts";
import { AVAILABLE_RANGES, ONE_SECOND } from "../constants";
import CronSchedule from "./CronSchedule";

class ChartOptionBuilder {
  constructor(reactComponent) {
    this.reactComponent = reactComponent;
    this.chartOptions = this.createBasicOption(reactComponent)
  }

  createBasicOption(reactComponent) {
    return {
      chart: {
        zoomType: 'x',
        events: {
          load: reactComponent.handleLoad.bind(reactComponent)
        },
        exporting: {
          enabled: false
        },
      }
    };
  }

  withTitle(title) {
    this.chartOptions.title = {
      text: title,
    };
    return this;
  }

  withNextSchedule(purchaseTime, resultTime) {
    this.chartOptions.xAxis = {
      minRange: 30 * ONE_SECOND,
      overscroll: 30 * ONE_SECOND,
      // offset: 30,
      plotLines: [{
        value: purchaseTime,
        width: 1,
        color: '#000000',
        label: {
          text: 'Purchase Time'
        }
      }, {
        value: resultTime,
        width: 1,
        color: '#000000',
        label: {
          text: 'Result'
        }
      }],
    }
    return this;
  }

  withNavigator(navigatorEnabled) {
    this.chartOptions.navigator = {
      enabled: navigatorEnabled || false,
      xAxis: {
        minRange: 30 * ONE_SECOND,
        overscroll: 60 * ONE_SECOND,
        maxZoom: 90 * ONE_SECOND,
      }
    }
    return this;
  }

  withRangeSelectors() {
    this.chartOptions.rangeSelector = {
      allButtonsEnabled: true,
      selected: 1,
      buttons: _.map(AVAILABLE_RANGES, (range) => {
        return {
          type: range.type,
          count: range.count,
          text: range.text,
          title: range.title,
          events: {
            click: this.reactComponent.handleRangeSelectorClicked(range).bind(this.reactComponent)
          }
        }
      })
    };
    return this;
  }

  withYAxis(title) {
    this.chartOptions.yAxis = {
      title: {
        text: title
      },
      crosshair: true,
    }
    return this;
  }

  withData(initialValues, currencyPair) {
    this.chartOptions.series = [{
      name: currencyPair,
      type: 'area',
      data: initialValues,
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
      },
      threshold: null
    }, {
      type: 'flags',
      centerInCategory: true,
    }];
    return this;
  }

  build() {
    return this.chartOptions;
  }
}

export default ChartOptionBuilder;