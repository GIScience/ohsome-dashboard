import Utils from './utils';
import moment from 'moment';
import { environment } from './environments/environment';

describe('Utils', () => {
  describe('sanitizeLabel', () => {
    it('should return empty string if label is undefined', () => {
      expect(Utils.sanitizeLabel(undefined as any)).toBe('');
    });

    it('should replace -_- pattern', () => {
      expect(Utils.sanitizeLabel('abc-_-hello__world')).toBe('hello world');
    });

    it('should replace __ with spaces', () => {
      expect(Utils.sanitizeLabel('test__label')).toBe('test label');
    });
  });

  describe('loadEnv', () => {
    it('should return env value if defined', () => {
      (environment as any).TEST_KEY = 'value';
      expect(Utils.loadEnv('TEST_KEY', 'default')).toBe('value');
    });

    it('should return default if not in env', () => {
      expect(Utils.loadEnv('MISSING_KEY', 'default')).toBe('default');
    });
  });

  describe('setObjectProperty', () => {
    it('should set nested property', () => {
      const obj: any = {};
      Utils.setObjectProperty(obj, 'a.b.c', 42);
      expect(obj).toEqual({ a: { b: { c: 42 } } });
    });
  });

  describe('getFromParamsOrDefault', () => {
    it('should return default if key missing', () => {
      const params = new URLSearchParams();
      expect(Utils.getFromParamsOrDefault(params, 'missing', 'default')).toBe('default');
    });

    it('should return value if key exists', () => {
      const params = new URLSearchParams('foo=bar');
      expect(Utils.getFromParamsOrDefault(params, 'foo', 'default')).toBe('bar');
    });
  });

  describe('calculateStartDateFromEndAndPeriod', () => {
    it('should return empty string if minDate missing', () => {
      expect(Utils.calculateStartDateFromEndAndPeriod('2024-01-01', 'P1D', null)).toBe('');
    });

    it('should calculate valid start date', () => {
      const end = '2024-01-10T00:00:00Z';
      const min = '2024-01-01T00:00:00Z';
      const result = Utils.calculateStartDateFromEndAndPeriod(end, 'P1D', min);
      const start = moment(result);
      expect(start.isSameOrAfter(moment(min))).toBeTrue();
      expect(start.isBefore(moment(end))).toBeTrue();
    });
  });

  describe('wait', () => {
    it('should resolve after given milliseconds', async () => {
      const start = Date.now();
      await Utils.wait(100);
      const diff = Date.now() - start;
      expect(diff).toBeGreaterThanOrEqual(100);
      expect(diff).toBeLessThan(200);
    });
  });

  describe('arraysEqualUnordered', () => {
    it('should return true for same arrays (unordered)', () => {
      expect(Utils.arraysEqualUnordered(['a', 'b'], ['b', 'a'])).toBeTrue();
    });

    it('should return false for different arrays', () => {
      expect(Utils.arraysEqualUnordered(['a', 'b'], ['a', 'c'])).toBeFalse();
    });

    it('should return false for different arrays length', () => {
      expect(Utils.arraysEqualUnordered(['a', 'b'], ['a', 'b', 'c'])).toBeFalse();
    });

    it('should ignore duplicates', () => {
      expect(Utils.arraysEqualUnordered(['a', 'a', 'b'], ['b', 'a'])).toBeTrue();
    });
  });
});
