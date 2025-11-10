# Heading Component

A reusable heading component that uses **Noto Serif** font across the application for consistent typography.

## Features

- ✅ Uses Noto Serif font family
- ✅ Supports all heading levels (h1-h6)
- ✅ Pre-styled with appropriate sizes for each level
- ✅ Fully customizable with className prop
- ✅ TypeScript support
- ✅ Forwarded refs for advanced use cases

## Usage

```tsx
import { Heading } from "@/components/ui/heading";

// Default (h2)
<Heading>Your Heading Text</Heading>

// H1
<Heading as="h1">Main Page Title</Heading>

// H3 with custom styling
<Heading as="h3" className="text-primary">
  Custom Styled Heading
</Heading>

// H4
<Heading as="h4">Section Title</Heading>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h2"` | The HTML heading element to render |
| `className` | `string` | - | Additional CSS classes to apply |
| `children` | `React.ReactNode` | - | The heading content |
| ...props | `HTMLAttributes<HTMLHeadingElement>` | - | Any valid HTML heading attributes |

## Default Styles by Level

- **h1**: `text-4xl lg:text-5xl font-bold tracking-tight`
- **h2**: `text-3xl lg:text-4xl font-bold tracking-tight`
- **h3**: `text-2xl font-semibold tracking-tight`
- **h4**: `text-xl font-semibold tracking-tight`
- **h5**: `text-lg font-semibold tracking-tight`
- **h6**: `text-base font-semibold tracking-tight`

All headings include `scroll-m-20` for proper scroll margin.

## Examples

### Landing Page Hero
```tsx
<Heading as="h1" className="text-4xl md:text-6xl lg:text-7xl max-w-4xl">
  Modern Case Management for
  <span className="text-primary"> Pacific Courts</span>
</Heading>
```

### Section Heading
```tsx
<Heading as="h2" className="text-3xl md:text-5xl">
  Everything You Need to Manage Court Cases
</Heading>
```

### Card Title
```tsx
<Heading as="h3">
  Case Management Features
</Heading>
```

### Subsection
```tsx
<Heading as="h4" className="mb-4">
  Key Benefits
</Heading>
```

## Font Setup

The component uses the Noto Serif font family, which is configured in `app/layout.tsx`:

```tsx
import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});
```

## Accessibility

- Maintains proper semantic HTML heading hierarchy
- Preserves all ARIA attributes when passed via props
- Supports ref forwarding for focus management
