# GitHub Contributions Component

## Overview
Component that displays GitHub contribution activity using react-github-calendar library, similar to GitHub's contribution graph.

## Features
- **Contribution Calendar**: Visual heatmap of daily contributions
- **Statistics Cards**: Total contributions, current streak, longest streak, average per day
- **Real-time Data**: Fetches data from GitHub API
- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Matches portfolio's dark theme

## Technical Implementation
- **Library**: react-github-calendar
- **Data Source**: GitHub API (users/{username}/events)
- **State Management**: React hooks (useState, useEffect)
- **Styling**: Material-UI with custom theme integration

## Component Structure
1. **Header**: Title with calendar icon
2. **Stats Cards**: 4 metric cards showing contribution statistics
3. **Calendar**: GitHub-style contribution heatmap
4. **Footer**: Username display

## API Integration
- Fetches user events from GitHub API
- Processes PushEvent types to count contributions
- Calculates streaks and averages
- Handles loading and error states

## Customization Options
- Username: Configurable via component prop
- Color scheme: Dark theme by default
- Block size and margins: Customizable
- Labels: Customizable text

## Future Enhancements
- Contribution trends over time
- Language-specific contributions
- Repository-specific activity
- Export functionality
- Interactive tooltips 