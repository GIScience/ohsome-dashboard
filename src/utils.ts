import moment from 'moment';
import {environment} from './environments/environment';

export default class Utils {
  static sanitizeLabel(label) {
    if (label == undefined) { return ''}
    if (label.includes('-_-')) {
      label = label.split('-_-')[1];
    }
    return label.replace(/__/g, ' ');
  }

  static loadEnv(name, defaultValue) {
    if (name in environment && environment[name] !== '') {
      return environment[name];
    } else {
      return defaultValue;
    }
  }

  static setObjectProperty(obj = {}, path, val) {
    const keys = path.split('.')
    const last = keys.pop()
    keys.reduce((o, k) => o[k] ??= {}, obj)[last] = val
  }

  static getFromParamsOrDefault(params: URLSearchParams, key: string, def: string): string {
    if (!params.has(key)) {
      return def;
    } else {
      return params.get(key) || '';
    }
  }

  // helper function which calculates a matching start date for a given end date and period
  // such that: start + n*period ~= end
  static calculateStartDateFromEndAndPeriod(endDate: string, period: string, minDate: string | undefined | null): string {
    if (!minDate) return '';
    const min = moment(minDate);
    const time = moment(endDate);
    const p = moment.duration(period);
    const multiplePeriod = moment.duration();
    do {
      multiplePeriod.add(p);
    } while (moment(time).subtract(multiplePeriod) > min);
    multiplePeriod.subtract(p);
    return moment(time).subtract(multiplePeriod).toISOString();
  }

  static async wait(ms:number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Equality check for 2 sting arrays.
   * - Duplicates are ignored
   * - Order does not matter
   */
  static arraysEqualUnordered(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const setA = new Set(a);
    const setB = new Set(b);
    if (setA.size !== setB.size) return false;
    for (const item of setA) {
      if (!setB.has(item)) return false;
    }
    return true;
  }
}
