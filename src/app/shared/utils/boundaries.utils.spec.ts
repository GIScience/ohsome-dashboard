import {describe, expect, it} from 'vitest';
import {Feature, FeatureCollection, GeoJsonProperties, Point, Polygon} from 'geojson';
import {getAvailablePropertyOrId, toPolygonFeatures, unionPolygonFeatures} from './boundaries.utils';

describe('bonudaries.utils', () => {

  it('unionPolygonFeatures(features) should return a unified polygon', () => {
    const geojson: FeatureCollection<Polygon> = {
      "type": "FeatureCollection", "features": [{
        "type": "Feature", "id": "one", "properties": {}, "geometry": {
          "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]], "type": "Polygon"
        }
      }, {
        "type": "Feature", "id": "two", "properties": {}, "geometry": {
          "coordinates": [[[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]]], "type": "Polygon"
        }
      }]
    };

    const expected: Feature<Polygon, GeoJsonProperties> = {
      "type": "Feature", "id": "one + two", "properties": {"id": "one + two"}, "geometry": {
        "coordinates": [[[0, 0], [2, 0], [2, 1], [0, 1], [0, 0]]], "type": "Polygon"
      }
    };

    const result = unionPolygonFeatures(geojson.features);

    expect(result).toEqual(expected);

  });

  function makeFeature(properties: Record<string, unknown> | null, id?: string | number): Feature<Point> {
    return {
      type: 'Feature',
      id,
      properties: properties as any,
      geometry: {type: 'Point', coordinates: [0, 0]},
    };
  }

  describe('getAvailablePropertyOrId()', () => {
    it('returns the value of the first matching property', () => {
      const feature = makeFeature({name: 'Berlin', display_name: 'Berlin, DE'});
      expect(getAvailablePropertyOrId(feature, ['name', 'display_name'], 'fallback')).toBe('Berlin');
    });

    it('skips properties that are undefined and returns the next available one', () => {
      const feature = makeFeature({display_name: 'Berlin, DE'});
      expect(getAvailablePropertyOrId(feature, ['name', 'display_name'], 'fallback')).toBe('Berlin, DE');
    });

    it('skips properties that are null', () => {
      const feature = makeFeature({name: null, display_name: 'Berlin, DE'});
      expect(getAvailablePropertyOrId(feature, ['name', 'display_name'], 'fallback')).toBe('Berlin, DE');
    });

    it('skips properties that are empty strings', () => {
      const feature = makeFeature({name: '', display_name: 'Berlin, DE'});
      expect(getAvailablePropertyOrId(feature, ['name', 'display_name'], 'fallback')).toBe('Berlin, DE');
    });

    it('respects the order of propertyNames, not the order of properties on the object', () => {
      const feature = makeFeature({display_name: 'Berlin, DE', name: 'Berlin'});
      expect(getAvailablePropertyOrId(feature, ['display_name', 'name'], 'fallback')).toBe('Berlin, DE');
    });

    it('coerces a non-string property value to a string', () => {
      const feature = makeFeature({count: 42});
      expect(getAvailablePropertyOrId(feature, ['count'], 'fallback')).toBe('42');
    });

    it('treats numeric 0 as a valid property value (not skipped)', () => {
      const feature = makeFeature({count: 0});
      expect(getAvailablePropertyOrId(feature, ['count'], 'fallback')).toBe('0');
    });

    it('treats boolean false as a valid property value (not skipped)', () => {
      const feature = makeFeature({active: false});
      expect(getAvailablePropertyOrId(feature, ['active'], 'fallback')).toBe('false');
    });

    it('falls back to feature.id when no property matches', () => {
      const feature = makeFeature({other: 'value'}, 'area-1');
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('area-1');
    });

    it('falls back to feature.id when properties is null', () => {
      const feature = makeFeature(null, 'area-1');
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('area-1');
    });

    it('falls back to feature.id when propertyNames is empty', () => {
      const feature = makeFeature({name: 'Berlin'}, 'area-1');
      expect(getAvailablePropertyOrId(feature, [], 'fallback')).toBe('area-1');
    });

    it('coerces a numeric feature.id to a string', () => {
      const feature = makeFeature({}, 42);
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('42');
    });

    it('treats id 0 as a valid id (not skipped)', () => {
      const feature = makeFeature({}, 0);
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('0');
    });

    it('falls back to defaultValue when no property matches and id is undefined', () => {
      const feature = makeFeature({other: 'value'});
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('fallback');
    });

    it('falls back to defaultValue when no property matches and id is null', () => {
      const feature = makeFeature({}, undefined);
      feature.id = null as unknown as string | number | undefined;
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('fallback');
    });

    it('falls back to defaultValue when properties is null and id is undefined', () => {
      const feature = makeFeature(null);
      expect(getAvailablePropertyOrId(feature, ['name'], 'fallback')).toBe('fallback');
    });
  });

  describe('toPolygonFeatures()', () => {

    function isFeature(feature: Feature) {
      return feature.type === 'Feature';
    }

    it('should create a feature from a bbox', () => {
      const formValuesMock = {
        bboxes: "8.6252588,49.3819766,8.7295724,49.4364995"
      }

      const result = toPolygonFeatures(formValuesMock);

      expect(isFeature(result[0])).toBe(true);
    });

    it('should create a feature from a bpoly string', () => {
      const formValuesMock = {
        bpolys: '8.33,49.30,8.33,49.28,8.35,49.28,8.36,49.29,8.35,49.30,8.33,49.30'
      }

      const result = toPolygonFeatures(formValuesMock);

      expect(isFeature(result[0])).toBe(true);
    });

    it('should create a feature from a bpoly geojson string', () => {
      const formValuesMock = {
        bpolys: `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "area 1",
      "properties": {
        "id": "area 1"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [ [ [ 8.33, 49.3 ], [ 8.33, 49.28 ], [ 8.35, 49.28 ], [ 8.36, 49.29 ], [ 8.35, 49.3 ], [ 8.33, 49.3 ] ] ]
      }
    }
  ]
}`
      }

      const result = toPolygonFeatures(formValuesMock);

      expect(isFeature(result[0])).toBe(true);
    });

  })
});
