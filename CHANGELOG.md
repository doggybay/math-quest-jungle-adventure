# Changelog

All notable changes to the Math Quest Jungle Adventure project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with React
- Basic game structure and components
- Game context for state management
- Level selection system
- Question generation system
- Score tracking system
- Attempt tracking system
- Visual feedback for correct/incorrect answers
- Integrated Tailwind CSS for utility-first styling across all components.
- Added CRACO to enable custom PostCSS/Tailwind config with Create React App.
- Added PNG mockup as an asset for potential use as a background image.

### Changed
- Reduced attempts per question from 3 to 2
- Improved answer feedback system to only show correct answer when player answers correctly
- Modified game flow to move to next question after 2 wrong attempts
- Added navigation to levels screen after 3 wrong questions
- Refactored all main components (Home, LevelSelect, GamePlay, RewardScreen) to use Tailwind CSS classes for a modern, playful look.
- Updated Home page to use PNG background image, then reverted to Tailwind gradient background for flexibility.

### Fixed
- Fixed issue with correct answer being revealed on wrong attempts
- Fixed question cycling behavior
- Improved state management for attempts and wrong questions tracking
- Fixed React Hook useEffect missing dependencies in RewardScreen
- Added default case to arithmetic question generator switch statement in GameContext
- Resolved Tailwind/PostCSS configuration issues for compatibility with Tailwind v4+ and CRA.

## [0.0.30] - 2025-05-14
### Added
- Initial release
- Basic game mechanics
- Level system
- Question system
- Score tracking
- Attempt tracking 