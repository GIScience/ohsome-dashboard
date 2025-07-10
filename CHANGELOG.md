Changelog
=========

## current

## 1.7.0

* feat: Add version information to the footer (frontend and backends) #48
* fix: close icon on maintenance banner not showing #64
* fix: use turf to reproject and truncate boundary coordinates
* feat: show name of clc in indicator result panel
* feat: add a button to remove all selected areas

## 1.6.0

* fix: use EPSG:3857 for GetFeatureInfo Requests
* feat: render oqapi indicator description as HTML #17b5393
* feat: render oqapi result description as HTML #6733a66
* feat: add land cover class select field for thematic accuracy land cover indicator #65 

[#65]: https://github.com/GIScience/ohsome-dashboard/issues/65

## v1.5.5
* upgrade dependencies

## v1.5.4
* fix: selected area name labels below map are not properly updated when areas are unselected in the map
* fix: geojson boundary input with thin geometries #63

[#63]: https://github.com/GIScience/ohsome-dashboard/issues/63

## v1.5.3
* feat: make copyright date in footer dynamic
* feat: add WMS URL and Layer as configurable variable
* fix: use display_name instead of name as textual identifier for features (new osm_boundaries table)

## v1.5.2
* fix: auto-zoombox accidentally extended user defined bbox geometry

## v1.5.1
* feat: add automatic zoom to features for bbox, circle and free polygon selections like for boundaries ([#61])

[#61]: https://github.com/GIScience/ohsome-dashboard/issues/61

## v1.5.0
* build: add deployment scripts for TEST and PROD deployment ([#54]) 
* feat: (oqapi, attribute-completeness): Allow definition of custom attributes ([#50])
* upgrade to Semantic-UI 2.5.0
* compatible with api.quality.ohsome.org (OQAPI) >= v1.8.0

[#54]: https://github.com/GIScience/ohsome-dashboard/issues/54
[#50]: https://github.com/GIScience/ohsome-dashboard/issues/50

## v1.4.0
* feat: (oqapi, attribute-completeness): Allow selection of multiple attributes ([#47])
* updated to angular v18
* compatible with api.quality.ohsome.org (OQAPI) >= v1.7.0

[#47]: https://github.com/GIScience/ohsome-dashboard/issues/47

## v1.3.1
* fix: accidentially deleted too much code during cleanup at commit b755d545

## v1.3.0 
* support parameterization of the attribute completeness indicator via simple (topic-dependent) dropdown box

## v1.2.0
* Choose query start date automatically based on end date and period ([PR #33])
* Display message panel for announcements in a more prominent color ([PR #41])

[PR #33]:https://github.com/GIScience/ohsome-dashboard/pull/33
[PR #41]:https://github.com/GIScience/ohsome-dashboard/pull/41

## v1.1.5
* fix: backend-errors-not-displayed [#37]
* test: exclude mock data files from code duplication analysis on sonarcloud

[#37]: https://github.com/GIScience/ohsome-dashboard/issues/37

## v1.1.4
* fix: show-banner-on-dashboard-startup-when-ohsome-api-is-down [#12]
* test: exclude *.spec.ts files from sonarcloud coverage reports
* updated to angular v17

[#12]: https://github.com/GIScience/ohsome-dashboard/issues/12

## v1.1.3
* fix: building comparison data coverage shows too much area as covered (e.g. Bremen) [#29]

[#29]:https://github.com/GIScience/ohsome-dashboard/issues/29

## v1.1.2
* fix: indicator result not showing results on completion [3809ead]

[3809ead]:https://github.com/GIScience/ohsome-dashboard/commit/3809ead9c1b0cb58be631585ac53a91ae8ea21da

## v1.1.1
* fix: requesting to many aois shifts page [#16] 
* fix: share link of the result is changed when selecting new properties in query form [PR #24]

[#16]: https://github.com/GIScience/ohsome-dashboard/issues/16
[PR #24]: https://github.com/GIScience/ohsome-dashboard/pull/24 

## v1.1.0
* feat(oqapi): prepare possibility to show coverage polygon for topic-indicator combination [PR #21]
* fix(dependencies): update angular to v16.2.5

[PR #21]: https://github.com/GIScience/ohsome-dashboard/pull/21

## v1.0.1
* change quality analysis domain

## v0.2.3
* feat: add dynamic announcement banner with content from statuspage [#10]
* feat: display user info in case oqt service is unavailable [!8]

[!8]: https://github.com/GIScience/ohsome-dashboard/pull/8
[#10]: https://github.com/GIScience/ohsome-dashboard/issues/10

## v0.2.2
* fix: accept empty parameters from permalink hash [#3]
* feat: add link to github repo [#1]
* chore: upgrade to angular 16 and other dependency upgrades

[#1]: https://github.com/GIScience/ohsome-dashboard/issues/1
[#3]: https://github.com/GIScience/ohsome-dashboard/issues/3

## v0.2.1
* release: license adjustment from AGPL to GPL [46e3ff3]

[46e3ff3]: https://github.com/GIScience/ohsome-dashboard/commit/46e3ff31a9be0c22d8b3a54553da0474988c9c8e

## v0.2.0
* feat: a lot of little css and layout changes
* release: add LICENCE file for AGPL-3.0
* feat: make blue admin labels clickable to deselct features
* feat: make permalinks work with admin boundaries
* refactor: major restucturing of classes and modules
* feat: improve responsiveness for small mobile devices
* feat: display new boundary layer with more admin levels (2-8)
* feat: add prism.js syntax highlighting rules for `ohsome filter` language
* feat: integration of OQT (the ohsome quality analyst) in a new query panel and special oqt indicator results

## v0.1.12
* refactor: pull out ohsome-API Form into seperate sub-component
* refactor: remove outdated ShareResult from code
* chore: upgraded angular from v7 to v15 and all related project libraries

## v0.1.11
* refactor: integrate ohsome-dashboard-ng library to reduce dependencies
* build: switch from `yarn` to `npm` package manager
* build: remove outdated external dependency ng2-scroll-to-el and replace with angular-native solution
* build: upgraded to angular@7

## v0.1.10
* Implement share links for query results, except for admin boundaries 
* Display "empty result" message if (groupBy/tag) result is empty
* Don't show `*=*` in result when using an empty filter

## v0.1.9
* remove deprecated ohsome API params `keys` and `values` from simple filter dialog

## v0.1.8
* fix naming in time interval component

## v0.1.7
* improve responive design for small devices for charts and results table esp. for groupBy results

## v0.1.6
* Resolved: result tables not displayed correct when list of group by values is long

## 0.1.5
* integrate [OSHDB filter](https://github.com/GIScience/oshdb/tree/master/oshdb-filter) functionality

## 0.1.4
* remove-external-fonts-to-avoid-data-protection-issues

## 0.1.3

* fix failing download of results
* change contact information

## 0.1.2

* remove survey note

## 0.1.1

* add survey note
* update header and footer data
* tidy up code

## 0.1.0

* first release of dashboard with an ohsome API 0.9.7 compatible version
