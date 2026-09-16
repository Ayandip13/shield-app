# App AI Agent Guidelines (`app/AGENTS.md`)

This document defines the permanent engineering instructions, architectural standards, and operational rules for any AI coding agent or developer working inside the `app/` directory.

---

## 1. App Architecture Rules

* **Framework & Tooling**: This is a React Native application built with Expo and TypeScript.
* **Navigation**: Use **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`) for application navigation.
* **Modularity**: Keep the application modular, organized, and easy to understand.
* **Simplicity**: Prefer simple, explicit solutions over unnecessary abstractions. Do not introduce complex architecture or state management patterns without a concrete requirement.
* **Single Navigation Source**: Do not create a second navigation system or duplicate navigation logic.
* **Screen Responsibilities**: Keep route and screen files focused strictly on screen composition and routing params. Move reusable visual elements into components.
* **Separation of Concerns**:
  * Keep API communication isolated within the API/service layer (`src/services/`).
  * Keep business logic and state management out of presentational components whenever practical.

---

## 2. Folder Organization

Maintain a clear separation between domain layers within `src/`:

```text
src/
├── components/   # Reusable UI components (buttons, cards, inputs, loaders)
├── constants/    # Application constants and configuration
├── hooks/        # Custom React hooks for shared stateful logic
├── navigation/   # Navigators, tab bars, route definitions, and types
├── screens/      # Screen components grouped by feature/role
├── services/     # API clients, HTTP wrappers, data fetching logic
├── theme/        # Centralized design tokens (colors, typography, spacing, shadows)
├── types/        # TypeScript interfaces, enums, and type definitions
├── utils/        # Pure utility functions and formatters
└── assets/       # Static images, icons, and fonts
```

* Follow the existing project structure when it provides a good pattern.
* Do not reorganize the directory structure unnecessarily.

---

## 3. UI/UX Rules

The product is a professional building-security management application.

### Visual Direction
* **Theme**: Clean bluish-white theme with crisp white/light backgrounds, a blue primary color (`#1E40AF` / `#2563EB`), and subtle blue surface accents (`#F0F9FF` / `#EFF6FF`).
* **Components**: Clean rounded cards (`borderRadius: 12`), consistent padding/margins, legible typography, and soft, natural shadows.
* **Tone**: Professional, authoritative, clear, and trustworthy.
* **Responsiveness**: Ensure layouts adjust smoothly across various mobile screen sizes and orientations.

### Guidelines
* Do **NOT** copy Facebook's UI. The blue/white palette serves only as clean color inspiration.
* **Avoid**:
  * Excessive or heavy gradients
  * Unnecessary glassmorphism / blur effects
  * Distracting or slow micro-animations
  * Oversized display typography
  * Purely decorative UI elements that decrease usability
  * Inconsistent corner radii or arbitrary color hexes scattered in component files
* **Theme Usage**: Always consume theme values from `src/theme/` (or `theme.ts`) rather than hardcoding inline color strings or pixel values.

---

## 4. Component Rules

* **Reusability**: Create reusable components (`src/components/`) when the same UI pattern appears more than once.
* **Granularity**: Do not create component abstractions for tiny, single-use JSX elements.
* **Scope**: Avoid massive screen files with hundreds of lines of mixed UI and logic. Break screens into modular sub-components.
* **TypeScript**: Define explicit prop interfaces for every component. Avoid `any`.

---

## 5. API Rules

* **Decoupled API Calls**: Never invoke `fetch` or `axios` directly inside presentational UI components. Always route requests through `src/services/`.
* **Centralization**: Centralize HTTP configuration, base URLs, headers, and interceptors.
* **Environment Variables**: Always retrieve base backend URLs from environment configuration (`process.env` / Expo constants). Never hardcode API hostnames or IP addresses.
* **No Hardcoded Credentials**: Never embed API keys, secrets, or default passwords in source code.
* **State Handling**: Explicitly handle loading (`isLoading`), success, empty (`data.length === 0`), and error states in all data-driven views.
* **Contract Integrity**: Never assume an API response schema without verifying the backend contract.

---

## 6. Authentication Rules

When authentication is implemented:
* Use secure storage mechanisms appropriate for React Native (e.g., `expo-secure-store`) for authentication tokens.
* Never store plain-text passwords or sensitive tokens in `AsyncStorage` or unencrypted storage.
* Keep authentication state centralized using React Context or a lightweight custom hook.
* Enforce role-based navigation screens based on user roles (`provider_admin`, `committee`, `guard`).
* Never rely solely on client-side role checks for security; the backend remains the ultimate authority for authorization.

---

## 7. Security Rules

This application handles sensitive data including employee records, guard shifts, committee records, visitor logs, and building security entry logs.

* **Logging**: Never log passwords, tokens, secrets, or sensitive personal data to `console.log` in production.
* **Environment Files**: Never commit `.env` or files containing secret keys to version control.
* **Input Validation**: Sanitize and validate all user inputs before submitting to the backend.
* **Zero Trust**: Client-side authorization checks are strictly for UI rendering purposes. All security checks must be enforced by the backend.

---

## 8. Coding Rules

* **TypeScript First**: Write strict TypeScript. Avoid using `any` or loose type casting (`as unknown`).
* **Readability**: Write explicit, readable code over clever one-liners.
* **Dependencies**: Avoid adding external NPM packages for trivial tasks. Reuse existing installed dependencies (`react-native-safe-area-context`, `react-native-screens`, etc.).
* **Stability**: Do not upgrade dependencies randomly or change Expo / React Native configurations without understanding the full build impact.
* **Clean Code**: Keep functions focused and concise. Remove unused imports, commented-out code, and debug logs before committing changes.

---

## 9. Change Management Rules

Before modifying any existing screen or feature:
1. **Inspect**: Read and understand the existing implementation and data flow first.
2. **Minimize**: Make the smallest, safest required change.
3. **Preserve**: Maintain existing working functionality and component contracts.
4. **Verify**: Test the modified component and affected routes afterward (`npm run typecheck`).

Do **NOT** rewrite large portions of the app simply because another pattern looks cleaner.

---

## 10. AI Agent Rules

When asked to implement a feature or fix a bug inside `app/`:

1. **Inspect First**: Read relevant existing files before writing new code.
2. **Follow Patterns**: Match existing naming conventions, component styles, and file structure.
3. **Strict Scope**: Implement only the requested feature or fix. Do not invent unrequested screens or features.
4. **No Side-Effects**: Do not create duplicate screens, components, or services.
5. **Boundary Isolation**: Do **NOT** modify files inside `backend/` when working on an `app/` task, unless explicitly requested.
6. **Backend Contract**: If a required backend API endpoint is missing, clearly define the expected API contract instead of fabricating mock data architectures.
7. **Verification**: Always run `npm run typecheck` inside `app/` after making changes to verify there are no TypeScript errors.
