import {GrowthRateCssClass} from '../../shared-types';

/**
 * Calculates a growth rate in percent. Value between 0..1.
 * growthRate = ((current - past) / past)
 * @param {number} past
 * @param {number} current
 * @returns {number} growth rate
 */
function growthRate(past: number, current: number) {
  if (past === 0) {
    return null;
  }
  return ((current - past) / past);
}

function shareOf(part: number, whole: number) {
  if (whole === 0) {
    return null;
  }
  return (part / whole);
}

function percentFormatter(percent: number | null): string {
  if (percent == null) {
    return '-- %';
  }

  percent *= 100;

  let decimals = 0;
  let smallSign = '';

  if (Math.abs(percent) < 10) {
    decimals = 2;
    if (Math.abs(percent) < 0.01 && Math.abs(percent) > 0) {
      smallSign = (percent > 0) ? '< ' : '> -';
      return smallSign + '0.01';
    }
  } else if (Math.abs(percent) < 100) {
    decimals = 1;
  }

  return percent.toFixed(decimals) + ' %';
}

function computeGrowthRateCssClass(gRate: number | null): GrowthRateCssClass {

  if (gRate === null || gRate === undefined) {
    return '';
  } else if (gRate > 0) {
    return 'up';
  } else if (gRate < 0) {
    return 'down';
  } else {
    // (gRate === 0)
    return 'right';
  }
}

export {
  shareOf,
  percentFormatter,
  growthRate,
  computeGrowthRateCssClass
};
