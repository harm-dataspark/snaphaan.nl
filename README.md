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
---

Hier begint de tekst.
```

`type` kan `gedicht`, `gedachte` of `verhaal` zijn. Voeg `draft: true` toe om een tekst nog niet te publiceren.

## Lokaal bekijken

```sh
npm install
npm run dev
```

## Publiceren

Elke wijziging op de `main`-branch wordt automatisch met GitHub Pages gepubliceerd. Kies bij **Settings → Pages → Build and deployment** als bron **GitHub Actions**.

De site is voorbereid op `snaphaan.nl`. Stel bij je DNS-provider de records in die GitHub voor een apex-domein voorschrijft en voeg eventueel `www` als CNAME naar `harm-dataspark.github.io` toe.
