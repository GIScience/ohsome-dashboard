export const oqtMetadataTopicsResponseMock = {
  "api-version": "0.14.1",
  "attribution": {
  "url": "https://github.com/GIScience/ohsome-quality-analyst/blob/main/data/COPYRIGHTS.md"
},
  "result": [
  {
    "key": "building_count",
    "name": "Building Count",
    "description": "All buildings as defined by all objects tagged with 'building=*'.",
    "endpoint": "elements/count",
    "filter": "building=* and building!=no and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness",
      "attribute-completeness"
    ],
    "project": "core",
    "source": null,
    "ratio_filter": "building=* and building!=no and geometry:polygon and height=* or building:levels=*"
  },
  {
    "key": "building_area",
    "name": "Building Area",
    "description": "All buildings as defined by all objects tagged with 'building=*'.",
    "endpoint": "elements/area",
    "filter": "building=* and building!=no and geometry:polygon",
    "indicators": [
      "building-completeness"
    ],
    "project": "core",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "major_roads_count",
    "name": "Major Roads Count",
    "description": "The road network defined by all objects which hold the principal tags for the road network as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway",
    "endpoint": "elements/count",
    "filter": "highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way",
    "indicators": [
      "currentness"
    ],
    "project": "core",
    "source": null,
    "ratio_filter": "highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way and name=*"
  },
  {
    "key": "major_roads_length",
    "name": "Major Roads Length",
    "description": "The road network defined by all objects which hold the principal tags for the road network and their link roads as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway",
    "endpoint": "elements/length",
    "filter": "highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way",
    "indicators": [
      "mapping-saturation",
      "attribute-completeness"
    ],
    "project": "core",
    "source": null,
    "ratio_filter": "highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way and name=*"
  },
  {
    "key": "railway_length",
    "name": "Railways",
    "description": "Railway networks.",
    "endpoint": "elements/length",
    "filter": "railway in (rail, subway, tram, light_rail, monorail, funicular, narrow_gauge) and type:way",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "poi",
    "name": "POI",
    "description": "Points of interest",
    "endpoint": "elements/count",
    "filter": "(aeroway in (aerodrome, helipad, heliport)) or (amenity in (animal_boarding, animal_shelter, arts_centre, atm, baby_hatch, bank, bar, bbq, bench, bicycle_parking, bicycle_rental, bicycle_repair_station, biergarten, boat_sharing, brothel, bureau_de_change, bus_station, bus_stop, cafe, car_sharing, car_wash, casino, charging_station, cinema, clinic, clock, college, community_centre, compressed_air, courthouse, coworking_space, crematorium, crypt, dentist, doctors, dive_centre, dojo, drinking_water, driving_school, embassy, emergency_phone, ev_charging, fast_food, ferry_terminal, fire_station, food_court, fountain, fuel, gambling, grave_yard, hospital, hunting_stand, ice_cream, internet_cafe, kindergarten, language_school, library, kneipp_water_cure, marketplace, motorcycle_parking, music_school, nightclub, nursing_home, parking, parking_entrance, parking_space, pharmacy, photo_booth, planetarium, place_of_worship, police, post_box, post_office, pub, public_bath, prison, ranger_station, recycling, rescue_station, restaurant, retirement_home, sanitary_dump_station, school, shelter, shower, social_centre, social_facility, spa, stripclub, studio, table, taxi, telephone, toilets, townhall, university, vending_machine, veterinary, waste_basket, waste_disposal, water_point)) or (emergency in (access_point, defibrillator, fire_hydrant)) or (healthcare = blood_donation) or (healthcare:speciality = vacciniation) or (highway = raceway) or (historic in (aircraft, aqueduct, archaeological_site, battlefield, boundary_stone, building, castle, cannon, city_gate, citywalls, farm, fort, gallows, highwater_mark, locomotive, manor, memorial, milestone, monastery, monument, optical_telegraph, pillory, ruins, rune_stone, ship, tomb, wayside_cross, wayside_shrine, wreck)) or (leisure in (adult_gaming_centre, amusement_arcade, beach_resort, bandstand, bird_hide, common, dance, dog_park, firepit, fishing, fitness_centre, garden, golf_course, hackerspace, horse_riding, ice_rink, marina, miniature_golf, nature_reserve, park, picnic_table, pitch, playground, sauna, slipway, sports_centre, stadium, summer_camp, swimming_area, swimming_pool, track, turkish_bad, water_park, wildlife_hide)) or (natural in (beach, cave_entrance, geyser, peak, rock, saddle, spring, volcano, water)) or (public_transport in (platform, stop_position, station, stop_area)) or (railway in (halt, station, tram_station)) or (shop in (agrarian, alcohol, antiques, art, bag, bakery, beauty, bed, beverages, bicycle, books, boutique, brewing_supplies, business_machines, butcher, cafe,camera, candles, car, car_parts, carpet, curtain, cheese, chemist, chocolate, clothes, coffee, computer, confectionery, convenience, copyshop, cosmetics, dairy, deli, department_store, doityourself, dry_cleaning, electrical, electronics, erotic, estate_agent, e-cigarette, farm, fashion, fishing, florist, funeral_directors, furniture, games, garden_centre, garden_furniture, gas, general, gift, glaziery, greengrocer, grocery, hairdresser, hairdresser_supply, hardware, hearing_aids, herbalist, hifi, houseware, hunting, insurance, interior_decoration, jewelry, laundry, leather, locksmith, kiosk, kitchen, lamps, lottery, mall, massage, medical_supply, mobile_phone, model, motorcycle, music, musical_instrument, nutrition_supplements, newsagent, optician, organic, outdoor, paint, pastry, perfumery, photo, pyrotechnics, rediotechnics, seafood, second_hand,secruity, shoes, spices, sports, stationery, supermarket, swimming_pool, tailor, tattoo, tea, ticket, tiles, tobacco, toys, travel_agency, trophy, tyres, variety_store, video, video_games, watches, weapons, wine, pet)) or (tourism in (alpine_hut, apartment, aquarium, artwork, attraction, camp_site, caravan_site, chalet, gallery, museum, guest_house, hostel, hotel, motel, picnic_site, theme_park, viewpoint, wilderness_hut, zoo)) or (vaccination = covid19)",
    "indicators": [
      "mapping-saturation",
      "currentness",
      "poi-density"
    ],
    "project": "core",
    "source": "https://github.com/GIScience/openpoiservice/blob/master/openpoiservice/server/categories/categories.yml",
    "ratio_filter": null
  },
  {
    "key": "schools",
    "name": "Schools",
    "description": "Count of schools.",
    "endpoint": "elements/count",
    "filter": "amenity=school",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool",
    "ratio_filter": null
  },
  {
    "key": "kindergarten",
    "name": "Kindergarten",
    "description": "Count of kindergarten.",
    "endpoint": "elements/count",
    "filter": "amenity=kindergarten",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dkindergarten",
    "ratio_filter": null
  },
  {
    "key": "clinics",
    "name": "Clinics",
    "description": "Count of clinics.",
    "endpoint": "elements/count",
    "filter": "amenity=clinic or healthcare=clinic",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project",
    "ratio_filter": null
  },
  {
    "key": "doctors",
    "name": "Doctors",
    "description": "Count of doctors.",
    "endpoint": "elements/count",
    "filter": "amenity=doctors or healthcare=doctors",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project",
    "ratio_filter": null
  },
  {
    "key": "bus_stops",
    "name": "Bus Stops",
    "description": "Count of bus stops.",
    "endpoint": "elements/count",
    "filter": "highway=bus_stop",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop",
    "ratio_filter": null
  },
  {
    "key": "tram_stops",
    "name": "Tram Stops",
    "description": "Count of schools.",
    "endpoint": "elements/count",
    "filter": "railway=tram_stop",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:railway%3Dtram_stop",
    "ratio_filter": null
  },
  {
    "key": "subway_stations",
    "name": "Subway Stations",
    "description": "Count of subway stops.",
    "endpoint": "elements/count",
    "filter": "station=subway",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:station%3Dsubway",
    "ratio_filter": null
  },
  {
    "key": "supermarkets",
    "name": "Supermarkets",
    "description": "Count of supermarkets.",
    "endpoint": "elements/count",
    "filter": "shop=supermarket",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket",
    "ratio_filter": null
  },
  {
    "key": "marketplaces",
    "name": "Marketplaces",
    "description": "Count of marketplaces.",
    "endpoint": "elements/count",
    "filter": "amenity=marketplace",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dmarketplace",
    "ratio_filter": null
  },
  {
    "key": "parks",
    "name": "Parks",
    "description": "Count of parks.",
    "endpoint": "elements/count",
    "filter": "leisure=park",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpark",
    "ratio_filter": null
  },
  {
    "key": "forests",
    "name": "Forests",
    "description": "Count of forests.",
    "endpoint": "elements/count",
    "filter": "landuse=forest",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Forest",
    "ratio_filter": null
  },
  {
    "key": "fitness_centres",
    "name": "Fitness Centres",
    "description": "Count of fitness centres.",
    "endpoint": "elements/count",
    "filter": "leisure in (fitness_centre, sports_centre)",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Gym_/_Fitness_centre",
    "ratio_filter": null
  },
  {
    "key": "fire_stations",
    "name": "Fire Stations",
    "description": "Count of firestations.",
    "endpoint": "elements/count",
    "filter": "amenity=fire_station",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfire_station",
    "ratio_filter": null
  },
  {
    "key": "hospitals",
    "name": "Hospitals",
    "description": "Count of hospitals.",
    "endpoint": "elements/count",
    "filter": "amenity=hospital or healthcare=hospital",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "core",
    "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dhospital",
    "ratio_filter": null
  },
  {
    "key": "amenities",
    "name": "Amenities",
    "description": "All features with the amenities key.",
    "endpoint": "elements/count",
    "filter": "amenity=*",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "sketchmap",
    "source": "https://wiki.openstreetmap.org/wiki/Key:amenity",
    "ratio_filter": null
  },
  {
    "key": "landmarks",
    "name": "Landmarks for Orientation",
    "description": "Landmarks for orientation in a city such as natural features, public transport stations and amenities.",
    "endpoint": "elements/count",
    "filter": "natural=peak or leisure=park or boundary=national_park or natural=water or waterway=* or highway=bus_stop or railway=station or shop=* or tourism in (hotel, attraction) or amenity in (fuel, pharmacy, hospital, school, college, university, police, fire_station, restaurant, townhall)",
    "indicators": [],
    "project": "sketchmap",
    "source": "https://www.geog.uni-heidelberg.de/gis/sketchmaptool.html",
    "ratio_filter": null
  },
  {
    "key": "mapaction_settlements_count",
    "name": "MapAction Settlements Count",
    "description": "Number of settlements (cities)",
    "endpoint": "elements/count",
    "filter": "place=city and type:node",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_capital_city_count",
    "name": "MapAction Capital City Count",
    "description": "Number of capital cities",
    "endpoint": "elements/count",
    "filter": "place=city and (is_capital=country or admin_level=2 or capital=yes) and type:node",
    "indicators": [],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_rail_length",
    "name": "MapAction Rail Length",
    "description": "Length of objects identified as rails (large railways)",
    "endpoint": "elements/length",
    "filter": "railway=rail and type:way",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_major_roads_length",
    "name": "MapAction Major Roads length",
    "description": "Length of objects identified as major roads (primary, motorway and trunk)",
    "endpoint": "elements/length",
    "filter": "highway in (motorway, trunk, primary) and type:way",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_lakes_count",
    "name": "MapAction Lakes Count",
    "description": "Number of objects identified as lakes, lagoons and reservoirs",
    "endpoint": "elements/count",
    "filter": "(water in (lagoon,lake,reservoir) or landuse=reservoir) and type:way",
    "indicators": [
      "currentness"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_lakes_area",
    "name": "MapAction Lakes Area",
    "description": "Area of objects identified as lakes, lagoons and reservoirs",
    "endpoint": "elements/area",
    "filter": "(water in (lagoon,lake,reservoir) or landuse=reservoir) and type:way",
    "indicators": [
      "mapping-saturation"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "mapaction_rivers_length",
    "name": "MapAction Rivers Length",
    "description": "Length of objects identified as rivers (or riverbanks)",
    "endpoint": "elements/length",
    "filter": "waterway in (riverbank,river) and type:way",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "mapaction",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "lulc",
    "name": "Land Use and Land Cover",
    "description": "Features related to land use and land cover. This definition includes well established tags for coherent areas at the most atomic level available. This definition therefore excludes areas with the keys aeroway, highway, leisure and tourism which can be found in other sources. For further details please contact us.",
    "endpoint": "elements/area",
    "filter": "(landuse=allotments or landuse=animal_keeping or landuse=basin or landuse=brownfield or landuse=cemetery or landuse=churchyard or landuse=civic_admin or landuse=commercial or landuse=construction or landuse=depot or landuse=education or landuse=farmland or landuse=farmyard or landuse=forest or landuse=garages or landuse=grass or landuse=greenfield or landuse=greenhouse_horticulture or landuse=harbour or landuse=industrial or landuse=landfill or landuse=logging or landuse=meadow or landuse=military or landuse=orchard or landuse=plant_nursery or landuse=port or landuse=quarry or landuse=railway or landuse=recreation_ground or landuse=religious or landuse=reservoir or landuse=residential or landuse=retail or landuse=salt_pond or landuse=village_green or landuse=vineyard or natural=bare_rock or natural=beach or natural=dune or natural=fell or natural=glacier or natural=grassland or natural=heath or natural=landslide or natural=mud or natural=rock or natural=sand or natural=scree or natural=scrub or natural=shingle or natural=water or natural=wetland or natural=wood or waterway=boatyard or waterway=dam or waterway=dock or waterway=riverbank) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "idealvgi",
    "source": "https://osmlanduse.org; Fonte et al 2016 https://cartography-gis.com/docsbca/iccgis2016/ICCGIS2016-47.pdf; https://github.com/jasp382/glass/tree/master/core/glass/ete/osm2lulc; Schultz et al 2017 https://doi.org/10.1016/j.jag.2017.07.014; https://www.geog.uni-heidelberg.de/gis/ideal_en.html",
    "ratio_filter": null
  },
  {
    "key": "local_food_shops",
    "name": "Local food shops",
    "description": "Count of local food shops",
    "endpoint": "elements/count",
    "filter": "shop=bakery or shop=butcher or shop=greengrocer or shop=seafood or shop=cheese or shop=dairy",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "fast_food_restaurants",
    "name": "Fast food restaurants",
    "description": "Count of fast food restaurants",
    "endpoint": "elements/count",
    "filter": "amenity=fast_food",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "restaurants",
    "name": "Restaurants",
    "description": "Count of restaurants",
    "endpoint": "elements/count",
    "filter": "amenity=restaurant or amenity=cafe",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "convenience_stores",
    "name": "Convenience stores",
    "description": "Count of convenience stores",
    "endpoint": "elements/count",
    "filter": "shop=convenience",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "pubs_and_biergartens",
    "name": "Pubs and biergartens",
    "description": "Count of pubs and biergartens",
    "endpoint": "elements/count",
    "filter": "amenity=pub or amenity=biergarten or amenity=bar",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "alcohol_and_beverages",
    "name": "Alcohol and beverages",
    "description": "Count of shops selling alcohol",
    "endpoint": "elements/count",
    "filter": "shop=alcohol or shop=beverages",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "sweets_and_pasteries",
    "name": "Sweets and pasteries",
    "description": "Count of shops selling sweets and pasteries",
    "endpoint": "elements/count",
    "filter": "shop=pastry or amenity=ice_cream or shop=confectionery",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "expanse",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_arable_land_area",
    "name": "Arable Land CLC",
    "description": "Selected features for Corine Land Cover Category \"Arable Land\" (level 2) in Agriculture.",
    "endpoint": "elements/area",
    "filter": "(landuse=farmland or crop=*) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_permanent_crops_area",
    "name": "Permanent Crops CLC",
    "description": "Selected features for Corine Land Cover Category \"Permanent Crops\" (level 2) in Agriculture.",
    "endpoint": "elements/area",
    "filter": "landuse in (vineyard, orchard, farmland) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_pastures_area",
    "name": "Pastures CLC",
    "description": "Selected features for Corine Land Cover Category \"Pastures\" (level 2) in Agriculture.",
    "endpoint": "elements/area",
    "filter": "(landuse=grass or natural=grassland or landcover=grass or natural=fell) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_forest_area",
    "name": "Forests CLC",
    "description": "Selected features for Corine Land Cover Category \"Forests\" (level 2) in Seminatural Land.",
    "endpoint": "elements/area",
    "filter": "(natural=wood or landuse=forest) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_leaf_type",
    "name": "Leaf Types of Forests CLC",
    "description": "frequency of forests according to Corine Land Cover Category \"Forests\" (level 2) tagged with Leaf Type.",
    "endpoint": "elements/area",
    "filter": "(natural=wood or landuse=forest) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness",
      "attribute-completeness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": "(natural=wood or landuse=forest) and leaf_type in (broadleaved, needleleaved, mixed) and geometry:polygon"
  },
  {
    "key": "clc_shrub_area",
    "name": "Shrubs CLC",
    "description": "Selected features for Corine Land Cover Category \"Shrubs\" (level 2) in Seminatural Land.",
    "endpoint": "elements/area",
    "filter": "(natural in (scrub, fell, tundra, shrubbery) or landuse=meadow) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_open_spaces_area",
    "name": "Open Spaces CLC",
    "description": "Selected features for Corine Land Cover Category \"Open Spaces\" (level 2) in Seminatural Land.",
    "endpoint": "elements/area",
    "filter": "natural in (beach, bare_rock, rock, stone, glacier, ridge, peak, earth_bank, cliff, arete, shingle, crevasse) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_wetland_area",
    "name": "Wetlands CLC",
    "description": "Selected features for Corine Land Cover Category \"Wetlands\" (level 1).",
    "endpoint": "elements/area",
    "filter": "(natural in (wetland, mud) or landuse=salt_pond) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_water_area",
    "name": "Water CLC",
    "description": "Selected features for Corine Land Cover Category \"Water\" (level 1), excluding waterways.",
    "endpoint": "elements/area",
    "filter": "(natural in (water, spring, hot_spring) or water in (lake, reservoir, pond, oxbow, basin)) and geometry:polygon",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "clc_waterway_len",
    "name": "Waterways CLC",
    "description": "Selected features for Corine Land Cover Category \"Waterways\" (level 2) in Water.",
    "endpoint": "elements/length",
    "filter": "waterway in (river, canal, stream, drain, ditch) and geometry:line",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "corine-land-cover",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "minimal",
    "name": "Minimal",
    "description": "A minimal topic definition for testing purposes",
    "endpoint": "elements/count",
    "filter": "building=* and building!=no and geometry:polygon",
    "indicators": [
      "minimal"
    ],
    "project": "misc",
    "source": null,
    "ratio_filter": null
  },
  {
    "key": "infrastructure_lines",
    "name": "Infrastructure Lines",
    "description": "Line objects related to infrastructure",
    "endpoint": "elements/length",
    "filter": "(aerialway=* or aeroway=* or highway=* or power=* or railway=* or telecom=*) and geometry:line",
    "indicators": [
      "mapping-saturation",
      "currentness"
    ],
    "project": "experimental",
    "source": null,
    "ratio_filter": null
  }
]
}
