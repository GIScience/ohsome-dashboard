import {BBox, Feature, MultiPolygon, Polygon} from 'geojson';
import {featureCollection, polygon} from '@turf/helpers';
import {default as bbox2geojson} from '@turf/bbox-polygon';
import union from '@turf/union';
import {OhsomeApi} from '@giscience/ohsome-js-utils';

const Bpolys = OhsomeApi.v1.request.Bpolys;

/**
 * Builds the unified boundary feature from form values (bboxes / bpolys),
 */
export function toPolygonFeatures(formValues: Partial<{
  bpolys?: string;
  bboxes?: string;
}>): Feature<Polygon | MultiPolygon>[] {
  const {bpolys, bboxes} = formValues;

  if (bboxes) {
    const bboxesInstance = new OhsomeApi.v1.request.Bboxes().parse(bboxes);
    const features: Feature<Polygon, { id: string }>[] = bboxesInstance.boundaries.map(
      (bbox, index) => {
        const id = (bbox.id) ? String(bbox.id) : `box ${index + 1}`;
        const coords: BBox = bbox.geometry.split(',').map(Number) as BBox;
        return bbox2geojson(coords, {properties: {id}, id}) as unknown as Feature<Polygon, { id: string }>;
      }
    );

    return features;
  }

  if (bpolys) {
    // bpolys can be a geojson OR an ohsomeApi bpoly format
    if (Bpolys.isBPolysString(bpolys)) {
      const bpolysInstance = new Bpolys().parse(bpolys);
      const features: Feature<Polygon>[] = bpolysInstance.boundaries.map((bpoly, index) => {
          const id = (bpoly.id) ? String(bpoly.id) : `area ${index + 1}`;
        const coords1d: number[] = bpoly.geometry.split(',').map(Number);

        // transform array of numbers into array of pairs of numbers (coordinates)
        const coords2d: number[][] = [];
        while (coords1d.length) {
          coords2d.push(coords1d.splice(0, 2));
        }
        return polygon([coords2d], {id}, {id});
      });

      return features;
    } else {
      // geojson
      const features = JSON.parse(bpolys).features as Feature<MultiPolygon>[];
      return features;
    }
  }

 throw Error("Form Values do not contain boundaries (bpolys or bboxes)");
}


export function getAvailablePropertyOrId(
  feature: Feature,
  propertyNames: string[],
  defaultValue: string
): string {
  // return first available property
  for (const propertyName of propertyNames) {
    const value = feature.properties?.[propertyName];

    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }

  // 1st fallback return id
  if (feature.id !== undefined && feature.id !== null) {
    return String(feature.id);
  }

  // 2nd fallback return user-defined fallback
  return defaultValue;
}

export function unionPolygonFeatures(
  features: Feature<Polygon | MultiPolygon>[]
): Feature<Polygon | MultiPolygon> {

  const getLabel = (feature, currentIndex)=> {
    return getAvailablePropertyOrId(feature, ["display_name"], currentIndex)
  }

  return features.reduce(
    (previousValue: Feature<Polygon | MultiPolygon>, currentValue, currentIndex) => {
      if (currentIndex === 0) {
        return currentValue;
      }

      const merged = union(featureCollection([previousValue, currentValue]));
      if (merged) {

        const mergedLabel = [getLabel(previousValue,`area ${currentIndex}`), getLabel(currentValue, `area ${currentIndex + 1}`)].join(' + ');

        merged.id = mergedLabel;
        merged.properties = {};
        merged.properties['id'] = mergedLabel;

        return merged as Feature<Polygon | MultiPolygon>;
      } else {

        const label = getLabel(previousValue, `area ${currentIndex}`);

        previousValue.id = label;
        previousValue.properties = {};
        previousValue.properties['id'] = label;
        return previousValue;
      }
    },
    features[0]
  );
}
