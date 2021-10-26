# Changelog

## [v5.0.0.pre7](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre7) (2021-10-26)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre6...v5.0.0.pre7)

**Merged pull requests:**

- Add custom header to fetch [\#159](https://github.com/stimulusreflex/cable_ready/pull/159) ([julianrubisch](https://github.com/julianrubisch))

## [v5.0.0.pre6](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre6) (2021-10-14)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre5...v5.0.0.pre6)

**Merged pull requests:**

- Re-export consumer [\#158](https://github.com/stimulusreflex/cable_ready/pull/158) ([julianrubisch](https://github.com/julianrubisch))
- Consolidate elements into a base class [\#157](https://github.com/stimulusreflex/cable_ready/pull/157) ([julianrubisch](https://github.com/julianrubisch))

## [v5.0.0.pre5](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre5) (2021-10-07)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre4...v5.0.0.pre5)

**Implemented enhancements:**

- error handling for updates\_for edge cases [\#155](https://github.com/stimulusreflex/cable_ready/pull/155) ([leastbad](https://github.com/leastbad))
- post-pre4 updates [\#154](https://github.com/stimulusreflex/cable_ready/pull/154) ([leastbad](https://github.com/leastbad))

**Fixed bugs:**

- Given multiple updates\_for blocks with custom urls, only the first is re-fetched [\#153](https://github.com/stimulusreflex/cable_ready/issues/153)

**Merged pull requests:**

- Export elements [\#156](https://github.com/stimulusreflex/cable_ready/pull/156) ([julianrubisch](https://github.com/julianrubisch))

## [v5.0.0.pre4](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre4) (2021-10-01)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre3...v5.0.0.pre4)

**Implemented enhancements:**

- Receive morph updates from model/PORO callbacks [\#145](https://github.com/stimulusreflex/cable_ready/pull/145) ([leastbad](https://github.com/leastbad))

**Closed issues:**

- Uncaught TypeError: operations.forEach is not a function [\#149](https://github.com/stimulusreflex/cable_ready/issues/149)

**Merged pull requests:**

- Optionally debounce updates [\#151](https://github.com/stimulusreflex/cable_ready/pull/151) ([julianrubisch](https://github.com/julianrubisch))
- Fix updates for lazy loading [\#150](https://github.com/stimulusreflex/cable_ready/pull/150) ([julianrubisch](https://github.com/julianrubisch))
- Bump nokogiri from 1.12.3 to 1.12.5 [\#148](https://github.com/stimulusreflex/cable_ready/pull/148) ([dependabot[bot]](https://github.com/apps/dependabot))
- \[Readme\] Make badges link to RubyGems and npm packages [\#147](https://github.com/stimulusreflex/cable_ready/pull/147) ([palkan](https://github.com/palkan))
- Fix wrong CableReady import [\#146](https://github.com/stimulusreflex/cable_ready/pull/146) ([n-rodriguez](https://github.com/n-rodriguez))

## [v5.0.0.pre3](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre3) (2021-08-22)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre2...v5.0.0.pre3)

**Implemented enhancements:**

- redirect\_to operation [\#144](https://github.com/stimulusreflex/cable_ready/pull/144) ([leastbad](https://github.com/leastbad))
- RFC simplifed JSON payload + named batches [\#142](https://github.com/stimulusreflex/cable_ready/pull/142) ([leastbad](https://github.com/leastbad))

**Merged pull requests:**

- Bump path-parse from 1.0.6 to 1.0.7 [\#143](https://github.com/stimulusreflex/cable_ready/pull/143) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v5.0.0.pre2](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre2) (2021-07-21)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre1...v5.0.0.pre2)

**Implemented enhancements:**

- register a CableReady JSON MIME type [\#140](https://github.com/stimulusreflex/cable_ready/pull/140) ([existentialmutt](https://github.com/existentialmutt))
- Smart options \(they grow up so fast\) [\#136](https://github.com/stimulusreflex/cable_ready/pull/136) ([leastbad](https://github.com/leastbad))
- Support `to_dom_selector` for operation selectors [\#135](https://github.com/stimulusreflex/cable_ready/pull/135) ([jaredcwhite](https://github.com/jaredcwhite))
- dom\_id should always be lowercase [\#129](https://github.com/stimulusreflex/cable_ready/pull/129) ([leastbad](https://github.com/leastbad))

**Fixed bugs:**

- Improve install experience [\#128](https://github.com/stimulusreflex/cable_ready/pull/128) ([leastbad](https://github.com/leastbad))

**Closed issues:**

- Idea: ability to pass any object which responds to `to_dom_selector` as a selector  [\#134](https://github.com/stimulusreflex/cable_ready/issues/134)

**Merged pull requests:**

- Bump addressable from 2.7.0 to 2.8.0 [\#141](https://github.com/stimulusreflex/cable_ready/pull/141) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore: make webpack happy with no sideEffects [\#138](https://github.com/stimulusreflex/cable_ready/pull/138) ([ParamagicDev](https://github.com/ParamagicDev))

## [v5.0.0.pre1](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre1) (2021-06-02)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v5.0.0.pre0...v5.0.0.pre1)

**Merged pull requests:**

- Include app folder in release [\#133](https://github.com/stimulusreflex/cable_ready/pull/133) ([julianrubisch](https://github.com/julianrubisch))

## [v5.0.0.pre0](https://github.com/stimulusreflex/cable_ready/tree/v5.0.0.pre0) (2021-05-20)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.5.0...v5.0.0.pre0)

**Implemented enhancements:**

- console\_table operation [\#125](https://github.com/stimulusreflex/cable_ready/pull/125) ([leastbad](https://github.com/leastbad))
- Introduce `OperationStore` to add operations on-the-fly [\#124](https://github.com/stimulusreflex/cable_ready/pull/124) ([marcoroth](https://github.com/marcoroth))
- cable\_car aka 'Ajax mode' [\#108](https://github.com/stimulusreflex/cable_ready/pull/108) ([leastbad](https://github.com/leastbad))
- chainable selectors [\#107](https://github.com/stimulusreflex/cable_ready/pull/107) ([leastbad](https://github.com/leastbad))

**Closed issues:**

- Warning in Ruby 3.0 [\#113](https://github.com/stimulusreflex/cable_ready/issues/113)
- play\_sound operation hijacks sound controls [\#111](https://github.com/stimulusreflex/cable_ready/issues/111)
- Provide a CableReady channel generator [\#94](https://github.com/stimulusreflex/cable_ready/issues/94)
- Jest Error [\#85](https://github.com/stimulusreflex/cable_ready/issues/85)
- Event Dispatch: help with serialization [\#59](https://github.com/stimulusreflex/cable_ready/issues/59)

**Merged pull requests:**

- Remove warning message for already registered custom element [\#126](https://github.com/stimulusreflex/cable_ready/pull/126) ([marcoroth](https://github.com/marcoroth))
- Bump lodash from 4.17.20 to 4.17.21 [\#123](https://github.com/stimulusreflex/cable_ready/pull/123) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump handlebars from 4.7.6 to 4.7.7 [\#122](https://github.com/stimulusreflex/cable_ready/pull/122) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump actionpack from 6.1.3.1 to 6.1.3.2 [\#121](https://github.com/stimulusreflex/cable_ready/pull/121) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump rexml from 3.2.4 to 3.2.5 [\#120](https://github.com/stimulusreflex/cable_ready/pull/120) ([dependabot[bot]](https://github.com/apps/dependabot))
- broadcast\_later [\#119](https://github.com/stimulusreflex/cable_ready/pull/119) ([julianrubisch](https://github.com/julianrubisch))
- set\_meta operation [\#117](https://github.com/stimulusreflex/cable_ready/pull/117) ([leastbad](https://github.com/leastbad))
- Setup better finalizer [\#116](https://github.com/stimulusreflex/cable_ready/pull/116) ([hopsoft](https://github.com/hopsoft))
- Bump activerecord from 6.1.1 to 6.1.3 [\#115](https://github.com/stimulusreflex/cable_ready/pull/115) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump actionpack from 6.1.1 to 6.1.3 [\#114](https://github.com/stimulusreflex/cable_ready/pull/114) ([dependabot[bot]](https://github.com/apps/dependabot))
- sound opt-in [\#112](https://github.com/stimulusreflex/cable_ready/pull/112) ([leastbad](https://github.com/leastbad))
- before -\> operate -\> after [\#110](https://github.com/stimulusreflex/cable_ready/pull/110) ([leastbad](https://github.com/leastbad))
- restructure client [\#109](https://github.com/stimulusreflex/cable_ready/pull/109) ([leastbad](https://github.com/leastbad))
- undefined no more [\#106](https://github.com/stimulusreflex/cable_ready/pull/106) ([leastbad](https://github.com/leastbad))
- sanity check + initializer generator [\#105](https://github.com/stimulusreflex/cable_ready/pull/105) ([leastbad](https://github.com/leastbad))
- stream\_from [\#104](https://github.com/stimulusreflex/cable_ready/pull/104) ([leastbad](https://github.com/leastbad))
- Channel generator [\#95](https://github.com/stimulusreflex/cable_ready/pull/95) ([julianrubisch](https://github.com/julianrubisch))

## [v4.5.0](https://github.com/stimulusreflex/cable_ready/tree/v4.5.0) (2021-01-26)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.6...v4.5.0)

**Implemented enhancements:**

- graft operation [\#103](https://github.com/stimulusreflex/cable_ready/pull/103) ([leastbad](https://github.com/leastbad))
- scroll\_into\_view operation [\#102](https://github.com/stimulusreflex/cable_ready/pull/102) ([leastbad](https://github.com/leastbad))
- replace\_state and go operations [\#101](https://github.com/stimulusreflex/cable_ready/pull/101) ([leastbad](https://github.com/leastbad))
- play\_sound operation [\#98](https://github.com/stimulusreflex/cable_ready/pull/98) ([leastbad](https://github.com/leastbad))

**Merged pull requests:**

- Bump nokogiri from 1.10.10 to 1.11.1 [\#97](https://github.com/stimulusreflex/cable_ready/pull/97) ([dependabot[bot]](https://github.com/apps/dependabot))
- Global config, simplify threading, custom operations [\#96](https://github.com/stimulusreflex/cable_ready/pull/96) ([hopsoft](https://github.com/hopsoft))
- multiple selector element operations [\#92](https://github.com/stimulusreflex/cable_ready/pull/92) ([leastbad](https://github.com/leastbad))
- Add `append`, `prepend` and `replace` operations [\#90](https://github.com/stimulusreflex/cable_ready/pull/90) ([marcoroth](https://github.com/marcoroth))
- rework custom operations [\#88](https://github.com/stimulusreflex/cable_ready/pull/88) ([leastbad](https://github.com/leastbad))

## [v4.4.6](https://github.com/stimulusreflex/cable_ready/tree/v4.4.6) (2020-12-18)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.5...v4.4.6)

**Merged pull requests:**

- pluggable before/after morph callbacks [\#87](https://github.com/stimulusreflex/cable_ready/pull/87) ([leastbad](https://github.com/leastbad))
- Add more detail to the CableReady error message [\#84](https://github.com/stimulusreflex/cable_ready/pull/84) ([marcoroth](https://github.com/marcoroth))

## [v4.4.5](https://github.com/stimulusreflex/cable_ready/tree/v4.4.5) (2020-12-13)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.4...v4.4.5)

**Merged pull requests:**

- changed storage method names, added clear flag [\#86](https://github.com/stimulusreflex/cable_ready/pull/86) ([leastbad](https://github.com/leastbad))

## [v4.4.4](https://github.com/stimulusreflex/cable_ready/tree/v4.4.4) (2020-12-11)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.3...v4.4.4)

**Merged pull requests:**

- Add support for sessionStorage and localStorage [\#83](https://github.com/stimulusreflex/cable_ready/pull/83) ([hopsoft](https://github.com/hopsoft))

## [v4.4.3](https://github.com/stimulusreflex/cable_ready/tree/v4.4.3) (2020-12-01)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.2...v4.4.3)

**Merged pull requests:**

- Fix bug related to channel calling broadcast on the singleton [\#82](https://github.com/stimulusreflex/cable_ready/pull/82) ([hopsoft](https://github.com/hopsoft))

## [v4.4.2](https://github.com/stimulusreflex/cable_ready/tree/v4.4.2) (2020-11-30)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.1...v4.4.2)

## [v4.4.1](https://github.com/stimulusreflex/cable_ready/tree/v4.4.1) (2020-11-28)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0...v4.4.1)

**Merged pull requests:**

- Apply setFocus behavior to more element mutations [\#81](https://github.com/stimulusreflex/cable_ready/pull/81) ([hopsoft](https://github.com/hopsoft))

## [v4.4.0](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0) (2020-11-24)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0.pre4...v4.4.0)

## [v4.4.0.pre4](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0.pre4) (2020-11-22)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0.pre3...v4.4.0.pre4)

**Fixed bugs:**

- only compare isEqualNode for non-inputs [\#80](https://github.com/stimulusreflex/cable_ready/pull/80) ([leastbad](https://github.com/leastbad))

## [v4.4.0.pre3](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0.pre3) (2020-11-13)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0.pre2...v4.4.0.pre3)

**Closed issues:**

- CableReady detected an error in insertAdjacentHtml. Object doesn't support this action - IE11 only [\#76](https://github.com/stimulusreflex/cable_ready/issues/76)
- shouldMorph doesn't work well with some form elements [\#70](https://github.com/stimulusreflex/cable_ready/issues/70)
- Operations go missing before broadcasting [\#64](https://github.com/stimulusreflex/cable_ready/issues/64)

**Merged pull requests:**

- Move package.json to root and prepare for v4.4.0.pre3 [\#79](https://github.com/stimulusreflex/cable_ready/pull/79) ([hopsoft](https://github.com/hopsoft))
- method chaining [\#78](https://github.com/stimulusreflex/cable_ready/pull/78) ([leastbad](https://github.com/leastbad))
- jquery support [\#75](https://github.com/stimulusreflex/cable_ready/pull/75) ([leastbad](https://github.com/leastbad))
- Removed isEqualNode comparison [\#71](https://github.com/stimulusreflex/cable_ready/pull/71) ([adank92](https://github.com/adank92))

## [v4.4.0.pre2](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0.pre2) (2020-11-02)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0.pre1...v4.4.0.pre2)

**Merged pull requests:**

- use CustomEvent to get IE11 working [\#74](https://github.com/stimulusreflex/cable_ready/pull/74) ([existentialmutt](https://github.com/existentialmutt))

## [v4.4.0.pre1](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0.pre1) (2020-09-25)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.4.0.pre0...v4.4.0.pre1)

**Merged pull requests:**

- Add support for pushState [\#73](https://github.com/stimulusreflex/cable_ready/pull/73) ([hopsoft](https://github.com/hopsoft))
- Bump actionview from 6.0.3.2 to 6.0.3.3 [\#72](https://github.com/stimulusreflex/cable_ready/pull/72) ([dependabot[bot]](https://github.com/apps/dependabot))
- set\_focus operation [\#69](https://github.com/stimulusreflex/cable_ready/pull/69) ([leastbad](https://github.com/leastbad))

## [v4.4.0.pre0](https://github.com/stimulusreflex/cable_ready/tree/v4.4.0.pre0) (2020-09-02)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.3.0...v4.4.0.pre0)

**Implemented enhancements:**

- Add a shared mutex to avoid concurrency issues in Channels [\#65](https://github.com/stimulusreflex/cable_ready/pull/65) ([barrywoolgar](https://github.com/barrywoolgar))

**Closed issues:**

- Using morph with a document fragment appears to do a full replace instead of a morph [\#67](https://github.com/stimulusreflex/cable_ready/issues/67)
- documentation: Mention cable.yml adapter configuration [\#66](https://github.com/stimulusreflex/cable_ready/issues/66)

**Merged pull requests:**

- Provide an async perform method [\#63](https://github.com/stimulusreflex/cable_ready/pull/63) ([julianrubisch](https://github.com/julianrubisch))
- Add braces to hash parameter to remove warning [\#61](https://github.com/stimulusreflex/cable_ready/pull/61) ([dabit](https://github.com/dabit))
- only pass inner html if childrenOnly is false [\#58](https://github.com/stimulusreflex/cable_ready/pull/58) ([joshleblanc](https://github.com/joshleblanc))

## [v4.3.0](https://github.com/stimulusreflex/cable_ready/tree/v4.3.0) (2020-07-02)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.3.0.pre2...v4.3.0)

## [v4.3.0.pre2](https://github.com/stimulusreflex/cable_ready/tree/v4.3.0.pre2) (2020-06-27)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.3.0-pre1...v4.3.0.pre2)

**Implemented enhancements:**

- Notifications [\#55](https://github.com/stimulusreflex/cable_ready/pull/55) ([leastbad](https://github.com/leastbad))

**Closed issues:**

- current\_user concerns? [\#54](https://github.com/stimulusreflex/cable_ready/issues/54)
- Update documentation  [\#52](https://github.com/stimulusreflex/cable_ready/issues/52)

**Merged pull requests:**

- Bump rack from 2.2.2 to 2.2.3 [\#57](https://github.com/stimulusreflex/cable_ready/pull/57) ([dependabot[bot]](https://github.com/apps/dependabot))
- Bump actionpack from 6.0.3.1 to 6.0.3.2 [\#56](https://github.com/stimulusreflex/cable_ready/pull/56) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v4.3.0-pre1](https://github.com/stimulusreflex/cable_ready/tree/v4.3.0-pre1) (2020-06-15)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.3.0.pre1...v4.3.0-pre1)

## [v4.3.0.pre1](https://github.com/stimulusreflex/cable_ready/tree/v4.3.0.pre1) (2020-06-15)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.3.0.pre0...v4.3.0.pre1)

**Merged pull requests:**

- text\_content is missing from 4.3.0.pre0 [\#53](https://github.com/stimulusreflex/cable_ready/pull/53) ([leastbad](https://github.com/leastbad))

## [v4.3.0.pre0](https://github.com/stimulusreflex/cable_ready/tree/v4.3.0.pre0) (2020-06-13)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.2.0...v4.3.0.pre0)

**Implemented enhancements:**

- Make DOMOperations extendable [\#44](https://github.com/stimulusreflex/cable_ready/pull/44) ([n-rodriguez](https://github.com/n-rodriguez))
- broadcast\_to method [\#38](https://github.com/stimulusreflex/cable_ready/pull/38) ([leastbad](https://github.com/leastbad))

**Closed issues:**

- Make JS DOMOperations extendable [\#43](https://github.com/stimulusreflex/cable_ready/issues/43)

**Merged pull requests:**

- Dom id signature fix [\#51](https://github.com/stimulusreflex/cable_ready/pull/51) ([leastbad](https://github.com/leastbad))
- add dom\_id helper [\#50](https://github.com/stimulusreflex/cable_ready/pull/50) ([leastbad](https://github.com/leastbad))
- Support for multiple CSS classes. [\#49](https://github.com/stimulusreflex/cable_ready/pull/49) ([sarriagada](https://github.com/sarriagada))
- Make morph emit after event [\#48](https://github.com/stimulusreflex/cable_ready/pull/48) ([julianrubisch](https://github.com/julianrubisch))
- Customize operations via initializer [\#47](https://github.com/stimulusreflex/cable_ready/pull/47) ([leastbad](https://github.com/leastbad))
- Correct method 'outerHtml' to 'outer\_html' in documentation [\#39](https://github.com/stimulusreflex/cable_ready/pull/39) ([pskarlas](https://github.com/pskarlas))
- Add setStyles [\#37](https://github.com/stimulusreflex/cable_ready/pull/37) ([excid3](https://github.com/excid3))
- Fix typo in method name outerHTML -\> outer\_html [\#35](https://github.com/stimulusreflex/cable_ready/pull/35) ([back2war](https://github.com/back2war))

## [v4.2.0](https://github.com/stimulusreflex/cable_ready/tree/v4.2.0) (2020-06-02)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.1.2...v4.2.0)

**Closed issues:**

- Question: Would you consider this intended behaviour? [\#41](https://github.com/stimulusreflex/cable_ready/issues/41)

**Merged pull requests:**

- after-outer-html emitted from new element [\#46](https://github.com/stimulusreflex/cable_ready/pull/46) ([leastbad](https://github.com/leastbad))
- Fix `outer_html` notation [\#45](https://github.com/stimulusreflex/cable_ready/pull/45) ([julianrubisch](https://github.com/julianrubisch))
- Print out the selector for easier debugging perform errors [\#36](https://github.com/stimulusreflex/cable_ready/pull/36) ([excid3](https://github.com/excid3))
- add set\_property method to library [\#34](https://github.com/stimulusreflex/cable_ready/pull/34) ([leastbad](https://github.com/leastbad))

## [v4.1.2](https://github.com/stimulusreflex/cable_ready/tree/v4.1.2) (2020-04-27)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.1.1...v4.1.2)

**Fixed bugs:**

- Ensure the active text input retains its value and focus after DOM mutations [\#33](https://github.com/stimulusreflex/cable_ready/pull/33) ([hopsoft](https://github.com/hopsoft))

## [v4.1.1](https://github.com/stimulusreflex/cable_ready/tree/v4.1.1) (2020-04-20)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.1.0...v4.1.1)

**Implemented enhancements:**

- add set\_style method to library [\#32](https://github.com/stimulusreflex/cable_ready/pull/32) ([leastbad](https://github.com/leastbad))

**Merged pull requests:**

-  Add funding file [\#31](https://github.com/stimulusreflex/cable_ready/pull/31) ([andrewmcodes](https://github.com/andrewmcodes))
- update README and package.json [\#30](https://github.com/stimulusreflex/cable_ready/pull/30) ([andrewmcodes](https://github.com/andrewmcodes))

## [v4.1.0](https://github.com/stimulusreflex/cable_ready/tree/v4.1.0) (2020-04-05)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.9...v4.1.0)

**Merged pull requests:**

- Bump acorn from 7.1.0 to 7.1.1 in /javascript [\#29](https://github.com/stimulusreflex/cable_ready/pull/29) ([dependabot[bot]](https://github.com/apps/dependabot))
- Set cookie support [\#28](https://github.com/stimulusreflex/cable_ready/pull/28) ([hopsoft](https://github.com/hopsoft))
- README.md: Fix typo [\#27](https://github.com/stimulusreflex/cable_ready/pull/27) ([henrik](https://github.com/henrik))
- Update event-dispatch.md [\#25](https://github.com/stimulusreflex/cable_ready/pull/25) ([leastbad](https://github.com/leastbad))
- Fix typo on Remove Css Class methods [\#24](https://github.com/stimulusreflex/cable_ready/pull/24) ([dark88888](https://github.com/dark88888))

## [v4.0.9](https://github.com/stimulusreflex/cable_ready/tree/v4.0.9) (2020-01-27)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.8...v4.0.9)

**Merged pull requests:**

- Add support to ignore missing DOM elements via options parameter [\#23](https://github.com/stimulusreflex/cable_ready/pull/23) ([leastbad](https://github.com/leastbad))
- fix sporadic error - undefined method \<\< for nil, when adding operation [\#21](https://github.com/stimulusreflex/cable_ready/pull/21) ([szTheory](https://github.com/szTheory))

## [v4.0.8](https://github.com/stimulusreflex/cable_ready/tree/v4.0.8) (2019-11-04)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.7...v4.0.8)

**Merged pull requests:**

- Simplify logic to make it more understandable [\#20](https://github.com/stimulusreflex/cable_ready/pull/20) ([hopsoft](https://github.com/hopsoft))

## [v4.0.7](https://github.com/stimulusreflex/cable_ready/tree/v4.0.7) (2019-10-05)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.6...v4.0.7)

**Merged pull requests:**

- Add gh actions [\#17](https://github.com/stimulusreflex/cable_ready/pull/17) ([andrewmcodes](https://github.com/andrewmcodes))
- Add Gitbook integration [\#16](https://github.com/stimulusreflex/cable_ready/pull/16) ([andrewmcodes](https://github.com/andrewmcodes))

## [v4.0.6](https://github.com/stimulusreflex/cable_ready/tree/v4.0.6) (2019-10-03)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.5...v4.0.6)

**Implemented enhancements:**

- Add support for redirect/visit [\#10](https://github.com/stimulusreflex/cable_ready/issues/10)

**Merged pull requests:**

- Update to format with prettier-standard [\#15](https://github.com/stimulusreflex/cable_ready/pull/15) ([hopsoft](https://github.com/hopsoft))
- Add support for permanent nodes [\#14](https://github.com/stimulusreflex/cable_ready/pull/14) ([andreaslillebo](https://github.com/andreaslillebo))

## [v4.0.5](https://github.com/stimulusreflex/cable_ready/tree/v4.0.5) (2019-09-20)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.4...v4.0.5)

**Merged pull requests:**

- Hopsoft/bubble [\#13](https://github.com/stimulusreflex/cable_ready/pull/13) ([hopsoft](https://github.com/hopsoft))

## [v4.0.4](https://github.com/stimulusreflex/cable_ready/tree/v4.0.4) (2019-09-19)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.3...v4.0.4)

**Merged pull requests:**

- Refactor how events are managed [\#12](https://github.com/stimulusreflex/cable_ready/pull/12) ([hopsoft](https://github.com/hopsoft))
- Added support for XPath selectors [\#11](https://github.com/stimulusreflex/cable_ready/pull/11) ([leastbad](https://github.com/leastbad))

## [v4.0.3](https://github.com/stimulusreflex/cable_ready/tree/v4.0.3) (2019-08-17)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.2...v4.0.3)

## [v4.0.2](https://github.com/stimulusreflex/cable_ready/tree/v4.0.2) (2019-08-10)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.1...v4.0.2)

## [v4.0.1](https://github.com/stimulusreflex/cable_ready/tree/v4.0.1) (2019-08-10)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v4.0.0...v4.0.1)

**Merged pull requests:**

- Merge JavaScript NPM package into this repo [\#9](https://github.com/stimulusreflex/cable_ready/pull/9) ([hopsoft](https://github.com/hopsoft))

## [v4.0.0](https://github.com/stimulusreflex/cable_ready/tree/v4.0.0) (2019-08-09)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v3.0.1...v4.0.0)

## [v3.0.1](https://github.com/stimulusreflex/cable_ready/tree/v3.0.1) (2019-05-13)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v3.0.0...v3.0.1)

## [v3.0.0](https://github.com/stimulusreflex/cable_ready/tree/v3.0.0) (2019-03-25)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.8...v3.0.0)

**Merged pull requests:**

- Use outerHTML instead of replace [\#8](https://github.com/stimulusreflex/cable_ready/pull/8) ([hopsoft](https://github.com/hopsoft))

## [v2.0.8](https://github.com/stimulusreflex/cable_ready/tree/v2.0.8) (2018-11-25)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.7...v2.0.8)

**Merged pull requests:**

- Dispatch before/after events for DOM activity [\#7](https://github.com/stimulusreflex/cable_ready/pull/7) ([hopsoft](https://github.com/hopsoft))

## [v2.0.7](https://github.com/stimulusreflex/cable_ready/tree/v2.0.7) (2018-10-26)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.6...v2.0.7)

## [v2.0.6](https://github.com/stimulusreflex/cable_ready/tree/v2.0.6) (2018-10-20)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.5...v2.0.6)

## [v2.0.5](https://github.com/stimulusreflex/cable_ready/tree/v2.0.5) (2018-10-08)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.4...v2.0.5)

**Merged pull requests:**

- Support morph option for childrenOnly [\#6](https://github.com/stimulusreflex/cable_ready/pull/6) ([hopsoft](https://github.com/hopsoft))

## [v2.0.4](https://github.com/stimulusreflex/cable_ready/tree/v2.0.4) (2017-11-09)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.3...v2.0.4)

## [v2.0.3](https://github.com/stimulusreflex/cable_ready/tree/v2.0.3) (2017-11-06)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.2...v2.0.3)

**Merged pull requests:**

- Compress HTML [\#5](https://github.com/stimulusreflex/cable_ready/pull/5) ([hopsoft](https://github.com/hopsoft))

## [v2.0.2](https://github.com/stimulusreflex/cable_ready/tree/v2.0.2) (2017-11-03)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.1...v2.0.2)

**Merged pull requests:**

- Make morph a first class operation [\#4](https://github.com/stimulusreflex/cable_ready/pull/4) ([hopsoft](https://github.com/hopsoft))

## [v2.0.1](https://github.com/stimulusreflex/cable_ready/tree/v2.0.1) (2017-10-15)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v2.0.0...v2.0.1)

## [v2.0.0](https://github.com/stimulusreflex/cable_ready/tree/v2.0.0) (2017-10-14)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v1.1.0...v2.0.0)

**Merged pull requests:**

- Improved programmatic interface [\#3](https://github.com/stimulusreflex/cable_ready/pull/3) ([hopsoft](https://github.com/hopsoft))

## [v1.1.0](https://github.com/stimulusreflex/cable_ready/tree/v1.1.0) (2017-09-24)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v1.0.0...v1.1.0)

**Closed issues:**

- FINISH IT!!! [\#1](https://github.com/stimulusreflex/cable_ready/issues/1)

**Merged pull requests:**

- Support more DOM operations/mutations [\#2](https://github.com/stimulusreflex/cable_ready/pull/2) ([hopsoft](https://github.com/hopsoft))

## [v1.0.0](https://github.com/stimulusreflex/cable_ready/tree/v1.0.0) (2017-09-20)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/v0.1.0...v1.0.0)

## [v0.1.0](https://github.com/stimulusreflex/cable_ready/tree/v0.1.0) (2017-05-19)

[Full Changelog](https://github.com/stimulusreflex/cable_ready/compare/e62800f06e2f436fc66de2b9840313ba1de349bc...v0.1.0)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
