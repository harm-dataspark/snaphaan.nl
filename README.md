# snaphaan.nl

Een minimalistische persoonlijke website voor gedichten, gedachten en verhalen, gebouwd met Astro.

## Een tekst toevoegen

Maak in `src/content/teksten` een nieuw Markdown-bestand, bijvoorbeeld `mijn-verhaal.md`:

```md
---
title: Mijn verhaal
description: Een korte omschrijving.
date: 2026-08-03
type: verhaal
tags:
  - voorbeeld
card: true
---

Hier begint de tekst.
```

`type` kan `gedicht`, `gedachte` of `verhaal` zijn. Tags zijn vrij te kiezen en mogen ook worden weggelaten. Voeg `draft: true` toe om een tekst nog niet te publiceren.

Met `card: true` wordt automatisch een deelbare PNG van 1080 × 1350 gemaakt. Op de tekstpagina verschijnt dan de link **Download kaart**. Laat `card` weg wanneer je geen kaart nodig hebt.

## Lokaal bekijken

```sh
npm install
npm run dev
```

## Publiceren

Elke wijziging op de `main`-branch wordt automatisch met GitHub Pages gepubliceerd. Kies bij **Settings → Pages → Build and deployment** als bron **GitHub Actions**.

De site is voorbereid op `snaphaan.nl`. Stel bij je DNS-provider de records in die GitHub voor een apex-domein voorschrijft en voeg eventueel `www` als CNAME naar `harm-dataspark.github.io` toe.
