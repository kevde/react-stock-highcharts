export const ZOOM_SIZES = {
  THIRTY_MINUTES: '30min',
  ONE_HOUR: '1hr',
  TWO_HOURS: '2hr',
  FOUR_HOURS: '4hr',
};

export const BET = {
  CALL: 'call',
  PUT: 'put',
}

export const ONE_SECOND = 1000;

export const AVAILABLE_RANGES = [{
  type: 'millisecond',
  count: 15000,
  text: '15s'
}, {
  type: 'minute',
  count: 1,
  text: '1m',
  title: '1 minute'
},
{
  type: 'minute',
  count: 30,
  text: '30m',
  title: '30 minutes'
}
  , {
  type: 'hour',
  count: 1,
  text: '1h',
  title: '1 Hour'
}, {
  type: 'hour',
  count: 2,
  text: '2h',
  title: '2 Hours'
}, {
  type: 'hour',
  count: 4,
  text: '4h',
  title: '4 Hours'
}];