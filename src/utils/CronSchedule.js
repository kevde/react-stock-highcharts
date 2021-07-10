import parser from 'cron-parser';
import { ONE_SECOND } from '../constants';
import moment from 'moment';

class CronScheduleUtils {
  getNextSchedule(betInterval, startDateUnix) {
    try {
      const cronExpression = `0/${betInterval} * * * * *`;
      return this.createNextScheduleByCron(cronExpression, startDateUnix);
    } catch (error) {
      console.log(error);
      const interval = parser.parseExpression(`0/15 * * * * *`);
      const cronExpression = `0/15 * * * * *`;
      return this.createNextScheduleByCron(cronExpression, startDateUnix);
    }
  }

  getNextBetSchedule(betInterval) {
    const nextSchedule = this.getNextSchedule(betInterval);
    const currentTime = moment().unix() * ONE_SECOND;
    const nextScheduleDifference = nextSchedule - currentTime;
    const betIntervalSeconds = betInterval * ONE_SECOND;
    if (betIntervalSeconds > nextScheduleDifference) {
      const nextBetSchedule = this.getNextSchedule(betInterval, nextSchedule);
      console.log("nextBetSchedule", nextBetSchedule)
      return nextBetSchedule;
    } else {
      return nextSchedule;
    }
  }
  
  createNextScheduleByCron(cronExpression, startDateUnix = new Date()) {
    const options = { startDate: moment(startDateUnix).toDate() };
    const interval = parser.parseExpression(cronExpression, options);
    const nextSchedule = interval.next().toDate();
    const nextScheduleUnix = moment(nextSchedule).unix() * ONE_SECOND;
    console.log("nextScheduleUnix", nextScheduleUnix)
    return nextScheduleUnix;
  }

  getResultTime(nextSchedule, closedBetGap) {
    return nextSchedule + (closedBetGap * ONE_SECOND);
  }
}

export default new CronScheduleUtils();