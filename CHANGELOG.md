# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Patch 0.1.13
### Added: 
* BaseModel class

### Updated:
* `findAllPaginated` can calculate offset by page

# Patch 0.1.12
### Added:
* Method for calculating offset for page pagination `calculateOffset`

### Changed:
* Updated `findAllPaginated` parameters

### Removed:
* Autogenerating id is removed

# Patch 0.1.11
### Updated:
* New [**README.md**](README.md) file

# Patch 0.1.10
### Added:
* New method for find with pagination `findAllPaginated`

### Changed:
* Now default auto generated id is type of UUIDv4 instead of v7, what helped to reduce package size

# Patch 0.1.9
### Fixed:
* `deletedAt` property is null on force delete

# Patch 0.1.8
### Fixed:
* `insertMany` skipped generating ids for the records

# Patch 0.1.7
### Added:
* `insertMany` method for creating multiple instances
* `insert` alias for `create` method

# Patch 0.1.6
### Change:
* **Reduced package size in 11 times**

# Patch 0.1.5
### Fixed:
* Force delete was not actually force

# Patch 0.1.4
### Added:
* idGenerator config option. See [README.md](README.md/#️-options)

### Fixed:
* Added types for protected fields, so they can be reused in derived classes

## Patch 0.1.3
### Changed:
* More strict typing for `idField`
* Updated `findOne` & `findAll` parameters types
* Provided jsdoc

## Patch 0.1.2
### Fixed:
* Fixed some typings

## Update 0.1.0
### Changed:
* Updated repository configuration to be more convenient
* Changed API to make it more wide on options
* Rename some methods to be more understandable what it does

### Added:
* Added support of catching errors
* New `restoreByPk` method for restoring soft-deleted rows

## Patch 0.0.3
### Fixed:
* Create method did not catch errors
* Returned whole error stack to response

## Patch 0.0.2
### Added
* Added error to prevent abstract class instantiation

## Version 0.0.1
**Full changelog till v0.0.1 is [here](https://github.com/stbestichhh/nest-sequelize-repository/pull/1)**
