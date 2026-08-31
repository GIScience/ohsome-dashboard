import {GrowthRateCssClass} from '../../shared/shared-types';
import {components} from '../../shared/ohsome-api-v2-types';

function getCSVHeader(apiVersion: string, attribution: components['schemas']['Attribution']) {
  return `# apiVersion: ${apiVersion}
# attribution.url: ${attribution.url}
# attribution.text: ${attribution.text}
`
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
  getCSVHeader,
  percentFormatter,
  computeGrowthRateCssClass
};
