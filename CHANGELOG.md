Changelog
=========

## current main

## v0.2.0
* feat: a lot of little css and layout changes
* release: add LICENCE file for AGPL-3.0 [7a66577]
* feat: make blue admin labels clickable to deselct features ([#41])
* feat: make permalinks work with admin boundaries ([#45])
* refactor: major restucturing of classes and modules
* feat: improve responsiveness for small mobile devices
* feat: display new boundary layer with more admin levels (2-8)
* feat: add prism.js syntax highlighting rules for `ohsome filter` language
* feat: integration of OQT (the ohsome quality analyst) in a new query panel and special oqt indicator results

[7a66577]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/commit/7a6657706254f3164bca59bf9b3e32c6e1a135b6
[#41]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/issues/41
[#45]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/issues/45

## v0.1.12
* refactor: pull out ohsome-API Form into seperate sub-component ([!24])
* refactor: remove outdated ShareResult from code ([!23])
* chore: upgraded angular from v7 to v15 and all related project libraries ([!22])

[!22]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/22
[!23]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/23
[!24]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/24

## v0.1.11
* refactor: integrate ohsome-dashboard-ng library to reduce dependencies ([#21])
* build: switch from `yarn` to `npm` package manager
* build: remove outdated external dependency ng2-scroll-to-el and replace with angular-native solution
* build: upgraded to angular@7

[#21]: https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/issues/21

## v0.1.10
* Implement share links for query results, except for admin boundaries 
* Display "empty result" message if (groupBy/tag) result is empty
* Don't show `*=*` in result when using an empty filter

## v0.1.9
* remove deprecated ohsome API params `keys` and `values` from simple filter dialog [!17](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/17)

## v0.1.8
* fix naming in time interval component

## v0.1.7
* improve responive design for small devices for charts and results table esp. for groupBy results

## v0.1.6
* Resolved [!16](result tables not displayed correct when list of group by values is long)

## 0.1.5
* integrate [OSHDB filter](https://github.com/GIScience/oshdb/tree/master/oshdb-filter) functionality. [!10](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/10)


## 0.1.4
* remove-external-fonts-to-avoid-data-protection-issues [!15](remove-external-fonts-to-avoid-data-protection-issues)


## 0.1.3

* fix failing download of results [!14](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/14)
* change contact information [!13](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/13)


## 0.1.2

* remove survey note. [!12](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/12)


## 0.1.1

* add survey note. [!11](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/11)
* update header and footer data. [!9](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/9)
* tidy up code. [!8](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/dashboard/-/merge_requests/8)


## 0.1.0

* first release of dashboard with an ohsome API 0.9.7 compatible version
