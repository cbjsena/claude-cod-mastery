# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**No build process required.** This is a vanilla JavaScript web application with zero dependencies.

### Running the App
- **Browser**: Open `index.html` directly in a web browser (file:// protocol works fine)
- **Live Server** (VS Code): `Right-click index.html → Open with Live Server`
- **Python HTTP Server**: `python -m http.server 8000` then visit `http://localhost:8000`

No npm, webpack, or build tools needed.

---

## Project Architecture

### Two-Layer Design

**1. Data Layer** (`js/storage.js`)
- `BucketStorage` object manages all LocalStorage operations
- Pure data management—no UI concerns
- Methods: `load()`, `save()`, `addItem()`, `updateItem()`, `deleteItem()`, `toggleComplete()`, `getStats()`, `getFilteredList()`
- Single source of truth: LocalStorage key `'bucketList'`

**2. Presentation Layer** (`js/app.js`)
- `BucketListApp` class manages UI and user interactions
- Caches DOM elements at init for performance (`cacheElements()`)
- Binds event listeners once (`bindEvents()`)
- Calls `render()` after any data change
- Does NOT manage data directly—delegates to `BucketStorage`

### Data Model

```javascript
{
  id: "1730880000000",          // Timestamp-based unique ID
  title: "Goal text",            // User input (XSS-safe via escapeHtml)
  completed: false,              // Boolean flag
  createdAt: "2025-11-06",      // ISO date string
  completedAt: null              // ISO date or null
}
```

All items stored as a flat array in LocalStorage. No sorting/filtering happens in storage—the app layer handles `getFilteredList()`.

---

## Key Conventions

### HTML Structure
- Form submission (`#bucketForm`) for adding items
- Filter buttons with `data-filter` attribute for filtering
- Modal (`#editModal`) for edit operations
- Statistics display with computed values from `BucketStorage.getStats()`
- Empty state message shows when list is empty

### Styling
- **Tailwind CSS via CDN** for base styles
- **`css/styles.css`** for custom styles:
  - Filter button active state (blue background)
  - Animations: `slideIn` (items), `fadeIn` (empty state), `scaleIn` (modal)
  - Mobile-first responsive (320px+, 640px breakpoint for layout change)
- **Color scheme**: Blue (primary actions), Green (completed), Orange (in progress), Purple (stats)

### Security
- **XSS Prevention**: `escapeHtml()` method converts user input to safe HTML before rendering
- All user-provided text (titles) goes through `escapeHtml()` before display
- Inline event handlers in HTML are safe because they pass IDs/escaped text only

### Performance
- DOM elements cached once in `cacheElements()` to avoid repeated `querySelector()` calls
- No virtual DOM—`render()` rebuilds the list with `innerHTML` (acceptable for 100s of items)
- Events delegated to data changes, not DOM mutations

---

## Common Development Tasks

### Adding a New Field to Bucket Items
1. Update the data model in `js/storage.js` (add to `newItem` object in `addItem()`)
2. Update `createBucketItemHTML()` in `js/app.js` to display it
3. Ensure HTML escaping if user-provided

### Adding a New Statistic
1. Add computation logic to `getStats()` in `js/storage.js`
2. Add a new display element in `index.html` with a unique `id`
3. Cache the element in `cacheElements()` and update in `updateStats()` in `js/app.js`

### Adding a New Filter Type
1. Add `case` to the `switch` in `getFilteredList()` in `js/storage.js`
2. Add a new filter button in `index.html` with matching `data-filter` value
3. The `handleFilter()` method in `js/app.js` will automatically wire it up

### Styling New Components
- Use Tailwind CSS classes first (via CDN)
- Add custom CSS to `css/styles.css` only for behaviors Tailwind doesn't cover (animations, complex selectors)
- Remember mobile-first: design for 320px width first, then enhance at breakpoints

---

## Important Files & Responsibilities

| File | Purpose | Edit When |
|------|---------|-----------|
| `index.html` | DOM structure, form/buttons, placeholders | Adding UI elements, changing form layout |
| `js/storage.js` | Data CRUD, filters, stats calculation | Changing data structure, adding computed values |
| `js/app.js` | Event handling, rendering, modal logic | Changing UI behavior, adding interactivity |
| `css/styles.css` | Custom styles beyond Tailwind | Animations, responsive adjustments, theme tweaks |

---

## Testing Manually

Since there's no test suite:
1. **Add item**: Type goal → press Enter or click "추가" button
2. **Toggle complete**: Click checkbox → verify strikethrough and color change
3. **Edit item**: Click "수정" → verify modal opens with current text → edit → "저장"
4. **Delete item**: Click "삭제" → confirm dialog → verify item removed
5. **Filter**: Click filter buttons → verify list updates
6. **Stats**: Add/complete items → verify counts and percentage update
7. **Persistence**: Refresh page → verify all items still exist
8. **Mobile**: Resize browser to 320px → verify layout stacks and buttons arrange correctly

---

## Browser Compatibility

Uses modern ES6+ JavaScript and LocalStorage API. Tested on Chrome, Firefox, Safari, Edge (all modern versions). No polyfills needed.

---

## Future Enhancement Guidelines

See README.md for planned features. When implementing:
- Keep separation between `storage.js` (data) and `app.js` (UI)
- Add new fields to data model in `storage.js` first
- Add display/interaction in `app.js` and `index.html` second
- Run manual tests before considering a feature complete
