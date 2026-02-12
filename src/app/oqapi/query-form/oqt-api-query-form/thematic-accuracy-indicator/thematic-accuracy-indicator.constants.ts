const corineLandCoverClassMapLevel2: Record<
  string,
  { name: string; class: number }
> = {
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

export const thematicAttributeMap: Record<
  string,
  { name: string}
> = {
  "surface": { name: $localize`Surface`},
  "oneway": { name: $localize`Oneway`},
  "lanes": { name: $localize`Lanes`},
  "name": { name: $localize`Name`},
  "width": { name: $localize`Width`},
};

export const categoryRegistry = {
  "land-cover-thematic-accuracy": corineLandCoverClassMapLevel2,
  "roads-thematic-accuracy" : thematicAttributeMap
} as const;

export const thematicCategoryType = {
  "land-cover-thematic-accuracy" : "corine_land_cover_class",
  "roads-thematic-accuracy" : "attribute"
}

export const thematicAccuracyCategoryNamesForBlank = {
  "land-cover-thematic-accuracy" : $localize`All Classes`,
  "roads-thematic-accuracy" : $localize`All Attributes`
}
