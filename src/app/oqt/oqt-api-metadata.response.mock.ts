import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {AttributeResponseJSON} from "./types/types";
export const oqtAttributesResponseMock: AttributeResponseJSON = {
  "apiVersion": "1.4.0",
  "attribution": {
    "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
  },
  "result": {
    "building-count": {
      "height": {"filter": "height=* or building:levels=*", "name": "Height of Buildings", "description": "TODO"},
      "house_number": {"filter": "addr:housenumber=*", "name": "House Number", "description": "TODO"},
    }
  }
};

export const oqtApiMetadataResponseMock: MetadataResponseJSON = {
  "apiVersion": "1.4.0",
  "attribution": {"url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"},
  "result": {
    "indicators": {
      "building-comparison": {
        "name": "Building Comparison",
        "description": "Comparison of OSM buildings with the buildings of reference datasets.",
        "projects": ["bkg", "core"],
        "qualityDimension": "completeness"
      },
      "mapping-saturation": {
        "name": "Mapping Saturation",
        "description": "Calculate if mapping has saturated. High saturation has been reached if the growth of the fitted curve is minimal.",
        "projects": ["core", "corine-land-cover", "expanse", "experimental", "idealvgi", "mapaction", "sketchmap", "bkg"],
        "qualityDimension": "completeness"
      },
      "currentness": {
        "name": "Currentness",
        "description": "Estimate currentness of features by classifying contributions based on topic specific temporal thresholds into three groups: up-to-date, in-between and out-of-date.",
        "projects": ["core", "bkg"],
        "qualityDimension": "currentness"
      },
      "density": {
        "name": "Density",
        "description": "The density of features. It is calculated by the number of features  divided by the area in square-kilometers.",
        "projects": ["experimental"],
        "qualityDimension": "none"
      },
      "attribute-completeness": {
        "name": "Attribute Completeness",
        "description": "Derive the ratio of OSM features compared to features which match additional expected tags (e.g. amenity=hospital vs amenity=hospital and wheelchair=yes).",
        "projects": ["bkg"],
        "qualityDimension": "completeness"
      },
      "minimal": {
        "name": "Minimal",
        "description": "An minimal Indicator for testing purposes.",
        "projects": ["misc"],
        "qualityDimension": "minimal"
      },
      "road-comparison": {
        "name": "Road Comparison",
        "description": "Compare the road length of OSM roads with the road length of reference data.",
        "projects": ["bkg", "core"],
        "qualityDimension": "completeness"
      }
    },
    "topics": {
      "building-count": {
        "name": "Building Count",
        "description": "All buildings as defined by all objects tagged with 'building=*'.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "building=* and building!=no and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness", "attribute-completeness"],
        "projects": ["core", "bkg"],
        "source": null
      },
      "building-area": {
        "name": "Building Area",
        "description": "All buildings as defined by all objects tagged with 'building=*'.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "building=* and building!=no and geometry:polygon",
        "indicators": ["mapping-saturation", "building-comparison"],
        "projects": ["core", "bkg"],
        "source": null
      },
      "roads": {
        "name": "Roads",
        "description": "The road network defined by all objects which hold the principal tags for the road network and their link roads as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "highway=* and type:way",
        "indicators": ["mapping-saturation", "road-comparison", "attribute-completeness", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Key:highway"
      },
      "railway-length": {
        "name": "Railways",
        "description": "Railway networks.",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "railway in (rail, subway, tram, light_rail, monorail, funicular, narrow_gauge) and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": null
      },
      "poi": {
        "name": "POI",
        "description": "Points of interest",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "(aeroway in (aerodrome, helipad, heliport)) or (amenity in (animal_boarding, animal_shelter, arts_centre, atm, baby_hatch, bank, bar, bbq, bench, bicycle_parking, bicycle_rental, bicycle_repair_station, biergarten, boat_sharing, brothel, bureau_de_change, bus_station, bus_stop, cafe, car_sharing, car_wash, casino, charging_station, cinema, clinic, clock, college, community_centre, compressed_air, courthouse, coworking_space, crematorium, crypt, dentist, doctors, dive_centre, dojo, drinking_water, driving_school, embassy, emergency_phone, ev_charging, fast_food, ferry_terminal, fire_station, food_court, fountain, fuel, gambling, grave_yard, hospital, hunting_stand, ice_cream, internet_cafe, kindergarten, language_school, library, kneipp_water_cure, marketplace, motorcycle_parking, music_school, nightclub, nursing_home, parking, parking_entrance, parking_space, pharmacy, photo_booth, planetarium, place_of_worship, police, post_box, post_office, pub, public_bath, prison, ranger_station, recycling, rescue_station, restaurant, retirement_home, sanitary_dump_station, school, shelter, shower, social_centre, social_facility, spa, stripclub, studio, table, taxi, telephone, toilets, townhall, university, vending_machine, veterinary, waste_basket, waste_disposal, water_point)) or (emergency in (access_point, defibrillator, fire_hydrant)) or (healthcare = blood_donation) or (healthcare:speciality = vacciniation) or (highway = raceway) or (historic in (aircraft, aqueduct, archaeological_site, battlefield, boundary_stone, building, castle, cannon, city_gate, citywalls, farm, fort, gallows, highwater_mark, locomotive, manor, memorial, milestone, monastery, monument, optical_telegraph, pillory, ruins, rune_stone, ship, tomb, wayside_cross, wayside_shrine, wreck)) or (leisure in (adult_gaming_centre, amusement_arcade, beach_resort, bandstand, bird_hide, common, dance, dog_park, firepit, fishing, fitness_centre, garden, golf_course, hackerspace, horse_riding, ice_rink, marina, miniature_golf, nature_reserve, park, picnic_table, pitch, playground, sauna, slipway, sports_centre, stadium, summer_camp, swimming_area, swimming_pool, track, turkish_bad, water_park, wildlife_hide)) or (natural in (beach, cave_entrance, geyser, peak, rock, saddle, spring, volcano, water)) or (public_transport in (platform, stop_position, station, stop_area)) or (railway in (halt, station, tram_station)) or (shop in (agrarian, alcohol, antiques, art, bag, bakery, beauty, bed, beverages, bicycle, books, boutique, brewing_supplies, business_machines, butcher, cafe,camera, candles, car, car_parts, carpet, curtain, cheese, chemist, chocolate, clothes, coffee, computer, confectionery, convenience, copyshop, cosmetics, dairy, deli, department_store, doityourself, dry_cleaning, electrical, electronics, erotic, estate_agent, e-cigarette, farm, fashion, fishing, florist, funeral_directors, furniture, games, garden_centre, garden_furniture, gas, general, gift, glaziery, greengrocer, grocery, hairdresser, hairdresser_supply, hardware, hearing_aids, herbalist, hifi, houseware, hunting, insurance, interior_decoration, jewelry, laundry, leather, locksmith, kiosk, kitchen, lamps, lottery, mall, massage, medical_supply, mobile_phone, model, motorcycle, music, musical_instrument, nutrition_supplements, newsagent, optician, organic, outdoor, paint, pastry, perfumery, photo, pyrotechnics, rediotechnics, seafood, second_hand,secruity, shoes, spices, sports, stationery, supermarket, swimming_pool, tailor, tattoo, tea, ticket, tiles, tobacco, toys, travel_agency, trophy, tyres, variety_store, video, video_games, watches, weapons, wine, pet)) or (tourism in (alpine_hut, apartment, aquarium, artwork, attraction, camp_site, caravan_site, chalet, gallery, museum, guest_house, hostel, hotel, motel, picnic_site, theme_park, viewpoint, wilderness_hut, zoo)) or (vaccination = covid19)",
        "indicators": ["mapping-saturation", "currentness", "density"],
        "projects": ["core", "bkg"],
        "source": "https://github.com/GIScience/openpoiservice/blob/master/openpoiservice/server/categories/categories.yml"
      },
      "schools": {
        "name": "Schools",
        "description": "Count of schools.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=school",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool"
      },
      "kindergarten": {
        "name": "Kindergarten",
        "description": "Count of kindergarten.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=kindergarten",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dkindergarten"
      },
      "clinics": {
        "name": "Clinics",
        "description": "Count of clinics.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=clinic or healthcare=clinic",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
      },
      "doctors": {
        "name": "Doctors",
        "description": "Count of doctors.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=doctors or healthcare=doctor",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
      },
      "bus-stops": {
        "name": "Bus Stops",
        "description": "Count of bus stops.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "highway=bus_stop",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop"
      },
      "tram-stops": {
        "name": "Tram Stops",
        "description": "Count of schools.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "railway=tram_stop",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:railway%3Dtram_stop"
      },
      "subway-stations": {
        "name": "Subway Stations",
        "description": "Count of subway stops.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "station=subway",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:station%3Dsubway"
      },
      "supermarkets": {
        "name": "Supermarkets",
        "description": "Count of supermarkets.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=supermarket",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket"
      },
      "marketplaces": {
        "name": "Marketplaces",
        "description": "Count of marketplaces.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=marketplace",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dmarketplace"
      },
      "parks": {
        "name": "Parks",
        "description": "Count of parks.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "leisure=park",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpark"
      },
      "forests": {
        "name": "Forests",
        "description": "Count of forests.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "landuse=forest",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Forest"
      },
      "industrial-landuse-count": {
        "name": "Industrial Landuse (count)",
        "description": "Industrial landsites",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "landuse=industrial and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["experimental"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:landuse%3Dindustrial"
      },
      "industrial-landuse-area": {
        "name": "Industrial Landuse (area)",
        "description": "Industrial areas",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "landuse=industrial and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["experimental"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:landuse%3Dindustrial"
      },
      "fitness-centres": {
        "name": "Fitness Centres",
        "description": "Count of fitness centres.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "leisure in (fitness_centre, sports_centre)",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Gym_/_Fitness_centre"
      },
      "fire-stations": {
        "name": "Fire Stations",
        "description": "Count of firestations.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=fire_station",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfire_station"
      },
      "hospitals": {
        "name": "Hospitals",
        "description": "Count of hospitals.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=hospital or healthcare=hospital",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["core", "bkg"],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dhospital"
      },
      "amenities": {
        "name": "Amenities",
        "description": "All features with the amenities key.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=*",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["sketchmap"],
        "source": "https://wiki.openstreetmap.org/wiki/Key:amenity"
      },
      "landmarks": {
        "name": "Landmarks for Orientation",
        "description": "Landmarks for orientation in a city such as natural features, public transport stations and amenities.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "natural=peak or leisure=park or boundary=national_park or natural=water or waterway=* or highway=bus_stop or railway=station or shop=* or tourism in (hotel, attraction) or amenity in (fuel, pharmacy, hospital, school, college, university, police, fire_station, restaurant, townhall)",
        "indicators": ["density"],
        "projects": ["sketchmap"],
        "source": "https://www.geog.uni-heidelberg.de/gis/sketchmaptool.html"
      },
      "mapaction-settlements-count": {
        "name": "MapAction Settlements Count",
        "description": "Number of settlements (cities)",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "place=city and type:node",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-capital-city-count": {
        "name": "MapAction Capital City Count",
        "description": "Number of capital cities",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "place=city and (is_capital=country or admin_level=2 or capital=yes) and type:node",
        "indicators": [],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-rail-length": {
        "name": "MapAction Rail Length",
        "description": "Length of objects identified as rails (large railways)",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "railway=rail and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-major-roads-length": {
        "name": "MapAction Major Roads length",
        "description": "Length of objects identified as major roads (primary, motorway and trunk)",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "highway in (motorway, trunk, primary) and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-lakes-count": {
        "name": "MapAction Lakes Count",
        "description": "Number of objects identified as lakes, lagoons and reservoirs",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "(water in (lagoon,lake,reservoir) or landuse=reservoir) and type:way",
        "indicators": ["currentness"],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-lakes-area": {
        "name": "MapAction Lakes Area",
        "description": "Area of objects identified as lakes, lagoons and reservoirs",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(water in (lagoon,lake,reservoir) or landuse=reservoir) and type:way",
        "indicators": ["mapping-saturation"],
        "projects": ["mapaction"],
        "source": null
      },
      "mapaction-rivers-length": {
        "name": "MapAction Rivers Length",
        "description": "Length of objects identified as rivers (or riverbanks)",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "waterway in (riverbank,river) and type:way",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["mapaction"],
        "source": null
      },
      "lulc": {
        "name": "Land Use and Land Cover",
        "description": "Features related to land use and land cover. This definition includes well established tags for coherent areas at the most atomic level available. This definition therefore excludes areas with the keys aeroway, highway, leisure and tourism which can be found in other sources. For further details please contact us.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(landuse=allotments or landuse=animal_keeping or landuse=basin or landuse=brownfield or landuse=cemetery or landuse=churchyard or landuse=civic_admin or landuse=commercial or landuse=construction or landuse=depot or landuse=education or landuse=farmland or landuse=farmyard or landuse=forest or landuse=garages or landuse=grass or landuse=greenfield or landuse=greenhouse_horticulture or landuse=harbour or landuse=industrial or landuse=landfill or landuse=logging or landuse=meadow or landuse=military or landuse=orchard or landuse=plant_nursery or landuse=port or landuse=quarry or landuse=railway or landuse=recreation_ground or landuse=religious or landuse=reservoir or landuse=residential or landuse=retail or landuse=salt_pond or landuse=village_green or landuse=vineyard or natural=bare_rock or natural=beach or natural=dune or natural=fell or natural=glacier or natural=grassland or natural=heath or natural=landslide or natural=mud or natural=rock or natural=sand or natural=scree or natural=scrub or natural=shingle or natural=water or natural=wetland or natural=wood or waterway=boatyard or waterway=dam or waterway=dock or waterway=riverbank) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["idealvgi"],
        "source": "https://osmlanduse.org; Fonte et al 2016 https://cartography-gis.com/docsbca/iccgis2016/ICCGIS2016-47.pdf; https://github.com/jasp382/glass/tree/master/core/glass/ete/osm2lulc; Schultz et al 2017 https://doi.org/10.1016/j.jag.2017.07.014; https://www.geog.uni-heidelberg.de/gis/ideal_en.html"
      },
      "local-food-shops": {
        "name": "Local food shops",
        "description": "Count of local food shops",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=bakery or shop=butcher or shop=greengrocer or shop=seafood or shop=cheese or shop=dairy",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "fast-food-restaurants": {
        "name": "Fast food restaurants",
        "description": "Count of fast food restaurants",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=fast_food",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "restaurants": {
        "name": "Restaurants",
        "description": "Count of restaurants",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=restaurant or amenity=cafe",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "convenience-stores": {
        "name": "Convenience stores",
        "description": "Count of convenience stores",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=convenience",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "pubs-and-biergartens": {
        "name": "Pubs and biergartens",
        "description": "Count of pubs and biergartens",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=pub or amenity=biergarten or amenity=bar",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "alcohol-and-beverages": {
        "name": "Alcohol and beverages",
        "description": "Count of shops selling alcohol",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=alcohol or shop=beverages",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "sweets-and-pasteries": {
        "name": "Sweets and pasteries",
        "description": "Count of shops selling sweets and pasteries",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=pastry or amenity=ice_cream or shop=confectionery",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["expanse"],
        "source": null
      },
      "clc-arable-land-area": {
        "name": "Arable Land CLC",
        "description": "Selected features for Corine Land Cover Category \"Arable Land\" (level 2) in Agriculture.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(landuse=farmland or crop=*) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-permanent-crops-area": {
        "name": "Permanent Crops CLC",
        "description": "Selected features for Corine Land Cover Category \"Permanent Crops\" (level 2) in Agriculture.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "landuse in (vineyard, orchard, farmland) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-pastures-area": {
        "name": "Pastures CLC",
        "description": "Selected features for Corine Land Cover Category \"Pastures\" (level 2) in Agriculture.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(landuse=grass or natural=grassland or landcover=grass or natural=fell) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-forest-area": {
        "name": "Forests CLC",
        "description": "Selected features for Corine Land Cover Category \"Forests\" (level 2) in Seminatural Land.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(natural=wood or landuse=forest) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-leaf-type": {
        "name": "Leaf Types of Forests CLC",
        "description": "frequency of forests according to Corine Land Cover Category \"Forests\" (level 2) tagged with Leaf Type.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(natural=wood or landuse=forest) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness", "attribute-completeness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-shrub-area": {
        "name": "Shrubs CLC",
        "description": "Selected features for Corine Land Cover Category \"Shrubs\" (level 2) in Seminatural Land.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(natural in (scrub, fell, tundra, shrubbery) or landuse=meadow) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-open-spaces-area": {
        "name": "Open Spaces CLC",
        "description": "Selected features for Corine Land Cover Category \"Open Spaces\" (level 2) in Seminatural Land.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "natural in (beach, bare_rock, rock, stone, glacier, ridge, peak, earth_bank, cliff, arete, shingle, crevasse) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-wetland-area": {
        "name": "Wetlands CLC",
        "description": "Selected features for Corine Land Cover Category \"Wetlands\" (level 1).",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(natural in (wetland, mud) or landuse=salt_pond) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-water-area": {
        "name": "Water CLC",
        "description": "Selected features for Corine Land Cover Category \"Water\" (level 1), excluding waterways.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "(natural in (water, spring, hot_spring) or water in (lake, reservoir, pond, oxbow, basin)) and geometry:polygon",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "clc-waterway-len": {
        "name": "Waterways CLC",
        "description": "Selected features for Corine Land Cover Category \"Waterways\" (level 2) in Water.",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "waterway in (river, canal, stream, drain, ditch) and geometry:line",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["corine-land-cover"],
        "source": null
      },
      "minimal": {
        "name": "Minimal",
        "description": "A minimal topic definition for testing purposes",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "building=* and building!=no and geometry:polygon",
        "indicators": ["minimal"],
        "projects": ["misc"],
        "source": null
      },
      "infrastructure-lines": {
        "name": "Infrastructure Lines",
        "description": "Line objects related to infrastructure",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "(aerialway=* or aeroway=* or highway=* or power=* or railway=* or telecom=*) and geometry:line",
        "indicators": ["mapping-saturation", "currentness"],
        "projects": ["experimental"],
        "source": null
      }
    },
    "qualityDimensions": {
      "completeness": {
        "name": "Completeness",
        "description": "The degree to which subject data associated with an entity has values for all expected attributes and related entity instances in a specific context of use.",
        "source": "https://www.iso.org/standard/78900.html"
      },
      "currentness": {
        "name": "Currentness",
        "description": "The degree to which data has attributes that are of the right age in a specific context of use.",
        "source": "https://www.iso.org/standard/35736.html"
      },
      "minimal": {
        "name": "Minimal",
        "description": "A minimal quality dimension definition for testing purposes.",
        "source": null
      },
      "none": {"name": "None", "description": "No specific quality dimension", "source": null}
    },
    "projects": {
      "core": {"name": "TODO", "description": "something that is still a TODO"},
      "mapaction": {"name": "TODO", "description": "something that is still a TODO"},
      "sketchmap": {"name": "TODO", "description": "something that is still a TODO"},
      "misc": {"name": "TODO", "description": "something that is still a TODO"},
      "experimental": {"name": "TODO", "description": "something that is still a TODO"},
      "corine-land-cover": {"name": "TODO", "description": "something that is still a TODO"},
      "idealvgi": {"name": "TODO", "description": "something that is still a TODO"},
      "expanse": {"name": "TODO", "description": "something that is still a TODO"},
      "bkg": {"name": "TODO", "description": "something that is still a TODO"}
    },
    "attributes": {
      "building-count": {
        "height": {"filter": "height=* or building:levels=*", "name": "Height of Buildings", "description": "TODO"},
        "house_number": {"filter": "addr:housenumber=*", "name": "House Number", "description": "TODO"},
        "address_street": {"filter": "addr:street=*", "name": "Street Adress", "description": "TODO"},
        "address_city": {"filter": "addr:city=*", "name": "City Adress", "description": "TODO"},
        "address_postcode": {"filter": "addr:postcode=*", "name": "Postcode Adress", "description": "TODO"},
        "address_country": {"filter": "addr:country=*", "name": "Country Adress", "description": "TODO"},
        "address_state": {"filter": "addr:state=*", "name": "State Adress", "description": "TODO"},
        "address_suburb": {"filter": "addr:suburb=*", "name": "Suburb Adress", "description": "TODO"},
        "address_district": {"filter": "addr:district=*", "name": "District Adress", "description": "TODO"},
        "address_housenumber": {"filter": "addr:housenumber=*", "name": "House Number Adress", "description": "TODO"},
        "building_levels": {"filter": "building:levels=*", "name": "Levels of Buildings", "description": "TODO"},
        "roof_shape": {"filter": "roof:shape=*", "name": "Shape of Roofs", "description": "TODO"},
        "roof_levels": {"filter": "roof:levels=*", "name": "Levels of Roofs", "description": "TODO"},
        "building_material": {"filter": "building:material=*", "name": "Material of Buildings", "description": "TODO"},
        "roof_material": {"filter": "roof:material=*", "name": "Material of Roofs", "description": "TODO"},
        "roof:colour": {"filter": "roof:colour=*", "name": "Colour of Roofs", "description": "TODO"},
        "building:colour": {"filter": "building:colour=*", "name": "Colour of Buildings", "description": "TODO"}
      },
      "clc-leaf-type": {
        "leaf_type": {
          "filter": "leaf_type in (broadleaved, needleleaved, mixed)",
          "name": "Type of Leaves",
          "description": "TODO"
        }
      },
      "roads": {
        "name": {"filter": "name=*", "name": "Road Name", "description": "TODO"},
        "sidewalk": {"filter": "footway:sidewalk=*", "name": "Sidewalk", "description": "TODO"},
        "crossing": {"filter": "footway:crossing = *", "name": "Crossing", "description": "TODO"},
        "cycleway_lane": {"filter": "cycleway:lane=*", "name": "Cycleway Lane", "description": "TODO"},
        "cycleway_share_busway": {
          "filter": "cycleway:share_busway=*",
          "name": "Cycleway Share Busway",
          "description": "TODO"
        },
        "parking": {
          "filter": "parking:left=* or parking:right=* or parking:both=*",
          "name": "Parking",
          "description": "TODO"
        },
        "maxspeed": {"filter": "maxspeed=*", "name": "Maxspeed", "description": "TODO"},
        "oneway": {"filter": "oneway=*", "name": "Oneway", "description": "TODO"},
        "surface": {"filter": "surface=*", "name": "Surface", "description": "TODO"},
        "highway:speed_camera": {"filter": "highway:speed_camera=*", "name": "Speed Camera", "description": "TODO"}
      }
    }
  }
};
