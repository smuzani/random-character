# Architecture & UI Plan: V7.5 to V8

This document outlines the architectural decisions and UI overhaul plan for transitioning the Random Character Generator from V7.4 to V8.

## 1. Core Principles
1. **Instant Load & Offline-First:** Speed is the priority. The generator must load instantly and run completely client-side. We avoid heavy server-side processing for the core engine.
2. **Data-Driven Rules Engine:** Move away from hardcoded switch statements. We will use a lightweight Rules Engine that parses JSON/TS objects defining traits, weights, requirements, and exclusions.
3. **Future Cloud Scalability:** The data structure must be designed to eventually sync with a centralized database (V8) while remaining performant offline.

## 2. The Line: V7.5 vs V8

We are pushing the boundaries of the client-side experience in V7.5 before moving to a full web-app architecture in V8.

### V7.5 Scope (Offline Expansion)
- **Appearance & Palette:** Complete implementation of skin, hair, eyes, physique, and clothing systems using the new Rules Engine.
- **UI Overhaul:** Implementing the Dual-Mode Interface (Gacha vs. Creation Flow).
- **Instant Portability:** Salvaging high-quality written data from the "Bolt" prototype without using its messy architecture.

### V8 Scope (The Web Transition)
- **Architecture:** A robust, scalable web application (NOT using Vite or Bolt's prototype code).
- **Backend Features:** Centralized database for sync, user accounts, and secure AI integration (Art/Chat).
- **Advanced UX:** Multi-character scenarios and deep moddability.

*(Note: Voice Generation has been removed from the roadmap).*

## 3. UI Design: The Character Creation Engine

The goal is to transition from a "one-click randomizer" to a "molding engine."

### Mode 1: Gacha Mode (Instant Inspiration)
- Prominent "Roll" button for immediate, chaotic character generation.
- Clean, card-based presentation of traits and generated color palettes.

### Mode 2: Creation Flow (Section-by-Section Molding)
- **Guided Process:** Personality -> Appearance -> Background.
- **Locking:** Pin specific traits (e.g., Race: Elf) while rerolling the rest.
- **Micro-Rerolls:** Dedicated reroll buttons for individual aspects (e.g., just rerolling the outfit).
- **Visual Feedback:** UI themes and palettes react dynamically to selected traits.

## 4. Technical Strategy
- **Framework:** Next.js (for V8) to handle SSR (SEO) and API routes (Backend security).
- **Logic:** Port descriptions and data from Bolt to the new V7.5 Rules Engine.
- **Styling:** Vanilla CSS / CSS Modules for a premium, lightweight look.
