# Design Guidelines: TrailShare - Collaborative Hiking Tracker

## Design Approach

**Hybrid Approach: Material Design Foundation + Outdoor App Aesthetics**

Drawing inspiration from AllTrails and Strava for outdoor-focused UI patterns, grounded in Material Design principles for cross-platform mobile consistency. The design emphasizes visual hiking content while maintaining utility-first interactions.

**Core Principles:**
- Mobile-first with generous touch targets (minimum 44px)
- Nature-inspired color palette that doesn't compete with user photos
- Clean, scannable layouts for quick hike logging on trails
- Progressive disclosure for advanced features

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 220 15% 12% (deep slate, less harsh than pure black)
- Surface: 220 12% 18% (elevated cards)
- Surface variant: 220 10% 22% (input fields, secondary surfaces)
- Primary: 150 60% 45% (forest green - trust, outdoors)
- Primary variant: 150 55% 35% (darker green for hover states)
- Accent: 35 85% 60% (warm amber for CTAs and highlights)
- Text primary: 0 0% 95%
- Text secondary: 220 10% 70%
- Success: 145 65% 50% (completed hikes)
- Warning: 35 90% 60% (difficult trails)
- Error: 0 70% 55%

**Light Mode:**
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100%
- Surface variant: 220 15% 95%
- Primary: 150 65% 40% (richer green for light backgrounds)
- Accent: 35 80% 50%
- Text primary: 220 15% 15%
- Text secondary: 220 10% 45%

### B. Typography

**Font Stack:**
- Primary: 'Inter' from Google Fonts (clean, highly legible for data)
- Accent: 'Outfit' from Google Fonts (headings, friendly outdoor feel)

**Scale:**
- H1 (Page titles): Outfit, 2rem (32px), font-weight 700
- H2 (Section headers): Outfit, 1.5rem (24px), font-weight 600
- H3 (Card titles): Outfit, 1.25rem (20px), font-weight 600
- Body: Inter, 1rem (16px), font-weight 400, line-height 1.6
- Small (metadata): Inter, 0.875rem (14px), font-weight 400
- Button text: Inter, 0.9375rem (15px), font-weight 500
- Caption: Inter, 0.75rem (12px), font-weight 400

### C. Layout System

**Spacing Primitives (Tailwind units):**
- Use 4, 6, 8, 12, 16, 24 for consistency
- Component padding: p-4 (mobile), p-6 (tablet+)
- Section spacing: space-y-8 (mobile), space-y-12 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Touch targets: Minimum h-12 (48px) for all interactive elements

**Container Strategy:**
- Mobile: Full-width with px-4 padding
- Desktop: max-w-7xl mx-auto with px-6
- Content max-width: max-w-4xl for reading comfort

### D. Component Library

**Navigation:**
- Bottom tab bar (mobile) with 4-5 primary actions: Home, Add Hike, Map View, Shared, Profile
- Icons from Heroicons (outline for inactive, solid for active state)
- Tab height: h-16 with safe-area-inset-bottom
- Desktop: Side navigation with collapsible menu

**Hike Cards:**
- Prominent photo thumbnail (16:9 aspect ratio, rounded-lg)
- Overlay gradient on image bottom for text legibility
- Trail name (H3), location pin icon + text
- Difficulty badge with color coding (green/amber/orange/red)
- Metadata row: date, distance, duration with icons
- Collaborators: Small avatar stack (max 3 visible + count)
- Card elevation: shadow-md with hover:shadow-lg transition

**Photo Gallery:**
- Masonry grid layout (2 columns mobile, 3-4 desktop)
- Lightbox modal for full-size viewing with swipe gestures
- Upload zone: Dashed border, prominent cloud upload icon
- Drag-to-reorder on desktop, long-press on mobile

**Map Integration:**
- Full-screen map view toggle
- Location markers: Custom mountain/trail icon in primary color
- Cluster markers for multiple hikes in area
- Route polyline if GPS track available (primary color with 50% opacity)

**Forms & Inputs:**
- Floating labels with smooth transition
- Input backgrounds: surface-variant color (distinct from page background)
- Focus ring: 2px ring-primary with ring-offset-2
- Dropdown selects: Native on mobile, custom styled on desktop
- Date/time pickers: Native mobile pickers
- Star rating: Large touch targets (min 44px), amber fill color

**Difficulty Rating System:**
- Visual badges: rounded-full with px-3 py-1
- Easy: bg-green-500/20 text-green-400 (dark) / bg-green-100 text-green-700 (light)
- Moderate: bg-amber-500/20 text-amber-400 / bg-amber-100 text-amber-700
- Hard: bg-orange-500/20 text-orange-400 / bg-orange-100 text-orange-700
- Expert: bg-red-500/20 text-red-400 / bg-red-100 text-red-700
- Include small difficulty icon (chevron-up for elevation)

**Collaborative Features:**
- Shared badge: Subtle border-2 border-accent on shared hike cards
- Contributor avatars: Stacked with -ml-2 overlap, border-2 border-surface
- Permission indicators: Lock/unlock icons with tooltips
- Real-time edit indicator: Pulsing dot next to user avatar

**CTAs & Buttons:**
- Primary: bg-primary with white text, rounded-lg, px-6 py-3
- Secondary: bg-surface-variant, rounded-lg
- Floating Action Button (FAB): Fixed bottom-right, size-16, shadow-xl, primary color
- On image overlays: bg-white/10 backdrop-blur-md with ring-1 ring-white/20

**Data Display:**
- Stats cards: Grid layout with icon, value (large), label (small)
- Timeline view for hike history: Vertical line with connected cards
- Empty states: Illustration placeholder with clear CTA

### E. Animations

**Minimal & Purposeful:**
- Card hover: transform scale(1.02) with transition-transform duration-200
- Page transitions: Fade with duration-150 (avoid jarring slides on mobile)
- Photo upload: Progress indicator with smooth fill animation
- Pull-to-refresh: Elastic bounce on mobile
- NO auto-playing carousels or decorative animations

---

## Images

**Hero Section:**
- Large header image (not traditional hero): Panoramic hiking photo showcasing app's photo quality
- Aspect ratio: 21:9 on desktop, 16:9 on mobile
- Overlay: Linear gradient from transparent to background-color at bottom
- Text overlay: App tagline "Track, Share, Explore Together" with primary CTA

**Content Images:**
- User-uploaded hike photos as primary visual content
- Placeholder images: Subtle mountain/forest line art in surface-variant color
- Icon illustrations for empty states: Simple, outlined style matching Heroicons
- Map tiles: Outdoor/terrain style (Mapbox Outdoors or similar)

**Profile & Social:**
- User avatars: Circular, 40px standard, 80px for profile pages
- Default avatar: Initials on gradient background (generated from user name)

---

## Mobile-Specific Considerations

- **Gestures:** Swipe-to-delete on lists, pinch-to-zoom on maps/photos, pull-to-refresh
- **Safe Areas:** Account for notch/island with safe-area-inset
- **Thumb Zones:** Primary actions in bottom 1/3 of screen
- **Performance:** Lazy load images, virtual scrolling for long lists
- **Offline:** Clear visual indicators for cached vs. synced content

---

## Accessibility

- **Color Contrast:** WCAG AAA for text, AA for interactive elements
- **Touch Targets:** Minimum 44x44px with adequate spacing
- **Focus Indicators:** Prominent 2px ring on all interactive elements
- **Screen Readers:** Semantic HTML, ARIA labels for icons
- **Dark Mode:** Consistent implementation across all surfaces and inputs
- **Reduced Motion:** Respect prefers-reduced-motion for animations