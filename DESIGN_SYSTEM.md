# 🎨 Smart Screenshot Notes - Design System

## Color Palette

### Primary Colors
```css
--bright-pink: #ef476f      /* Bright Pink Crayola */
--sunglow: #ffd166          /* Sunglow Yellow */
--emerald: #06d6a0          /* Emerald Green */
--blue-ncs: #118ab2         /* Blue NCS */
--midnight-green: #073b4c   /* Midnight Green */
```

### Lighter Variations
```css
--pink-light: #ff6b8f
--yellow-light: #ffe699
--emerald-light: #5fffd4
--blue-light: #4db8d8
--green-dark: #042630
```

### Neutral Tones
```css
--white-soft: #fafafa
--grey-light: #e8e8e8
--grey-medium: #8b8b8b
--text-dark: #1a1a1a
```

---

## Gradients

### Primary Gradient (Pink → Yellow → Emerald)
```css
--gradient-primary: linear-gradient(135deg, #ef476f 0%, #ffd166 50%, #06d6a0 100%);
```
**Usage**: Headers, primary text, stat cards (1st)

### Ocean Gradient (Blue → Emerald → Light)
```css
--gradient-ocean: linear-gradient(135deg, #118ab2 0%, #06d6a0 50%, #5fffd4 100%);
```
**Usage**: Background, secondary buttons, stat cards (2nd)

### Warm Gradient (Yellow → Pink)
```css
--gradient-warm: linear-gradient(135deg, #ffd166 0%, #ef476f 100%);
```
**Usage**: Delete buttons, stat cards (3rd), danger actions

### Cool Gradient (Emerald → Blue)
```css
--gradient-cool: linear-gradient(135deg, #06d6a0 0%, #118ab2 100%);
```
**Usage**: Primary buttons, export buttons

### Depth Gradient (Midnight Green → Dark)
```css
--gradient-depth: linear-gradient(180deg, #073b4c 0%, #042630 100%);
```
**Usage**: Modal backgrounds, overlays

### Full Spectrum Gradient
```css
--gradient-full: linear-gradient(135deg, #ef476f 0%, #ffd166 25%, #06d6a0 50%, #118ab2 75%, #073b4c 100%);
```
**Usage**: Scrollbar hover, special effects

---

## Component Styles

### Glassmorphism Cards
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(20px);
border-radius: 20px;
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.1),
  0 2px 8px rgba(0, 109, 119, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.8);
border: 1px solid rgba(255, 255, 255, 0.3);
```

### Buttons
- **Primary**: Cool gradient (Emerald → Blue)
- **Secondary**: Ocean gradient
- **Danger**: Warm gradient (Yellow → Pink)
- **Gallery**: Full primary gradient
- **Shadow**: `0 4px 12px rgba(color, 0.35)`
- **Hover Shadow**: `0 6px 20px rgba(color, 0.5)`

### Interactive States
- **Hover**: `translateY(-2px)` + enhanced shadow
- **Active**: `translateY(0)`
- **Focus**: Border color change + glow shadow

---

## Typography

### Headings
- **Font Weight**: 700 (Bold)
- **Gradient Text**: Primary gradient with `-webkit-background-clip: text`
- **Color Fallback**: `--text-dark` (#1a1a1a)

### Body Text
- **Primary**: `--text-dark` (#1a1a1a)
- **Secondary**: `--grey-medium` (#8b8b8b)
- **Links**: `--blue-ncs` (#118ab2)
- **Link Hover**: `--emerald` (#06d6a0)

---

## Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Scale In (Modal)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Layout

### Background
- **Base**: Ocean gradient
- **Overlay**: Radial gradients (Pink, Yellow, Emerald) at 10-20% opacity
- **Attachment**: Fixed

### Grid System
- **Gallery**: `repeat(auto-fill, minmax(320px, 1fr))`
- **Stats**: `repeat(auto-fit, minmax(220px, 1fr))`
- **Gap**: 20-24px

### Border Radius
- **Small**: 10-12px (inputs, buttons)
- **Medium**: 16-18px (cards)
- **Large**: 20px (header, modal)

---

## Shadows

### Light Shadow (Cards)
```css
box-shadow: 
  0 8px 24px rgba(0, 0, 0, 0.08),
  0 2px 8px rgba(0, 0, 0, 0.04),
  inset 0 1px 0 rgba(255, 255, 255, 0.8);
```

### Medium Shadow (Hover)
```css
box-shadow: 
  0 16px 48px rgba(0, 0, 0, 0.15),
  0 4px 16px rgba(0, 0, 0, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.8);
```

### Heavy Shadow (Modal)
```css
box-shadow: 
  0 16px 64px rgba(0, 0, 0, 0.6),
  0 0 0 1px rgba(255, 255, 255, 0.1);
```

---

## Special Effects

### Gradient Accent Bar
```css
.element::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
  border-radius: 20px 20px 0 0;
}
```

### Ripple Effect (Buttons)
```css
button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

button:hover::before {
  width: 300px;
  height: 300px;
}
```

### Image Zoom on Hover
```css
.screenshot-card:hover .screenshot-image {
  transform: scale(1.05);
}
```

---

## Accessibility

- **Contrast Ratios**: All text meets WCAG AA standards
- **Focus States**: Clear visual indicators with emerald glow
- **Hover States**: Smooth transitions with clear feedback
- **Color Blindness**: Gradients use multiple hues for distinction

---

## Design Philosophy

✨ **Vibrant & Energetic**: Bright colors inspired by nature (coral reefs, sunsets, tropical waters)  
🌊 **Depth & Layers**: Glassmorphism and multi-layer shadows create visual depth  
🎯 **Interactive**: Every element responds to user interaction  
🎨 **Cohesive**: Consistent gradient system across all components  
⚡ **Modern**: Contemporary design trends (glassmorphism, gradient text, smooth animations)
