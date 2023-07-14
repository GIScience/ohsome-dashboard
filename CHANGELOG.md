Changelog
=========

## current main
* feat: display user info in case oqt service is unavailable [!8]

[!8]: https://github.com/GIScience/ohsome-dashboard/pull/8

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
