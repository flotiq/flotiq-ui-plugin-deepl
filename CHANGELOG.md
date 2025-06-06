# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.2.1]
### Added
* compatibility to newest Flotiq form API

### Fixed
* plugin settings not showing required error for fields 

## [0.2.0]
### Changed
* plugin will emit `flotiq-multilingual.translation::update` event to update translation through multilinual plugin #26441
* DeepL API is now called through dedicated proxy #26715

### Fixed
* plugin will no longer tranlsate default language values