# Style Guide for Marketplace MMORPG

## Color Palette

| Name       | Usage                  | Light Mode          | Dark Mode           |
|------------|------------------------|---------------------|---------------------|
| Brand      | Primary brand color    | #2563eb             | #60a5fa             |
| Primary    | Primary buttons, links | var(--primary) #2563eb | var(--primary) #60a5fa |
| Secondary  | Secondary buttons, text| var(--secondary) #64748b | var(--secondary) #94a3b8 |
| Accent     | Alerts, highlights     | #f43f5e             | #fda4af             |
| Background | Page background        | #ffffff             | #0f172a             |
| Foreground | Main text color        | #171717             | #f8fafc             |

## Typography

| Element | Font Size | Line Height | Font Weight | Tailwind Class Example          |
|---------|-----------|-------------|-------------|--------------------------------|
| Display | 3.5rem    | 1.2         | Bold        | `text-display font-bold`        |
| H1      | 2.25rem   | 1.3         | Bold        | `text-h1 font-bold`             |
| H2      | 1.875rem  | 1.4         | Semi-bold   | `text-h2 font-semibold`         |
| H3      | 1.5rem    | 1.5         | Semi-bold   | `text-h3 font-semibold`         |
| H4      | 1.25rem   | 1.6         | Medium      | `text-h4 font-medium`           |
| Body    | 1rem      | 1.6         | Normal      | `text-body`                     |
| Small   | 0.875rem  | 1.5         | Normal      | `text-small`                   |
| XS      | 0.75rem   | 1.5         | Normal      | `text-xs`                      |

## Buttons

- Use `.btn` base class for padding, rounded corners, font weight, and transition.
- Use `.btn-primary` for primary buttons with background color `bg-primary` and white text.
- Use `.btn-secondary` for secondary buttons with lighter background and secondary text color.
- Use `SmokeButton` component for buttons with gradient backgrounds and interactive effects.
- Disabled buttons use `.btn-disabled` with gray background and reduced opacity.

## Layout and Spacing

- Use Tailwind's container classes like `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for consistent page width.
- Use flexbox and grid utilities for layout.
- Maintain consistent spacing using Tailwind's margin and padding utilities (`m-4`, `p-4`, `gap-4`).
- Use responsive utilities (`md:`, `lg:`) to adjust layout on different screen sizes.
- Ensure minimum spacing around images and text for readability.

## Responsive Design

- Use mobile-first approach.
- Use hidden and block utilities to toggle elements on different screen sizes.
- Use consistent breakpoints as defined by Tailwind CSS.

## Dark Mode

- Use `dark:` variants for colors and backgrounds.
- Toggle dark mode by adding/removing `dark` class on the root element.

## Icons and Images

- Use SVG icons with consistent size and color.
- Ensure images have appropriate alt text and spacing.

---

For detailed usage, refer to the Tailwind CSS documentation and the component source code.
