# War Room Frontend Naming Conventions

This document outlines the official naming conventions for the `3.0-ui-war-room` frontend application. Adhering to these standards is critical for maintaining a clean, readable, and scalable codebase.

## Guiding Principle

Names should be descriptive, unambiguous, and based on the project's domain. The core concepts of the application are: `Campaign`, `Alert`, `Mention`, `Intelligence`, `Report`, `Monitoring`.

--- 

### 1. Components

- **Format:** `PascalCase`
- **Rule:** Component file names and the component itself should match exactly. Names should be descriptive and reflect their specific function.
- **Examples:**
  - `SocialMentionCard.tsx`
  - `CampaignPerformanceChart.tsx`
  - `CrisisAlertFeed.tsx`
  - `IntelligenceChatBar.tsx`

--- 

### 2. Hooks

- **Format:** `useCamelCase`
- **Rule:** All custom hooks must start with the `use` prefix.
- **Examples:**
  - `useCampaignData.ts`
  - `useAlertsStream.ts`
  - `useChatHistory.ts`

--- 

### 3. API Functions

- **Format:** `camelCase`
- **Rule:** Functions that interact with the backend API should be action-oriented, typically `verbNoun`.
- **Location:** These functions should live in dedicated files within `src/api/` (e.g., `src/api/monitoring.ts`).
- **Examples:**
  - `getCampaignInsights()`
  - `generatePdfReport()`
  - `acknowledgeCrisisAlert()`

--- 

### 4. Types and Interfaces

- **Format:** `PascalCase`
- **Rule:** Be as descriptive as possible. Avoid generic names like `Item` or `Data`.
- **Examples:**
  - `CampaignMetrics`
  - `SocialMention`
  - `Alert`
  - `User`

--- 

### 5. General Files

- **Rule:** All non-component files (utilities, services, etc.) should be `camelCase.ts`.
- **Examples:**
  - `apiClient.ts`
  - `dateUtils.ts`
