# Adopt a Dog (SG)

## Overview

Adopt a Dog is a centralized, real-time aggregate platform for adoptable dogs in Singapore. Designed to streamline the rehoming process, the website aggregates dog profiles from various local Animal Welfare Groups (AWGs) and displays them to potential adopters in a fair, randomized order. AWGs have direct control over their listings via a dedicated portal, giving each organization an autonomous, branded footprint to amplify their rescue efforts.

## Goals

1. Let authenticated Animal Welfare Groups (AWGs) manage their dog profiles securely.
2. Provide a public-facing directory of adoptable dogs displayed in a fair, randomized rotation.
3. Allow AWGs to create, update, and delete their dog listings in real time.
4. Provide every participating AWG with a dedicated, clean vanity URL to showcase their specific dogs.
5. Provide a completely free platform for welfare groups to list rescues without any transaction fees.
6. Enable potential adopters to browse and seamlessly connect with respective AWGs.

## Core User Flow

### For Potential Adopters:

1. User visits the website main landing page.
2. User browses dogs displayed in a randomized sequence.
3. User filters or clicks on a specific dog profile to view detailed description and AWG alignment.
4. User optionally navigates directly to a specific AWG's dedicated vanity link.
5. User contacts the respective AWG to initiate the adoption process.

### For Animal Welfare Groups (AWGs):

1. AWG representative signs in with their assigned username and password.
2. AWG enters their dashboard workspace.
3. AWG creates a new dog listing (uploading photos, description, and traits).
4. AWG updates or deletes active listings as adoption statuses change.
5. AWG copies and shares their dedicated group URL on social media to direct traffic to their specific sub-portal.

## Features

### Authentication and AWG Portals

- Secure sign-in mechanism and credential protection for authorized welfare group accounts.
- Tailored dashboards allowing specific AWG user groups to handle their own data securely.

### Controlled Listing Management (CRUD)

- Real-time data sync allowing updates to reflect instantly on the public front-end.
- Ability to create new dog profiles, update details (e.g., medical status, temperament updates), and delete listings once successfully rehomed.

### Fair-Exposure Public Canvas

- An optimized feed mechanism that randomizes the display order of dogs upon page loads or filters.
- Eliminates systemic bias, ensuring smaller AWGs or older dogs get equal visibility compared to newer listings.

### Custom Branding and Dedicated Pages

- Dynamically generated vanity routing paths for every registered organization.
- Structure format matches: `adoptadog.sg/welfare-groups/[welfare-group-slug]` _(e.g., adoptadog.sg/welfare-groups/action-for-singapore-dogs)_.

## Scope

### In Scope

- Admin credential authentication for validated welfare groups.
- Direct CRUD control panel for dog listing management.
- Dynamic generation of custom vanity URLs for AWGs.
- Global randomized algorithm for public directory search feeds.
- 100% free hosting and listing infrastructure for verified partners.
- Mobile-responsive layout for browsing adopters.

### Out Of Scope

- Processing of monetary donations, adoption fees, or sponsorship subscriptions.
- Legal background screening or automated verification frameworks for potential adopters.
- In-app direct messaging system (users are routed directly to the AWG's external contact info).
- Advanced automated multi-platform cross-posting (e.g., auto-posting listings directly to Facebook/Instagram API).

## Success Criteria

1. An authenticated welfare group user can successfully log in and access their dashboard.
2. AWGs can instantly populate, update, or remove a dog profile from the public search index.
3. Public dog listings display in a randomized order upon standard navigation queries.
4. Each partner welfare group has an operational, error-free dedicated vanity URL route.
5. Potential adopters can view clean, up-to-date rescue summaries without paywalls or ad clutter.
