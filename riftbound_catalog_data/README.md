# Riftbound Card Catalog

App-ready catalog of **every Riftbound card** published in Riot's official card
gallery, with a high-quality full-card image for each one.

- **cards.json** — one object per card (see schema below)
- **cards.csv** — same data, flat, spreadsheet-friendly
- **images/** — full-card PNGs named by card id, e.g. `ogn-001-298.png`

Generated: **2026-09-28** from Riot's official gallery
(`https://playriftbound.com/en-us/card-gallery/`), via the open-source
pipeline at https://github.com/slimtreble/riftbound-card-data (MIT).

Counts at generation time: **1,189 cards** — Origins 352 · Proving Grounds 24 ·
Spiritforged 288 · Unleashed 288 · Vendetta 237.

> Legal: Riftbound cards, names, text and artwork are the property of **Riot
> Games, Inc.** This catalog is a non-commercial fan project. The gallery text
> is the **printed** card text, not errata'd text — for cards with official
> errata, `ability_text` reflects what's on the physical card.

## Images

`image_file` is the local filename under `images/`. Every file is the original
PNG served by Riot's CDN (`cmsassets.rgpub.io`), saved byte-for-byte (no
re-encoding, no quality loss):

| Printing | Resolution |
|---|---|
| Base / alt-art printings | 744 × 1039 px (portrait) or 1039 × 744 px (landscape battlefields) |
| Signed / overnumbered printings | 1488 × 2078 px (2x) |

These are **full card faces** (frame, text box, collector info), not art crops.
`image_url` keeps the original CDN link if you ever need to re-pull.

## JSON schema

Each entry in `cards.json`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | Riot internal id, e.g. `ogn-001-298`. Unique — use as primary key |
| `name` | string | Card name incl. subtitle, e.g. `Nocturne, Horrifying` |
| `code` | string | Set + collector no., e.g. `OGN-194` |
| `public_code` | string | Full printed code, e.g. `OGN-194/298`. Signed printings carry `*` |
| `set_code` / `set_name` | string | e.g. `OGN` / `Origins` |
| `collector_number` | int | **Not unique alone** — Vendetta has three different `001`s (runes `-R##`, tokens `-T##`, promos `-SP#` run their own numbering). Key on `id`/`code` |
| `rarity` | string | Common, Uncommon, Rare, Epic, Showcase |
| `type` | string\|null | Unit, Spell, Gear, Rune, Legend, Battlefield |
| `cost` | int\|null | Energy cost |
| `might` | int\|null | Might (units) |
| `power` | int\|null | Power value (runes) |
| `health` | null | Not published in Riot's gallery |
| `domains` | string[] | e.g. `["Fury"]` — dual-domain cards have two |
| `tags` | string[] | Traits, e.g. `["Dragon", "Noxus"]` |
| `ability_text` | string | Plain text, line breaks preserved. **No HTML.** Symbols are tokens (see below) |
| `flavor_text` | null | Not published in Riot's gallery |
| `artists` | string[] | Illustrator credits |
| `orientation` | string | `portrait` or `landscape` |
| `image_file` | string | Local file under `images/` |
| `image_url` | string | Original Riot CDN URL |
| `is_alternate_art` | bool | Alt-art printing (`OGN-007a` style codes). Text is sometimes abbreviated — prefer the base printing for rules |
| `is_signed` | bool | Signed printing (`*` in `public_code`) |
| `is_overnumbered` | bool | Collector number beyond the set size (e.g. `OGN-299/298`) — showcase/special printings |
| `is_variant` | bool | `true` when any of the above is true. **Filter on this to get one row per unique card** |

### Symbol tokens in `ability_text`

| Token | Meaning |
|---|---|
| `{energy:3}` | Energy cost of 3 |
| `{power:fury}` / `{power:calm}` / `{power:mind}` / `{power:body}` / `{power:chaos}` / `{power:order}` | Domain power |
| `{power:any}` | Any-domain power |
| `{might}` | Might symbol |
| `{exhaust}` | Exhaust symbol |

Map these to icons in the app's renderer.

## Refreshing

1. `cd source && python3 fetch_cards.py` — re-pulls the gallery into `source/cards.json`
2. `python3 build_catalog.py` — rebuilds `cards.json` / `cards.csv`
3. `python3 download_all.py` — fetches any new images (skips existing)

All scripts are Python standard library only, no API key needed.
