import {MetadataResponseJSON} from './types/MetadataResponseJSON';
import {AttributeResponseJSON} from "./types/types";

// produced with https://api.quality.ohsome.org/v1/metadata/attributes?project=all
export const oqtAttributesResponseMock: AttributeResponseJSON = {
  "apiVersion": "1.17.1",
  "attribution": {"url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"},
  "result": {
    "building-count": {
      "height": {"filter": "height=* or building:levels=*", "name": "Gebäudehöhe", "description": "TODO"},
      "house-number": {"filter": "addr:housenumber=*", "name": "Hausnummer", "description": "TODO"},
      "address-street": {"filter": "addr:street=*", "name": "Straßenadresse", "description": "TODO"},
      "address-city": {"filter": "addr:city=*", "name": "Stadtadresse", "description": "TODO"},
      "address-postcode": {"filter": "addr:postcode=*", "name": "Postleitzahl", "description": "TODO"},
      "address-country": {"filter": "addr:country=*", "name": "Landesadresse", "description": "TODO"},
      "address-state": {"filter": "addr:state=*", "name": "Bundeslandadresse", "description": "TODO"},
      "address-suburb": {"filter": "addr:suburb=*", "name": "Vorortadresse", "description": "TODO"},
      "address-district": {"filter": "addr:district=*", "name": "Bezirksadresse", "description": "TODO"},
      "building-levels": {"filter": "building:levels=*", "name": "Stockwerke von Gebäuden", "description": "TODO"},
      "roof-shape": {"filter": "roof:shape=*", "name": "Dachform", "description": "TODO"},
      "roof-levels": {"filter": "roof:levels=*", "name": "Dachebenen", "description": "TODO"},
      "building-material": {"filter": "building:material=*", "name": "Baumaterial der Gebäude", "description": "TODO"},
      "roof-material": {"filter": "roof:material=*", "name": "Material der Dächer", "description": "TODO"},
      "roof-colour": {"filter": "roof:colour=*", "name": "Farbe der Dächer", "description": "TODO"},
      "building-colour": {"filter": "building:colour=*", "name": "Farbe der Gebäude", "description": "TODO"},
      "source": {"filter": "source=*", "name": "Quelle", "description": "TODO"}
    },
    "bus-stops": {
      "public-transport-platform": {
        "filter": "public_transport=platform",
        "name": "Bahnsteig des öffentlichen Verkehrs",
        "description": "TODO"
      },
      "public-transport-stop-area": {
        "filter": "public_transport=stop_area",
        "name": "Bushaltestellenbereich",
        "description": "TODO"
      },
      "shelter": {"filter": "shelter=*", "name": "Unterstand", "description": "TODO"}
    },
    "clinics": {
      "healthcare-birthing-centre": {
        "filter": "healthcare=birthing_centre",
        "name": "Geburtshaus",
        "description": "TODO"
      },
      "healthcare-blood-donation": {"filter": "healthcare=blood_donation", "name": "Blutspende", "description": "TODO"},
      "healthcare-rehabilitation": {
        "filter": "healthcare=rehabilitation",
        "name": "Rehabilitation",
        "description": "TODO"
      },
      "healthcare-vaccination-centre": {
        "filter": "healthcare=vaccination_centre",
        "name": "Impfzentrum",
        "description": "TODO"
      },
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
      "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"}
    },
    "doctors": {
      "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"},
      "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
      "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"},
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
      "Website": {"filter": "website=*", "name": "Website", "description": "TODO"}
    },
    "hospitals": {
      "emergency": {"filter": "emergency=*", "name": "Notfall", "description": "TODO"},
      "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
      "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"},
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
    },
    "fitness-centres": {
      "sport-fitness": {"filter": "sport=fitness", "name": "Fitness", "description": "TODO"},
      "sport-swimming": {"filter": "sport=swimming", "name": "Schwimmen", "description": "TODO"},
      "sport-weightlifting": {"filter": "sport=weightlifting", "name": "Gewichtheben", "description": "TODO"},
      "sport": {"filter": "sport=*", "name": "Sport", "description": "TODO"},
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
    },
    "forests": {"leaf-type": {"filter": "leaf_type=*", "name": "Blattart", "description": "TODO"}},
    "kindergarten": {
      "leisure-playground": {
        "filter": "leisure=playground",
        "name": "Spielplatz",
        "description": "TODO"
      }, "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"}
    },
    "marketplaces": {
      "craft-winery": {"filter": "craft=winery", "name": "Weingut", "description": "TODO"},
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
      "shop-name": {"filter": "name=*", "name": "Name des Geschäfts", "description": "TODO"}
    },
    "parks": {"tourism-theme-park": {"filter": "tourism=theme_park", "name": "Freizeitpark", "description": "TODO"}},
    "sports-pitch": {
      "sport": {"filter": "sport=*", "name": "Sport", "description": "TODO"},
      "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"},
      "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
      "access": {"filter": "access=*", "name": "Zugang", "description": "TODO"}
    },
    "schools": {
      "leisure-playground": {"filter": "leisure=playground", "name": "Spielplatz", "description": "TODO"},
      "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
      "website": {"filter": "website=*", "name": "Website", "description": "TODO"},
      "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"}
    },
    "subway-stations": {
      "tunnel-yes": {"filter": "tunnel=yes", "name": "Tunnel", "description": "TODO"},
      "public-transport-stop-area": {
        "filter": "public_transport=stop_area",
        "name": "U-Bahn-Haltestellenbereich",
        "description": "TODO"
      },
      "public-transport-platform": {
        "filter": "public_transport=platform",
        "name": "Bahnsteig des öffentlichen Verkehrs",
        "description": "TODO"
      }
    },
    "supermarkets": {
      "brand": {"filter": "brand=*", "name": "Marke", "description": "TODO"},
      "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
    },
    "tram-stops": {
      "public-transport-stop-area": {
        "filter": "public_transport=stop_area",
        "name": "Straßenbahnhaltestellenbereich",
        "description": "TODO"
      },
      "public-transport-platform": {
        "filter": "public_transport=platform",
        "name": "Bahnsteig des öffentlichen Verkehrs",
        "description": "TODO"
      }
    },
    "clc-leaf-type": {
      "leaf-type": {
        "filter": "leaf_type in (broadleaved, needleleaved, mixed)",
        "name": "Blattart",
        "description": "TODO"
      }
    },
    "roads": {
      "name": {"filter": "name=* or ref=*", "name": "Straßenname", "description": "TODO"},
      "sidewalk": {
        "filter": "sidewalk=* or sidewalk:right=* or sidewalk:left=* or sidewalk:both=*",
        "name": "Gehweg",
        "description": "TODO"
      },
      "crossing": {"filter": "crossing=*", "name": "Fußgängerüberweg", "description": "TODO"},
      "cycleway": {
        "filter": "cycleway=* or cycleway:both=* or cycleway:right=* or cycleway:left=*",
        "name": "Radweg",
        "description": "TODO"
      },
      "cycleway-share-busway": {
        "filter": "cycleway=share_busway or cycleway:both=share_busway or cycleway:left=share_busway or cycleway:right=share_busway",
        "name": "Radweg gemeinsam mit Busspur",
        "description": "TODO"
      },
      "parking": {
        "filter": "parking:left=* or parking:right=* or parking:both=* or parking=*",
        "name": "Parkplatz",
        "description": "TODO"
      },
      "maxspeed": {"filter": "maxspeed=*", "name": "Höchstgeschwindigkeit", "description": "TODO"},
      "oneway": {"filter": "oneway=*", "name": "Einbahnstraße", "description": "TODO"},
      "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
      "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"}
    },
    "roads-all-highways": {
      "name": {"filter": "name=*", "name": "Straßenname", "description": "TODO"},
      "sidewalk": {
        "filter": "sidewalk=* or sidewalk:right=* or sidewalk:left=* or sidewalk:both=*",
        "name": "Gehweg",
        "description": "TODO"
      },
      "lanes": {"filter": "lanes=*", "name": "Fahrspuren", "description": "TODO"},
      "parking": {
        "filter": "parking:left=* or parking:right=* or parking:both=* or parking=*",
        "name": "Parkplatz",
        "description": "TODO"
      },
      "maxspeed": {"filter": "maxspeed=*", "name": "Höchstgeschwindigkeit", "description": "TODO"},
      "oneway": {"filter": "oneway=*", "name": "Einbahnstraße", "description": "TODO"},
      "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
      "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"}
    },
    "public-transport-stops": {
      "shelter": {"filter": "shelter=*", "name": "Unterstand", "description": "TODO"},
      "bench": {"filter": "bench=*", "name": "Sitzbank", "description": "TODO"},
      "trash-bin": {"filter": "bin=*", "name": "Mülleimer", "description": "TODO"},
      "tactile-paving": {"filter": "tactile_paving=*", "name": "Taktiles Pflaster", "description": "TODO"},
      "wheelchair-accessibility": {"filter": "wheelchair=*", "name": "Rollstuhlgerecht", "description": "TODO"},
      "bus-lines": {
        "filter": "route_ref=*",
        "name": "Buslinien",
        "description": "Liste aller Buslinien, die an einer bestimmten Haltestelle halten."
      },
      "departures-board": {"filter": "departures_board=*", "name": "Abfahrtstafel", "description": "TODO"}
    },
    "power_lines": {
      "voltage": {
        "filter": "voltage=*",
        "name": "Spannung",
        "description": "Beschreibt die Spannung von Stromleitungen."
      },
      "cable": {
        "filter": "cable=*",
        "name": "Kabel",
        "description": "Anzahl elektrisch getrennter, einzelner oder gebündelter stromführender Leiter in einer Stromleitung oder einem Kabel."
      },
      "frequency": {
        "filter": "frequency=*",
        "name": "Frequenz",
        "description": "Beschreibt die Frequenz der Energieinfrastruktur in der Einheit Hertz."
      },
      "operator": {
        "filter": "operator=*",
        "name": "Betreiber",
        "description": "Unternehmen, Organisation, Person oder andere Einheit, die direkt für den aktuellen Betrieb eines Kartenelements verantwortlich ist."
      }
    },
    "power_substation": {
      "voltage": {
        "filter": "voltage=*",
        "name": "Spannung",
        "description": "Zur Beschreibung der Spannung von Umspannwerken."
      },
      "operator": {
        "filter": "operator=*",
        "name": "Betreiber",
        "description": "Unternehmen, Organisation, Person oder andere Einheit, die direkt für den aktuellen Betrieb eines Kartenelements verantwortlich ist."
      },
      "location": {
        "filter": "location=*",
        "name": "Standort",
        "description": "Zur Definition der Position eines Objekts, das sich über oder unter der Erde oder in Bezug auf andere Objekte wie Dächer, Brücken oder Gebäude befinden kann."
      }
    }
  }
};

// produced with https://api.quality.ohsome.org/v1/metadata?project=all
export const oqtApiMetadataResponseMock: MetadataResponseJSON = {
    "apiVersion": "1.17.1",
    "attribution": {"url": "https://github.com/GIScience/ohsome-quality-api/blob/main/COPYRIGHTS.md"},
    "result": {
      "indicators": {
        "mapping-saturation": {
          "name": "Kartierungssättigung",
          "description": "Berechne ob das Kartieren gesättigt ist. Bei hohe Sättigung ist die Steigung der Kurve minimal.",
          "projects": ["core", "corine-land-cover", "expanse", "experimental", "idealvgi", "mapaction", "sketchmap", "bkg", "unicef"],
          "qualityDimension": "completeness"
        },
        "currentness": {
          "name": "Aktualität",
          "description": "Schätzung der Aktualität von Merkmalen durch Klassifizierung der Beiträge anhand themenspezifischer zeitlicher Schwellenwerte in drei Gruppen: aktuell, dazwischen und veraltet.",
          "projects": ["core", "bkg", "unicef"],
          "qualityDimension": "currentness"
        },
        "road-comparison": {
          "name": "Straßenvergleich",
          "description": "Verleich der Straßenlänge in OSM mit der Straßenlänge in einem Referenzdatensatz.",
          "projects": ["bkg", "core", "unicef"],
          "qualityDimension": "completeness"
        },
        "building-comparison": {
          "name": "Gebäudevergleich",
          "description": "Vergleich der Gebäude in OSM mit den Gebäuden in einem Referenzdatensatz.",
          "projects": ["bkg", "core"],
          "qualityDimension": "completeness"
        },
        "attribute-completeness": {
          "name": "Attributvollständigkeit",
          "description": "Berechne das Verhältnis von OSM-Features im Vergleich zu Features, die mitzusätzlichen erwarteten Tags übereinstimmen.",
          "projects": ["bkg", "core"],
          "qualityDimension": "completeness"
        },
        "land-cover-thematic-accuracy": {
          "name": "Thematische Genauigkeit für Landbedeckung",
          "description": "Thematische Genauigkeit für OpenStreetMap Landbedeckungsdaten im Vergleich zu  <a href=\"https://land.copernicus.eu/en/products/corine-land-cover\">CORINE Land Cover (CLC)</a> Datensatz.",
          "projects": ["core"],
          "qualityDimension": "thematic-accuracy"
        },
        "land-cover-completeness": {
          "name": "Landbedeckungsvollständigkeit",
          "description": "Prozentualer Anteil der Fläche des Untersuchungsgebiets, der durch OpenStreetMap-Landbedeckungsdaten abgedeckt ist.",
          "projects": ["core"],
          "qualityDimension": "completeness"
        },
        "roads-thematic-accuracy": {
          "name": "Thematische Genauigkeit für Straßen",
          "description": "Vergleich der OSM-Straßenattribute mit den Attributen des <a target=\"_blank\" href=\"https://mis.bkg.bund.de/trefferanzeige?docuuid=66656563-c818-4587-bde1-f4bed2787851\">Digitales Landschaftsmodell (DLM) </a> dataset.",
          "projects": ["bkg", "core"],
          "qualityDimension": "none"
        }
      },
      "topics": {
        "custom-topic": {
          "name": "Anpassbares Thema",
          "description": "Ein anpassbares Thema für selbst definierte Filter.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "building=* and building!=no and geometry:polygon",
          "indicators": ["minimal", "mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "bridges_count": {
          "name": "Brücken (Anzahl)",
          "description": "Anzahl aller als Brücke gekennzeichneten Polygone.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "man_made=bridge and geometry:polygon",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "bridges_cars": {
          "name": "Brücken (Autos)",
          "description": "Alle linearen OSM-Objekte, die sich auf von Fahrzeugen nutzbare Brücken beziehen.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "highway in (motorway, trunk, primary, secondary, tertiary, residential, service, living_street, trunk_link, motorway_link, primary_link, secondary_link, tertiary_link, unclassified) and bridge=* and geometry:line",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "bridges_all_ways": {
          "name": "Brücken (alle Wege)",
          "description": "Alle linearen OSM-Objekte, die sich auf Brücken beziehen, einschließlich reiner Fußwege.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "bridge=* and geometry:line",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "bus-stops": {
          "name": "Bushaltestellen",
          "description": "Anzahl der Bushaltestellen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "highway=bus_stop and type:node",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:highway%3Dbus_stop"
        },
        "railway-length": {
          "name": "Eisenbahnen",
          "description": "Eisenbahnnetze.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "railway in (rail, subway, tram, light_rail, monorail, funicular, narrow_gauge) and type:way",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "fire-stations": {
          "name": "Feuerwachen",
          "description": "Anzahl der Feuerwachen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "amenity=fire_station and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfire_station"
        },
        "fitness-centres": {
          "name": "Fitnesszentren",
          "description": "Anzahl der Fitnesszentren.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "leisure in (fitness_centre, sports_centre) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Gym_/_Fitness_centre"
        },
        "footway": {
          "name": "Footway",
          "description": "Alle linearen OSM-Objekte, die üblicherweise zum Gehen genutzt werden, einschließlich ausgewiesener Fußwege, gemeinsamer Nutzungspfade sowie Straßen, auf denen Fußverkehr erlaubt ist oder Gehwege existieren.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "(\n  (highway=footway)\n  or (highway=path and (foot=designated or foot=yes))\n  or (highway=pedestrian)\n  or (highway=steps)\n  or (highway=cycleway and foot=yes)\n  or (foot=yes)\n  or (footway=sidewalk)\n  or (footway=crossing)\n) and geometry:line",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core"],
          "source": "https://wiki.openstreetmap.org/wiki/Key:foot"
        },
        "footpath": {
          "name": "Fußweg",
          "description": "Alle linearen OSM-Objekte, die üblicherweise zum Gehen genutzt werden, einschließlich ausgewiesener Fußwege, gemeinsamer Nutzungspfade sowie Straßen, auf denen Fußverkehr erlaubt ist oder Gehwege existieren.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "(\n  (highway=footway)\n  or (highway=path and (foot=designated or foot=yes))\n  or (highway=pedestrian)\n  or (highway=steps)\n  or (highway=cycleway and foot=yes)\n  or (sidewalk=* and highway!=motorway)\n  or (foot=yes)\n) and geometry:line",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["silverways", "core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Key:foot"
        },
        "building-count": {
          "name": "Gebäude (Anzahl)",
          "description": "Alle Gebäude, definiert durch alle Objekte mit dem Tag ‚building=*‘.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "building=* and building!=no and geometry:polygon",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "building-area": {
          "name": "Gebäude (Fläche)",
          "description": "Alle Gebäude, definiert durch alle Objekte mit dem Tag ‚building=*‘.",
          "endpoint": "elements",
          "aggregationType": "area",
          "filter": "building=* and building!=no and geometry:polygon",
          "indicators": ["mapping-saturation", "currentness", "building-comparison", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "kindergarten": {
          "name": "Kindergärten",
          "description": "Anzahl der Kindergärten.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "amenity=kindergarten and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dkindergarten"
        },
        "clinics": {
          "name": "Kliniken",
          "description": "Anzahl der Kliniken.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "(amenity=clinic or healthcare=clinic) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
        },
        "hospitals": {
          "name": "Krankenhäuser",
          "description": "Anzahl der Krankenhäuser.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "(amenity=hospital or healthcare=hospital) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg", "unicef"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dhospital"
        },
        "land-cover": {
          "name": "Landnutzung und Landbedeckung",
          "description": "Objekte im Zusammenhang mit Landnutzung und Landbedeckung.",
          "endpoint": "elements",
          "aggregationType": "area",
          "filter": "(landuse=* and landuse!=no) or natural in (wood,  grassland, scrub, heath, fell, beach, sand, scree,  shingle, bare_rock, glacier, mud, rock, cliff, fill, wetland, water, pond) or leisure in (marina, park,  garden, pitch, golf_course, playground, stadium,  recreation_ground, common, dog_park) and geometry:polygon",
          "indicators": ["mapping-saturation", "currentness", "land-cover-thematic-accuracy", "land-cover-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "marketplaces": {
          "name": "Marktplätze",
          "description": "Anzahl der Marktplätze.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "amenity=marketplace and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dmarketplace"
        },
        "poi": {
          "name": "POI",
          "description": "Points of Interest (Orte von Interesse).",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "((aeroway in (aerodrome, helipad, heliport)) or (amenity in (animal_boarding, animal_shelter, arts_centre, atm, baby_hatch, bank, bar, bbq, bench, bicycle_parking, bicycle_rental, bicycle_repair_station, biergarten, boat_sharing, brothel, bureau_de_change, bus_station, bus_stop, cafe, car_sharing, car_wash, casino, charging_station, cinema, clinic, clock, college, community_centre, compressed_air, courthouse, coworking_space, crematorium, crypt, dentist, doctors, dive_centre, dojo, drinking_water, driving_school, embassy, emergency_phone, ev_charging, fast_food, ferry_terminal, fire_station, food_court, fountain, fuel, gambling, grave_yard, hospital, hunting_stand, ice_cream, internet_cafe, kindergarten, language_school, library, kneipp_water_cure, marketplace, motorcycle_parking, music_school, nightclub, nursing_home, parking, parking_entrance, parking_space, pharmacy, photo_booth, planetarium, place_of_worship, police, post_box, post_office, pub, public_bath, prison, ranger_station, recycling, rescue_station, restaurant, retirement_home, sanitary_dump_station, school, shelter, shower, social_centre, social_facility, spa, stripclub, studio, table, taxi, telephone, toilets, townhall, university, vending_machine, veterinary, waste_basket, waste_disposal, water_point)) or (emergency in (access_point, defibrillator, fire_hydrant)) or (healthcare = blood_donation) or (healthcare:speciality = vacciniation) or (highway = raceway) or (historic in (aircraft, aqueduct, archaeological_site, battlefield, boundary_stone, building, castle, cannon, city_gate, citywalls, farm, fort, gallows, highwater_mark, locomotive, manor, memorial, milestone, monastery, monument, optical_telegraph, pillory, ruins, rune_stone, ship, tomb, wayside_cross, wayside_shrine, wreck)) or (leisure in (adult_gaming_centre, amusement_arcade, beach_resort, bandstand, bird_hide, common, dance, dog_park, firepit, fishing, fitness_centre, garden, golf_course, hackerspace, horse_riding, ice_rink, marina, miniature_golf, nature_reserve, park, picnic_table, pitch, playground, sauna, slipway, sports_centre, stadium, summer_camp, swimming_area, swimming_pool, track, turkish_bad, water_park, wildlife_hide)) or (natural in (beach, cave_entrance, geyser, peak, rock, saddle, spring, volcano, water)) or (public_transport in (platform, stop_position, station, stop_area)) or (railway in (halt, station, tram_station)) or (shop in (agrarian, alcohol, antiques, art, bag, bakery, beauty, bed, beverages, bicycle, books, boutique, brewing_supplies, business_machines, butcher, cafe,camera, candles, car, car_parts, carpet, curtain, cheese, chemist, chocolate, clothes, coffee, computer, confectionery, convenience, copyshop, cosmetics, dairy, deli, department_store, doityourself, dry_cleaning, electrical, electronics, erotic, estate_agent, e-cigarette, farm, fashion, fishing, florist, funeral_directors, furniture, games, garden_centre, garden_furniture, gas, general, gift, glaziery, greengrocer, grocery, hairdresser, hairdresser_supply, hardware, hearing_aids, herbalist, hifi, houseware, hunting, insurance, interior_decoration, jewelry, laundry, leather, locksmith, kiosk, kitchen, lamps, lottery, mall, massage, medical_supply, mobile_phone, model, motorcycle, music, musical_instrument, nutrition_supplements, newsagent, optician, organic, outdoor, paint, pastry, perfumery, photo, pyrotechnics, rediotechnics, seafood, second_hand,secruity, shoes, spices, sports, stationery, supermarket, swimming_pool, tailor, tattoo, tea, ticket, tiles, tobacco, toys, travel_agency, trophy, tyres, variety_store, video, video_games, watches, weapons, wine, pet)) or (tourism in (alpine_hut, apartment, aquarium, artwork, attraction, camp_site, caravan_site, chalet, gallery, museum, guest_house, hostel, hotel, motel, picnic_site, theme_park, viewpoint, wilderness_hut, zoo))) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://github.com/GIScience/openpoiservice/blob/master/openpoiservice/server/categories/categories.yml"
        },
        "parks": {
          "name": "Parks",
          "description": "Anzahl der Parks.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "leisure=park and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpark"
        },
        "cycleway": {
          "name": "Radweg",
          "description": "Alle linearen OSM-Objekte, die sich auf Radwege beziehen. Beinhaltet exklusive Radwege sowie Radwege entlang von Straßen.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "((cycleway=* and cycleway!=no)  or (cycleway:both=*) or (cycleway:right=*) or (cycleway:left=*) or (cycleway:right:lane=*) or (cycleway:both:lane=*) or (cycleway:left:lane=*) or (cycleway:left:oneway=*) or (cycleway:right:oneway=*) or (highway=cycleway) or (highway=path and bicycle=designated) or (bicycle_road=yes) or (cyclestreet=yes)) and geometry:line",
          "indicators": ["mapping-saturation", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        },
        "schools": {
          "name": "Schulen",
          "description": "Anzahl der Schulen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "amenity=school and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg", "unicef"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool"
        },
        "sports-pitch": {
          "name": "Sportplätze",
          "description": "Anzahl der Sportplätze (ein Bereich, der für die Ausübung einer bestimmten Sportart vorgesehen ist).",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "leisure=pitch and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dpitch"
        },
        "roads": {
          "name": "Straßen (Autos)",
          "description": "Alle linearen OSM-Objekte, die sich auf Straßen beziehen, die von Fahrzeugen (z. B. Autos) genutzt werden können. Das Straßennetz, definiert durch alle Objekte, die die Haupt-Tags für das Straßennetz und ihre Verbindungsstraßen tragen, wie im <a href=\"https://wiki.openstreetmap.org/wiki/Highways#Roads_and_tracks\">OSM-Wiki</a> definiert.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "highway in (motorway, trunk, primary, secondary, tertiary, residential, service, living_street, trunk_link, motorway_link, primary_link, secondary_link, tertiary_link, unclassified) and geometry:line",
          "indicators": ["mapping-saturation", "attribute-completeness", "currentness", "user-activity", "roads-thematic-accuracy"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Highways#Roads_and_tracks"
        },
        "roads-all-highways": {
          "name": "Straßen (alle highways)",
          "description": "Alle linearen OSM-Objekte mit dem Haupt-Tag `highway=*`. Das Straßennetz, definiert durch alle Objekte, die die Haupt-Tags für das Straßennetz und ihre Verbindungsstraßen tragen, wie im <a href=\"https://wiki.openstreetmap.org/wiki/Key:highway\">OSM-Wiki</a> definiert.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "highway=* and geometry:line",
          "indicators": ["mapping-saturation", "road-comparison", "attribute-completeness", "currentness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Key:highway"
        },
        "tram-stops": {
          "name": "Straßenbahnhaltestellen",
          "description": "Anzahl der Straßenbahnhaltestellen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "railway=tram_stop and type:node",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:railway%3Dtram_stop"
        },
        "power_lines": {
          "name": "Stromleitungen",
          "description": "Alle linearen OSM-Objekte, die sich auf Stromleitungen beziehen.",
          "endpoint": "elements",
          "aggregationType": "length",
          "filter": "((power=line)  or (power=minor_line)) and geometry:line",
          "indicators": ["attribute-completeness", "mapping-saturation", "currentness", "user-activity"],
          "projects": ["ohmygrid", "core"],
          "source": null
        },
        "supermarkets": {
          "name": "Supermärkte",
          "description": "Anzahl der Supermärkte.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "(shop=supermarket or shop=convenience) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsupermarket"
        },
        "subway-stations": {
          "name": "U-Bahn-Stationen",
          "description": "Anzahl der U-Bahn-Haltestellen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "station=subway and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Tag:station%3Dsubway"
        },
        "power_substations": {
          "name": "Umspannwerk",
          "description": "Eine Anlage, die den Stromfluss in einem Stromnetz mit Transformatoren, Schaltanlagen oder Kompensatoren steuert.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "power=substation and (type:way or type:node)",
          "indicators": ["attribute-completeness", "mapping-saturation", "currentness", "user-activity"],
          "projects": ["ohmygrid", "core"],
          "source": null
        },
        "forests": {
          "name": "Wälder",
          "description": "Anzahl der Wälder.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "landuse=forest and geometry:polygon",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Forest"
        },
        "doctors": {
          "name": "Ärzte",
          "description": "Anzahl der Ärzte.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "(amenity=doctors or healthcare=doctor) and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": "https://wiki.openstreetmap.org/wiki/Global_Healthsites_Mapping_Project"
        },
        "public-transport-stops": {
          "name": "ÖPNV-Haltestellen",
          "description": "Anzahl der ÖPNV-Haltestellen.",
          "endpoint": "elements",
          "aggregationType": "count",
          "filter": "public_transport=platform and (type:way or type:node)",
          "indicators": ["mapping-saturation", "currentness", "attribute-completeness", "user-activity"],
          "projects": ["core", "bkg"],
          "source": null
        }
      },
      "qualityDimensions": {
        "completeness": {
          "name": "Vollständigkeit",
          "description": "Der Grad, in dem mit einer Entität verbundene Fachdaten Werte für alle erwarteten Attribute und zugehörige Entitätsinstanzen in einem bestimmten Verwendungskontext aufweisen.",
          "source": "https://www.iso.org/standard/78900.html"
        },
        "currentness": {
          "name": "Aktualität",
          "description": "Der Grad, in dem Daten Attribute aufweisen, die für einen bestimmten Verwendungskontext das richtige Alter haben.",
          "source": "https://www.iso.org/standard/35736.html"
        },
        "thematic-accuracy": {
          "name": "Thematische Genauigkeit",
          "description": "Der Grad, in dem die Attribute von Daten korrekt sind (mit der \"Wahrheit\"des Referenzdatensatzes übereinstimmen).",
          "source": "https://onlinelibrary.wiley.com/doi/full/10.1155/2014/372349"
        },
        "minimal": {"name": "minimal", "description": "Eine minimale Qualitätsdimension zum Testen.", "source": null},
        "none": {"name": "Keine", "description": "Keine spezifische Qualitätsdimension", "source": null}
      },
      "projects": {
        "core": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "mapaction": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "sketchmap": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "unicef": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "misc": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "experimental": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "corine-land-cover": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "idealvgi": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "expanse": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "bkg": {"name": "TODO", "description": "etwas ist immernoch ein TODO"},
        "ohmygrid": {"name": "ohmygrid", "description": "https://mapyourgrid.org/"},
        "silverways": {"name": "Silver Ways", "description": "https://heigit.org/silver-ways/"}
      },
      "attributes": {
        "building-count": {
          "height": {"filter": "height=* or building:levels=*", "name": "Gebäudehöhe", "description": "TODO"},
          "house-number": {"filter": "addr:housenumber=*", "name": "Hausnummer", "description": "TODO"},
          "address-street": {"filter": "addr:street=*", "name": "Straßenadresse", "description": "TODO"},
          "address-city": {"filter": "addr:city=*", "name": "Stadtadresse", "description": "TODO"},
          "address-postcode": {"filter": "addr:postcode=*", "name": "Postleitzahl", "description": "TODO"},
          "address-country": {"filter": "addr:country=*", "name": "Landesadresse", "description": "TODO"},
          "address-state": {"filter": "addr:state=*", "name": "Bundeslandadresse", "description": "TODO"},
          "address-suburb": {"filter": "addr:suburb=*", "name": "Vorortadresse", "description": "TODO"},
          "address-district": {"filter": "addr:district=*", "name": "Bezirksadresse", "description": "TODO"},
          "building-levels": {"filter": "building:levels=*", "name": "Stockwerke von Gebäuden", "description": "TODO"},
          "roof-shape": {"filter": "roof:shape=*", "name": "Dachform", "description": "TODO"},
          "roof-levels": {"filter": "roof:levels=*", "name": "Dachebenen", "description": "TODO"},
          "building-material": {
            "filter": "building:material=*",
            "name": "Baumaterial der Gebäude",
            "description": "TODO"
          },
          "roof-material": {"filter": "roof:material=*", "name": "Material der Dächer", "description": "TODO"},
          "roof-colour": {"filter": "roof:colour=*", "name": "Farbe der Dächer", "description": "TODO"},
          "building-colour": {"filter": "building:colour=*", "name": "Farbe der Gebäude", "description": "TODO"},
          "source": {"filter": "source=*", "name": "Quelle", "description": "TODO"}
        },
        "bus-stops": {
          "public-transport-platform": {
            "filter": "public_transport=platform",
            "name": "Bahnsteig des öffentlichen Verkehrs",
            "description": "TODO"
          },
          "public-transport-stop-area": {
            "filter": "public_transport=stop_area",
            "name": "Bushaltestellenbereich",
            "description": "TODO"
          },
          "shelter": {"filter": "shelter=*", "name": "Unterstand", "description": "TODO"}
        },
        "clinics": {
          "healthcare-birthing-centre": {
            "filter": "healthcare=birthing_centre",
            "name": "Geburtshaus",
            "description": "TODO"
          },
          "healthcare-blood-donation": {
            "filter": "healthcare=blood_donation",
            "name": "Blutspende",
            "description": "TODO"
          },
          "healthcare-rehabilitation": {
            "filter": "healthcare=rehabilitation",
            "name": "Rehabilitation",
            "description": "TODO"
          },
          "healthcare-vaccination-centre": {
            "filter": "healthcare=vaccination_centre",
            "name": "Impfzentrum",
            "description": "TODO"
          },
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
          "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"}
        },
        "doctors": {
          "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"},
          "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
          "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"},
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
          "Website": {"filter": "website=*", "name": "Website", "description": "TODO"}
        },
        "hospitals": {
          "emergency": {"filter": "emergency=*", "name": "Notfall", "description": "TODO"},
          "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
          "speciality": {"filter": "healthcare:speciality=*", "name": "Fachrichtung", "description": "TODO"},
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
        },
        "fitness-centres": {
          "sport-fitness": {"filter": "sport=fitness", "name": "Fitness", "description": "TODO"},
          "sport-swimming": {"filter": "sport=swimming", "name": "Schwimmen", "description": "TODO"},
          "sport-weightlifting": {"filter": "sport=weightlifting", "name": "Gewichtheben", "description": "TODO"},
          "sport": {"filter": "sport=*", "name": "Sport", "description": "TODO"},
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
        },
        "forests": {"leaf-type": {"filter": "leaf_type=*", "name": "Blattart", "description": "TODO"}},
        "kindergarten": {
          "leisure-playground": {
            "filter": "leisure=playground",
            "name": "Spielplatz",
            "description": "TODO"
          }, "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"}
        },
        "marketplaces": {
          "craft-winery": {"filter": "craft=winery", "name": "Weingut", "description": "TODO"},
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"},
          "shop-name": {"filter": "name=*", "name": "Name des Geschäfts", "description": "TODO"}
        },
        "parks": {"tourism-theme-park": {"filter": "tourism=theme_park", "name": "Freizeitpark", "description": "TODO"}},
        "sports-pitch": {
          "sport": {"filter": "sport=*", "name": "Sport", "description": "TODO"},
          "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"},
          "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
          "access": {"filter": "access=*", "name": "Zugang", "description": "TODO"}
        },
        "schools": {
          "leisure-playground": {"filter": "leisure=playground", "name": "Spielplatz", "description": "TODO"},
          "name": {"filter": "name=*", "name": "Name", "description": "TODO"},
          "website": {"filter": "website=*", "name": "Website", "description": "TODO"},
          "phone-number": {"filter": "phone=*", "name": "Telefonnummer", "description": "TODO"}
        },
        "subway-stations": {
          "tunnel-yes": {"filter": "tunnel=yes", "name": "Tunnel", "description": "TODO"},
          "public-transport-stop-area": {
            "filter": "public_transport=stop_area",
            "name": "U-Bahn-Haltestellenbereich",
            "description": "TODO"
          },
          "public-transport-platform": {
            "filter": "public_transport=platform",
            "name": "Bahnsteig des öffentlichen Verkehrs",
            "description": "TODO"
          }
        },
        "supermarkets": {
          "brand": {"filter": "brand=*", "name": "Marke", "description": "TODO"},
          "opening-hours": {"filter": "opening_hours=*", "name": "Öffnungszeiten", "description": "TODO"}
        },
        "tram-stops": {
          "public-transport-stop-area": {
            "filter": "public_transport=stop_area",
            "name": "Straßenbahnhaltestellenbereich",
            "description": "TODO"
          },
          "public-transport-platform": {
            "filter": "public_transport=platform",
            "name": "Bahnsteig des öffentlichen Verkehrs",
            "description": "TODO"
          }
        },
        "clc-leaf-type": {
          "leaf-type": {
            "filter": "leaf_type in (broadleaved, needleleaved, mixed)",
            "name": "Blattart",
            "description": "TODO"
          }
        },
        "roads": {
          "name": {"filter": "name=* or ref=*", "name": "Straßenname", "description": "TODO"},
          "sidewalk": {
            "filter": "sidewalk=* or sidewalk:right=* or sidewalk:left=* or sidewalk:both=*",
            "name": "Gehweg",
            "description": "TODO"
          },
          "crossing": {"filter": "crossing=*", "name": "Fußgängerüberweg", "description": "TODO"},
          "cycleway": {
            "filter": "cycleway=* or cycleway:both=* or cycleway:right=* or cycleway:left=*",
            "name": "Radweg",
            "description": "TODO"
          },
          "cycleway-share-busway": {
            "filter": "cycleway=share_busway or cycleway:both=share_busway or cycleway:left=share_busway or cycleway:right=share_busway",
            "name": "Radweg gemeinsam mit Busspur",
            "description": "TODO"
          },
          "parking": {
            "filter": "parking:left=* or parking:right=* or parking:both=* or parking=*",
            "name": "Parkplatz",
            "description": "TODO"
          },
          "maxspeed": {"filter": "maxspeed=*", "name": "Höchstgeschwindigkeit", "description": "TODO"},
          "oneway": {"filter": "oneway=*", "name": "Einbahnstraße", "description": "TODO"},
          "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
          "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"}
        },
        "roads-all-highways": {
          "name": {"filter": "name=*", "name": "Straßenname", "description": "TODO"},
          "sidewalk": {
            "filter": "sidewalk=* or sidewalk:right=* or sidewalk:left=* or sidewalk:both=*",
            "name": "Gehweg",
            "description": "TODO"
          },
          "lanes": {"filter": "lanes=*", "name": "Fahrspuren", "description": "TODO"},
          "parking": {
            "filter": "parking:left=* or parking:right=* or parking:both=* or parking=*",
            "name": "Parkplatz",
            "description": "TODO"
          },
          "maxspeed": {"filter": "maxspeed=*", "name": "Höchstgeschwindigkeit", "description": "TODO"},
          "oneway": {"filter": "oneway=*", "name": "Einbahnstraße", "description": "TODO"},
          "surface": {"filter": "surface=*", "name": "Oberfläche", "description": "TODO"},
          "lit": {"filter": "lit=*", "name": "Beleuchtet", "description": "TODO"}
        },
        "public-transport-stops": {
          "shelter": {"filter": "shelter=*", "name": "Unterstand", "description": "TODO"},
          "bench": {"filter": "bench=*", "name": "Sitzbank", "description": "TODO"},
          "trash-bin": {"filter": "bin=*", "name": "Mülleimer", "description": "TODO"},
          "tactile-paving": {"filter": "tactile_paving=*", "name": "Taktiles Pflaster", "description": "TODO"},
          "wheelchair-accessibility": {"filter": "wheelchair=*", "name": "Rollstuhlgerecht", "description": "TODO"},
          "bus-lines": {
            "filter": "route_ref=*",
            "name": "Buslinien",
            "description": "Liste aller Buslinien, die an einer bestimmten Haltestelle halten."
          },
          "departures-board": {"filter": "departures_board=*", "name": "Abfahrtstafel", "description": "TODO"}
        },
        "power_lines": {
          "voltage": {
            "filter": "voltage=*",
            "name": "Spannung",
            "description": "Beschreibt die Spannung von Stromleitungen."
          },
          "cable": {
            "filter": "cable=*",
            "name": "Kabel",
            "description": "Anzahl elektrisch getrennter, einzelner oder gebündelter stromführender Leiter in einer Stromleitung oder einem Kabel."
          },
          "frequency": {
            "filter": "frequency=*",
            "name": "Frequenz",
            "description": "Beschreibt die Frequenz der Energieinfrastruktur in der Einheit Hertz."
          },
          "operator": {
            "filter": "operator=*",
            "name": "Betreiber",
            "description": "Unternehmen, Organisation, Person oder andere Einheit, die direkt für den aktuellen Betrieb eines Kartenelements verantwortlich ist."
          }
        },
        "power_substation": {
          "voltage": {
            "filter": "voltage=*",
            "name": "Spannung",
            "description": "Zur Beschreibung der Spannung von Umspannwerken."
          },
          "operator": {
            "filter": "operator=*",
            "name": "Betreiber",
            "description": "Unternehmen, Organisation, Person oder andere Einheit, die direkt für den aktuellen Betrieb eines Kartenelements verantwortlich ist."
          },
          "location": {
            "filter": "location=*",
            "name": "Standort",
            "description": "Zur Definition der Position eines Objekts, das sich über oder unter der Erde oder in Bezug auf andere Objekte wie Dächer, Brücken oder Gebäude befinden kann."
          }
        }
      }
    }
  }
;
