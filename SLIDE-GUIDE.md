# API-203M Slide System Guide

## File Structure

```
api203m-slides/
  styles.css          # Shared CSS for all class decks
  slides.js           # Shared JS (progressive reveal, timer, print)
  index.html          # Class 1: Introduction
  class02.html        # Class 2: Qualitative Literacy
  class03.html        # Class 3: Observation
  ...                 # etc.
```

Each class is a separate HTML file that links to the shared `styles.css` and `slides.js`.

## Color System

- **Red** (`--accent: #ff3300`) — Theory/Technique slides (default)
- **Blue** (`--accent: #5371ff`) — Application/Practice slides (add class `application` to `<section>`)

## Slide Types & HTML Snippets

### 1. Title Slide
```html
<section class="slide" data-section="title">
    <div class="progress" style="width: 2%"></div>
    <div class="grid-bg"></div>
    <div class="accent-circle"></div>
    <div class="accent-line"></div>
    <div class="accent-dot"></div>
    <div class="slide-content">
        <h1 class="reveal-item visible">Title <span class="highlight">Here</span></h1>
        <p class="meta reveal-item visible">Subtitle</p>
        <p class="meta reveal-item visible" style="margin-top: 0.5em;">API-203M · Spring 2026 · Class #N: Topic</p>
        <p class="meta reveal-item visible" style="margin-top: 1em;">Prof. Liz McKenna · Harvard Kennedy School</p>
    </div>
    <span class="slide-number">01</span>
</section>
```

### 2. Section Header (accent background)
```html
<section class="slide accent-bg section-header">
    <div class="progress" style="width: XX%"></div>
    <div class="slide-content">
        <h1 class="reveal-item visible">Section<br>Title</h1>
    </div>
    <span class="slide-number">NN</span>
</section>
```

For application/blue headers, add `application` class:
```html
<section class="slide accent-bg section-header application">
```

### 3. Content with Progressive Reveal (bullet list)
```html
<section class="slide" data-steps="4">
    <div class="progress" style="width: XX%"></div>
    <div class="grid-bg"></div>
    <span class="mode-indicator">Theory</span>  <!-- or "Application" -->
    <div class="slide-content">
        <h2 class="reveal-item">Slide Title</h2>
        <ul>
            <li class="reveal-item"><span class="bullet">→</span><strong>Bold lead</strong> — Supporting text</li>
            <li class="reveal-item"><span class="bullet">→</span>Another point</li>
            <li class="reveal-item"><span class="bullet">→</span>Third point</li>
        </ul>
    </div>
    <div class="step-indicator">
        <div class="step-dot"></div>
        <div class="step-dot"></div>
        <div class="step-dot"></div>
        <div class="step-dot"></div>
    </div>
    <span class="slide-number">NN</span>
</section>
```

### 4. Numbered List
```html
<li class="reveal-item"><span class="num">01</span>First item</li>
<li class="reveal-item"><span class="num">02</span>Second item</li>
```

### 5. Cards / Columns
```html
<section class="slide" data-steps="4">
    <div class="progress" style="width: XX%"></div>
    <div class="grid-bg"></div>
    <div class="slide-content">
        <h2 class="reveal-item">Title</h2>
        <div class="columns">
            <div class="card reveal-item">
                <h3>Card Title</h3>
                <p>Card content</p>
            </div>
            <div class="card reveal-item">
                <h3>Card Title</h3>
                <p>Card content</p>
            </div>
            <div class="card reveal-item">
                <h3>Card Title</h3>
                <p>Card content</p>
            </div>
        </div>
    </div>
    <div class="step-indicator"><!-- dots --></div>
    <span class="slide-number">NN</span>
</section>
```

### 6. Quote (dark background)
```html
<section class="slide dark">
    <div class="progress" style="width: XX%"></div>
    <div class="slide-content" style="max-width: 850px;">
        <blockquote class="reveal-item visible" style="font-size: clamp(1.1rem, 2.8vw, 1.8rem); text-transform: none; font-weight: 600; line-height: 1.4;">
            "Quote text with <span class="highlight">emphasis</span>."
        </blockquote>
        <cite class="reveal-item visible">— Author, Source</cite>
    </div>
    <span class="slide-number">NN</span>
</section>
```

### 7. Timer / Activity Slide
```html
<section class="slide application" id="timer-slide">
    <div class="progress" style="width: XX%"></div>
    <div class="slide-content" style="align-items: center; text-align: center;">
        <h2 class="reveal-item visible">Activity Title</h2>
        <p class="reveal-item visible" style="font-size: var(--h3-size); max-width: 600px; margin-top: var(--content-gap);">
            Activity instructions
        </p>
        <div class="timer-container reveal-item visible" style="margin-top: var(--content-gap);">
            <p id="countdown-display" style="font-size: clamp(3rem, 10vw, 6rem); font-family: 'Archivo', sans-serif; font-weight: 800; color: var(--accent); margin: 0; cursor: pointer; transition: transform 0.1s;">05:00</p>
            <p id="timer-hint" style="font-size: var(--small-size); color: var(--text-secondary); margin-top: 0.5rem;">Click timer to start</p>
        </div>
    </div>
    <span class="slide-number">NN</span>
</section>
```

## Progressive Reveal Rules

- `data-steps="N"` on the `<section>` — sets expected step count
- Each `class="reveal-item"` is one step (revealed in DOM order)
- Add `visible` class to items that should show immediately (title slides, quotes)
- Use `data-group="N"` to reveal multiple items as one step (e.g., timeline)
- Step indicator dots should match the number of reveal steps

## Progress Bar

Set `style="width: XX%"` where XX = (slideNumber / totalSlides) * 100.

## New Class Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API-203M: [Topic] | Prof. Liz McKenna</title>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Nunito:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <!-- SLIDE 1: Title -->
    <section class="slide" data-section="title">
        <div class="progress" style="width: 2%"></div>
        <div class="grid-bg"></div>
        <div class="accent-circle"></div>
        <div class="accent-line"></div>
        <div class="accent-dot"></div>
        <div class="slide-content">
            <h1 class="reveal-item visible">[Topic] <span class="highlight">[Highlight]</span></h1>
            <p class="meta reveal-item visible">[Subtitle]</p>
            <p class="meta reveal-item visible" style="margin-top: 0.5em;">API-203M · Spring 2026 · Class #N: [Topic]</p>
            <p class="meta reveal-item visible" style="margin-top: 1em;">Prof. Liz McKenna · Harvard Kennedy School</p>
        </div>
        <span class="slide-number">01</span>
    </section>

    <!-- Add slides here -->

    <div class="nav-hint">→ Next · ↓ Skip slide</div>
    <script src="slides.js"></script>
</body>
</html>
```

## SP26 Course Schedule → Old Deck Mapping

| SP26 Class | Date | Topic | Old Deck Source |
|------------|------|-------|----------------|
| 1 (Tue Mar 3) | Introduction | `index.html` (done) | — |
| 2 (Thu Mar 5) | Qualitative Literacy | `class02.html` | `02--Qualitative Literacy.pptx` |
| 3 (Tue Mar 10) | Observation | `class03.html` | `04--Observation 1.0.pptx` |
| 4 (Thu Mar 12) | Ethics | `class04.html` | `03--Ethics.pptx`, `10--Focus Group Simulation (El Salvador case)` |
| — | Mar 16-20 | Spring Break | — |
| 5 (Tue Mar 24) | Interviewing Intro | `class05.html` | `05--Interviewing 1.0.pptx` |
| 6 (Thu Mar 26) | Workshop: Observation | `class06.html` | `06--Observation Workshop.pptx` (3 versions) |
| 7 (Tue Mar 31) | Interviewing 2.0 | `class07.html` | `07--Interviewing 2.0.pptx` |
| 8 (Thu Apr 2) | Workshop: Interview | `class08.html` | `08--Interviewing Workshop.pptx` (3 versions) |
| 9 (Tue Apr 7) | Focus Groups Intro | `class09.html` | `09--Focus Groups Introduction.pptx` (2 versions) |
| 10 (Thu Apr 9) | Focus Group Simulation | `class10.html` | `10--Focus Group Simulation + Intro to Archival.pptx` |
| 11 (Tue Apr 14) | Qual Coding Workshop | `class11.html` | — (new content) |
| 12 (Thu Apr 16) | Guest Lecture + Wrap-Up | `class12.html` | `12--Final Class.pptx` |

## Content Notes for Future Classes

### Class 4 (Ethics, Mar 12)
- Move the **El Salvador case** from old deck `10--Focus Group Simulation + Intro to Archival.pptx` — Hoover Green's research using 60,000+ incident-level records of political violence in El Salvador (1980-1992), with identifying info for living victims/perpetrators
- **Kaiser** is required reading (respondent confidentiality)
- **Ayrton** (power dynamics between researcher and subject) is optional

### Class 2 (Qual Literacy, Mar 5)
- **Shereefdeen et al. 2024** added as optional reading (GenAI reliability in qualitative research quality appraisal)

### Class 12 (Wrap-Up, Apr 16)
- **Guest lecture: Kunal Handa** from Anthropic (Research Scientist, lead for Anthropic Interviewer; focused on societal impacts of AI)
- Final assignment tips
- Synthesis and class wrap-up
