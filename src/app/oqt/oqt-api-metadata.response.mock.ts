import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {AttributeResponseJSON} from "./types/types";

// TODO: improve result mock by adding attributes
export const oqtAttributesResponseMock: AttributeResponseJSON = {
  "apiVersion": "1.2.1",
  "attribution": {
    "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
  },
  "result": {}
};

export const oqtApiMetadataResponseMock: MetadataResponseJSON = {
  "apiVersion": "1.2.1",
  "attribution": {
    "url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"
  },
  "result": {
    "indicators": {
      "building-comparison": {
        "name": "Building Comparison",
        "description": "Compare the building area of OSM buildings with the building area of reference data.",
        "projects": [
          "bkg",
          "core"
        ],
        "qualityDimension": "completeness"
      },
      "mapping-saturation": {
        "name": "Mapping Saturation",
        "description": "Calculate if mapping has saturated. High saturation has been reached if the growth of the fitted curve is minimal.",
        "projects": [
          "core",
          "corine-land-cover",
          "expanse",
          "experimental",
          "idealvgi",
          "mapaction",
          "sketchmap",
          "bkg"
        ],
        "qualityDimension": "completeness"
      },
      "currentness": {
        "name": "Currentness",
        "description": "Estimate currentness of features by classifying contributions based on topic specific temporal thresholds into three groups: up-to-date, in-between and out-of-date.",
        "projects": [
          "core",
          "bkg"
        ],
        "qualityDimension": "currentness"
      }
    },
    "topics": {
      "building-count": {
        "name": "Building Count",
        "description": "All buildings as defined by all objects tagged with 'building=*'.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "building=* and building!=no and geometry:polygon",
        "indicators": [
          "mapping-saturation",
          "currentness",
          "attribute-completeness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": null
      },
      "building-area": {
        "name": "Building Area",
        "description": "All buildings as defined by all objects tagged with 'building=*'.",
        "endpoint": "elements",
        "aggregationType": "area",
        "filter": "building=* and building!=no and geometry:polygon",
        "indicators": [
          "mapping-saturation",
          "building-completeness",
          "building-comparison"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": null
      },
      "major-roads-length": {
        "name": "Major Roads Length",
        "description": "The road network defined by all objects which hold the principal tags for the road network and their link roads as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way",
        "indicators": [
          "mapping-saturation",
          "attribute-completeness",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": null
      },
      "railway-length": {
        "name": "Railways",
        "description": "Railway networks.",
        "endpoint": "elements",
        "aggregationType": "length",
        "filter": "railway in (rail, subway, tram, light_rail, monorail, funicular, narrow_gauge) and type:way",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": null
      },
      "poi": {
        "name": "POI",
        "description": "Points of interest",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "(aeroway in (aerodrome, helipad, heliport)) or (amenity in (animal_boarding, animal_shelter, arts_centre, atm, baby_hatch, bank, bar, bbq, bench, bicycle_parking, bicycle_rental, bicycle_repair_station, biergarten, boat_sharing, brothel, bureau_de_change, bus_station, bus_stop, cafe, car_sharing, car_wash, casino, charging_station, cinema, clinic, clock, college, community_centre, compressed_air, courthouse, coworking_space, crematorium, crypt, dentist, doctors, dive_centre, dojo, drinking_water, driving_school, embassy, emergency_phone, ev_charging, fast_food, ferry_terminal, fire_station, food_court, fountain, fuel, gambling, grave_yard, hospital, hunting_stand, ice_cream, internet_cafe, kindergarten, language_school, library, kneipp_water_cure, marketplace, motorcycle_parking, music_school, nightclub, nursing_home, parking, parking_entrance, parking_space, pharmacy, photo_booth, planetarium, place_of_worship, police, post_box, post_office, pub, public_bath, prison, ranger_station, recycling, rescue_station, restaurant, retirement_home, sanitary_dump_station, school, shelter, shower, social_centre, social_facility, spa, stripclub, studio, table, taxi, telephone, toilets, townhall, university, vending_machine, veterinary, waste_basket, waste_disposal, water_point)) or (emergency in (access_point, defibrillator, fire_hydrant)) or (healthcare = blood_donation) or (healthcare:speciality = vacciniation) or (highway = raceway) or (historic in (aircraft, aqueduct, archaeological_site, battlefield, boundary_stone, building, castle, cannon, city_gate, citywalls, farm, fort, gallows, highwater_mark, locomotive, manor, memorial, milestone, monastery, monument, optical_telegraph, pillory, ruins, rune_stone, ship, tomb, wayside_cross, wayside_shrine, wreck)) or (leisure in (adult_gaming_centre, amusement_arcade, beach_resort, bandstand, bird_hide, common, dance, dog_park, firepit, fishing, fitness_centre, garden, golf_course, hackerspace, horse_riding, ice_rink, marina, miniature_golf, nature_reserve, park, picnic_table, pitch, playground, sauna, slipway, sports_centre, stadium, summer_camp, swimming_area, swimming_pool, track, turkish_bad, water_park, wildlife_hide)) or (natural in (beach, cave_entrance, geyser, peak, rock, saddle, spring, volcano, water)) or (public_transport in (platform, stop_position, station, stop_area)) or (railway in (halt, station, tram_station)) or (shop in (agrarian, alcohol, antiques, art, bag, bakery, beauty, bed, beverages, bicycle, books, boutique, brewing_supplies, business_machines, butcher, cafe,camera, candles, car, car_parts, carpet, curtain, cheese, chemist, chocolate, clothes, coffee, computer, confectionery, convenience, copyshop, cosmetics, dairy, deli, department_store, doityourself, dry_cleaning, electrical, electronics, erotic, estate_agent, e-cigarette, farm, fashion, fishing, florist, funeral_directors, furniture, games, garden_centre, garden_furniture, gas, general, gift, glaziery, greengrocer, grocery, hairdresser, hairdresser_supply, hardware, hearing_aids, herbalist, hifi, houseware, hunting, insurance, interior_decoration, jewelry, laundry, leather, locksmith, kiosk, kitchen, lamps, lottery, mall, massage, medical_supply, mobile_phone, model, motorcycle, music, musical_instrument, nutrition_supplements, newsagent, optician, organic, outdoor, paint, pastry, perfumery, photo, pyrotechnics, rediotechnics, seafood, second_hand,secruity, shoes, spices, sports, stationery, supermarket, swimming_pool, tailor, tattoo, tea, ticket, tiles, tobacco, toys, travel_agency, trophy, tyres, variety_store, video, video_games, watches, weapons, wine, pet)) or (tourism in (alpine_hut, apartment, aquarium, artwork, attraction, camp_site, caravan_site, chalet, gallery, museum, guest_house, hostel, hotel, motel, picnic_site, theme_park, viewpoint, wilderness_hut, zoo)) or (vaccination = covid19)",
        "indicators": [
          "mapping-saturation",
          "currentness",
          "density"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://github.com/GIScience/openpoiservice/blob/master/openpoiservice/server/categories/categories.yml"
      },
      "schools": {
        "name": "Schools",
        "description": "Count of schools.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=school",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool"
      },
      "kindergarten": {
        "name": "Kindergarten",
        "description": "Count of kindergarten.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=kindergarten",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dkindergarten"
      },
      "clinics": {
        "name": "Clinics",
        "description": "Count of clinics.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=clinic or healthcare=clinic",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
      },
      "doctors": {
        "name": "Doctors",
        "description": "Count of doctors.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=doctors or healthcare=doctor",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
      },
      "bus-stops": {
        "name": "Bus Stops",
        "description": "Count of bus stops.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "highway=bus_stop",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop"
      },
      "tram-stops": {
        "name": "Tram Stops",
        "description": "Count of schools.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "railway=tram_stop",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:railway%3Dtram_stop"
      },
      "subway-stations": {
        "name": "Subway Stations",
        "description": "Count of subway stops.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "station=subway",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:station%3Dsubway"
      },
      "supermarkets": {
        "name": "Supermarkets",
        "description": "Count of supermarkets.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "shop=supermarket",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket"
      },
      "marketplaces": {
        "name": "Marketplaces",
        "description": "Count of marketplaces.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=marketplace",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dmarketplace"
      },
      "parks": {
        "name": "Parks",
        "description": "Count of parks.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "leisure=park",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpark"
      },
      "forests": {
        "name": "Forests",
        "description": "Count of forests.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "landuse=forest",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Forest"
      },
      "fitness-centres": {
        "name": "Fitness Centres",
        "description": "Count of fitness centres.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "leisure in (fitness_centre, sports_centre)",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Gym_/_Fitness_centre"
      },
      "fire-stations": {
        "name": "Fire Stations",
        "description": "Count of firestations.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=fire_station",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfire_station"
      },
      "hospitals": {
        "name": "Hospitals",
        "description": "Count of hospitals.",
        "endpoint": "elements",
        "aggregationType": "count",
        "filter": "amenity=hospital or healthcare=hospital",
        "indicators": [
          "mapping-saturation",
          "currentness"
        ],
        "projects": [
          "core",
          "bkg"
        ],
        "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dhospital"
      }
    },
    "qualityDimensions": {
      "completeness": {
        "name": "Completeness",
        "description": "something that is still a TODO"
      },
      "currentness": {
        "name": "Currentness",
        "description": "something that is still a TODO"
      },
      "minimal": {
        "name": "Minimal",
        "description": "something that is still a TODO"
      },
      "none": {
        "name": "None",
        "description": "No specific quality dimension"
      }
    },
    "projects": {
      "core": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "mapaction": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "sketchmap": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "misc": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "experimental": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "corine-land-cover": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "idealvgi": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "expanse": {
        "name": "TODO",
        "description": "something that is still a TODO"
      },
      "bkg": {
        "name": "TODO",
        "description": "something that is still a TODO"
      }
    }
  }
};
