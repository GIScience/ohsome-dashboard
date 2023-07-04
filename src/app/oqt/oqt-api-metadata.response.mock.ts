export const oqtApiMetadataResponseMock = {
  'api-version': '0.14.2',
  'attribution': {'url': 'https://github.com/GIScience/ohsome-quality-analyst/blob/main/COPYRIGHTS.md'},
  'result': {
    'indicators': {
      'mapping-saturation': {
        'name': 'Mapping Saturation',
        'description': 'Calculate if mapping has saturated. High saturation has been reached if the growth of the fitted curve is minimal.',
        'project': 'core',
        'quality-dimension': 'completeness'
      }
    },
    'reports': {
      'multilevel-mapping-saturation': {
        'name': 'Multilevel Mapping Saturation',
        'description': 'This report shows the mapping saturation of four major Map Features (https://wiki.openstreetmap.org/wiki/Map_features): buildings, land-use/land-cover, points of interest and infrastructure. It evolved from the OSM Element Vectorisation tool (https://gitlab.gistools.geog.uni-heidelberg.de/giscience/ideal-vgi/osm-element-vectorisation).',
        'project': 'core'
      }
    },
    'topics': {
      'building_count': {
        'name': 'Building Count',
        'description': 'All buildings as defined by all objects tagged with \'building=*\'.',
        'endpoint': 'elements/count',
        'filter': 'building=* and building!=no and geometry:polygon',
        'indicators': ['mapping-saturation', 'currentness', 'attribute-completeness'],
        'project': 'core',
        'source': null,
        'ratio_filter': 'building=* and building!=no and geometry:polygon and height=* or building:levels=*'
      },
      'building_area': {
        'name': 'Building Area',
        'description': 'All buildings as defined by all objects tagged with \'building=*\'.',
        'endpoint': 'elements/area',
        'filter': 'building=* and building!=no and geometry:polygon',
        'indicators': ['mapping-saturation', 'building-completeness'],
        'project': 'core',
        'source': null,
        'ratio_filter': null
      },
      'major_roads_count': {
        'name': 'Major Roads Count',
        'description': 'The road network defined by all objects which hold the principal tags for the road network as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway',
        'endpoint': 'elements/count',
        'filter': 'highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way',
        'indicators': ['currentness'],
        'project': 'core',
        'source': null,
        'ratio_filter': 'highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way and name=*'
      },
      'major_roads_length': {
        'name': 'Major Roads Length',
        'description': 'The road network defined by all objects which hold the principal tags for the road network and their link roads as defined in the OSM Wiki`:` https://wiki.openstreetmap.org/wiki/Key:highway',
        'endpoint': 'elements/length',
        'filter': 'highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way',
        'indicators': ['mapping-saturation', 'attribute-completeness'],
        'project': 'core',
        'source': null,
        'ratio_filter': 'highway in (motorway, trunk, motorway_link, trunk_link, primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, unclassified, residential) and type:way and name=*'
      },
      'railway_length': {
        'name': 'Railways',
        'description': 'Railway networks.',
        'endpoint': 'elements/length',
        'filter': 'railway in (rail, subway, tram, light_rail, monorail, funicular, narrow_gauge) and type:way',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': null,
        'ratio_filter': null
      },
      'poi': {
        'name': 'POI',
        'description': 'Points of interest',
        'endpoint': 'elements/count',
        'filter': '(aeroway in (aerodrome, helipad, heliport)) or (amenity in (animal_boarding, animal_shelter, arts_centre, atm, baby_hatch, bank, bar, bbq, bench, bicycle_parking, bicycle_rental, bicycle_repair_station, biergarten, boat_sharing, brothel, bureau_de_change, bus_station, bus_stop, cafe, car_sharing, car_wash, casino, charging_station, cinema, clinic, clock, college, community_centre, compressed_air, courthouse, coworking_space, crematorium, crypt, dentist, doctors, dive_centre, dojo, drinking_water, driving_school, embassy, emergency_phone, ev_charging, fast_food, ferry_terminal, fire_station, food_court, fountain, fuel, gambling, grave_yard, hospital, hunting_stand, ice_cream, internet_cafe, kindergarten, language_school, library, kneipp_water_cure, marketplace, motorcycle_parking, music_school, nightclub, nursing_home, parking, parking_entrance, parking_space, pharmacy, photo_booth, planetarium, place_of_worship, police, post_box, post_office, pub, public_bath, prison, ranger_station, recycling, rescue_station, restaurant, retirement_home, sanitary_dump_station, school, shelter, shower, social_centre, social_facility, spa, stripclub, studio, table, taxi, telephone, toilets, townhall, university, vending_machine, veterinary, waste_basket, waste_disposal, water_point)) or (emergency in (access_point, defibrillator, fire_hydrant)) or (healthcare = blood_donation) or (healthcare:speciality = vacciniation) or (highway = raceway) or (historic in (aircraft, aqueduct, archaeological_site, battlefield, boundary_stone, building, castle, cannon, city_gate, citywalls, farm, fort, gallows, highwater_mark, locomotive, manor, memorial, milestone, monastery, monument, optical_telegraph, pillory, ruins, rune_stone, ship, tomb, wayside_cross, wayside_shrine, wreck)) or (leisure in (adult_gaming_centre, amusement_arcade, beach_resort, bandstand, bird_hide, common, dance, dog_park, firepit, fishing, fitness_centre, garden, golf_course, hackerspace, horse_riding, ice_rink, marina, miniature_golf, nature_reserve, park, picnic_table, pitch, playground, sauna, slipway, sports_centre, stadium, summer_camp, swimming_area, swimming_pool, track, turkish_bad, water_park, wildlife_hide)) or (natural in (beach, cave_entrance, geyser, peak, rock, saddle, spring, volcano, water)) or (public_transport in (platform, stop_position, station, stop_area)) or (railway in (halt, station, tram_station)) or (shop in (agrarian, alcohol, antiques, art, bag, bakery, beauty, bed, beverages, bicycle, books, boutique, brewing_supplies, business_machines, butcher, cafe,camera, candles, car, car_parts, carpet, curtain, cheese, chemist, chocolate, clothes, coffee, computer, confectionery, convenience, copyshop, cosmetics, dairy, deli, department_store, doityourself, dry_cleaning, electrical, electronics, erotic, estate_agent, e-cigarette, farm, fashion, fishing, florist, funeral_directors, furniture, games, garden_centre, garden_furniture, gas, general, gift, glaziery, greengrocer, grocery, hairdresser, hairdresser_supply, hardware, hearing_aids, herbalist, hifi, houseware, hunting, insurance, interior_decoration, jewelry, laundry, leather, locksmith, kiosk, kitchen, lamps, lottery, mall, massage, medical_supply, mobile_phone, model, motorcycle, music, musical_instrument, nutrition_supplements, newsagent, optician, organic, outdoor, paint, pastry, perfumery, photo, pyrotechnics, rediotechnics, seafood, second_hand,secruity, shoes, spices, sports, stationery, supermarket, swimming_pool, tailor, tattoo, tea, ticket, tiles, tobacco, toys, travel_agency, trophy, tyres, variety_store, video, video_games, watches, weapons, wine, pet)) or (tourism in (alpine_hut, apartment, aquarium, artwork, attraction, camp_site, caravan_site, chalet, gallery, museum, guest_house, hostel, hotel, motel, picnic_site, theme_park, viewpoint, wilderness_hut, zoo)) or (vaccination = covid19)',
        'indicators': ['mapping-saturation', 'currentness', 'density'],
        'project': 'core',
        'source': 'https://github.com/GIScience/openpoiservice/blob/master/openpoiservice/server/categories/categories.yml',
        'ratio_filter': null
      },
      'schools': {
        'name': 'Schools',
        'description': 'Count of schools.',
        'endpoint': 'elements/count',
        'filter': 'amenity=school',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool',
        'ratio_filter': null
      },
      'kindergarten': {
        'name': 'Kindergarten',
        'description': 'Count of kindergarten.',
        'endpoint': 'elements/count',
        'filter': 'amenity=kindergarten',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dkindergarten',
        'ratio_filter': null
      },
      'clinics': {
        'name': 'Clinics',
        'description': 'Count of clinics.',
        'endpoint': 'elements/count',
        'filter': 'amenity=clinic or healthcare=clinic',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project',
        'ratio_filter': null
      },
      'doctors': {
        'name': 'Doctors',
        'description': 'Count of doctors.',
        'endpoint': 'elements/count',
        'filter': 'amenity=doctors or healthcare=doctor',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project',
        'ratio_filter': null
      },
      'bus_stops': {
        'name': 'Bus Stops',
        'description': 'Count of bus stops.',
        'endpoint': 'elements/count',
        'filter': 'highway=bus_stop',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop',
        'ratio_filter': null
      },
      'tram_stops': {
        'name': 'Tram Stops',
        'description': 'Count of schools.',
        'endpoint': 'elements/count',
        'filter': 'railway=tram_stop',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:railway%3Dtram_stop',
        'ratio_filter': null
      },
      'subway_stations': {
        'name': 'Subway Stations',
        'description': 'Count of subway stops.',
        'endpoint': 'elements/count',
        'filter': 'station=subway',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:station%3Dsubway',
        'ratio_filter': null
      },
      'supermarkets': {
        'name': 'Supermarkets',
        'description': 'Count of supermarkets.',
        'endpoint': 'elements/count',
        'filter': 'shop=supermarket',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket',
        'ratio_filter': null
      },
      'marketplaces': {
        'name': 'Marketplaces',
        'description': 'Count of marketplaces.',
        'endpoint': 'elements/count',
        'filter': 'amenity=marketplace',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dmarketplace',
        'ratio_filter': null
      },
      'parks': {
        'name': 'Parks',
        'description': 'Count of parks.',
        'endpoint': 'elements/count',
        'filter': 'leisure=park',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpark',
        'ratio_filter': null
      },
      'forests': {
        'name': 'Forests',
        'description': 'Count of forests.',
        'endpoint': 'elements/count',
        'filter': 'landuse=forest',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Forest',
        'ratio_filter': null
      },
      'fitness_centres': {
        'name': 'Fitness Centres',
        'description': 'Count of fitness centres.',
        'endpoint': 'elements/count',
        'filter': 'leisure in (fitness_centre, sports_centre)',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Gym_/_Fitness_centre',
        'ratio_filter': null
      },
      'fire_stations': {
        'name': 'Fire Stations',
        'description': 'Count of firestations.',
        'endpoint': 'elements/count',
        'filter': 'amenity=fire_station',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfire_station',
        'ratio_filter': null
      },
      'hospitals': {
        'name': 'Hospitals',
        'description': 'Count of hospitals.',
        'endpoint': 'elements/count',
        'filter': 'amenity=hospital or healthcare=hospital',
        'indicators': ['mapping-saturation', 'currentness'],
        'project': 'core',
        'source': 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dhospital',
        'ratio_filter': null
      }
    },
    'quality-dimensions': {
      'completeness': {'name': 'Completeness', 'description': 'something that is still a TODO'},
      'currentness': {'name': 'Currentness', 'description': 'something that is still a TODO'},
      'minimal': {'name': 'Minimal', 'description': 'something that is still a TODO'},
      'none': {'name': 'None', 'description': 'No specific quality dimension'}
    }
  }
};
