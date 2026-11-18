// a function, not a module-level constant - see getMeasureOptions() in form.utils.ts
// for why: $localize inside a top-level const evaluates too early to pick up
// translations loaded at runtime, and being a const, never re-evaluates.
function corineLandCoverClassMapLevel2(): Record<
  string,
  { name: string; class: number }
> {
  return {
    "11": { name: $localize`Urban fabric`, class: 1 },
    "12": { name: $localize`Industrial, commercial and transport units`, class: 1 },
    "13": { name: $localize`Mine, dump and construction sites`, class: 1 },
    "14": { name: $localize`Artificial non-agricultural vegetated areas`, class: 1 },
    "21": { name: $localize`Arable land`, class: 2 },
    "22": { name: $localize`Permanent crops`, class: 2 },
    "23": { name: $localize`Pastures`, class: 2 },
    "24": { name: $localize`Heterogeneous agricultural areas`, class: 2 },
    "31": { name: $localize`Forest`, class: 3 },
    "32": { name: $localize`Shrubs and/or herbaceous vegetation associations`, class: 3 },
    "33": { name: $localize`Open spaces with little or no vegetation`, class: 3 },
    "41": { name: $localize`Inland wetlands`, class: 4 },
    "42": { name: $localize`Coastal wetlands`, class: 4 },
    "51": { name: $localize`Inland waters`, class: 5 },
    "52": { name: $localize`Marine waters`, class: 5 },
  };
}

function thematicAttributeMap(): Record<
  string,
  { name: string}
> {
  return {
    "surface": { name: $localize`Surface`},
    "oneway": { name: $localize`Oneway`},
    "lanes": { name: $localize`Lanes`},
    "name": { name: $localize`Name`},
    "width": { name: $localize`Width`},
  };
}

// the attributes of a bridge differ from those of a road, so they get their own map.
// `Width`/`Height` carry an i18n meaning to keep them translatable independently of
// the road attributes (de: "Fahrbahnbreite" vs. "Breite").
function bridgeThematicAttributeMap(): Record<
  string,
  { name: string}
> {
  return {
    "name": { name: $localize`Name`},
    "width": { name: $localize`:bridge attribute|Width of a bridge:Width`},
    "height": { name: $localize`:bridge attribute|Height of a bridge:Height`},
  };
}

export function categoryRegistry() {
  return {
    "land-cover-thematic-accuracy": corineLandCoverClassMapLevel2(),
    "roads-thematic-accuracy" : thematicAttributeMap(),
    "bridges-thematic-accuracy" : bridgeThematicAttributeMap()
  };
}

export const thematicCategoryType = {
  "land-cover-thematic-accuracy" : "corine_land_cover_class",
  "roads-thematic-accuracy" : "attribute",
  "bridges-thematic-accuracy" : "attribute"
}

export function thematicAccuracyCategoryNamesForBlank(): Record<string, string> {
  return {
    "land-cover-thematic-accuracy" : $localize`All Classes`,
    "roads-thematic-accuracy" : $localize`All Attributes`,
    "bridges-thematic-accuracy" : $localize`All Attributes`
  };
}
