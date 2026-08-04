# snaphaan.nl

Een minimalistische persoonlijke website voor gedichten, gedachten en verhalen, gebouwd met Astro en gepubliceerd via GitHub Pages.

Deze README is ook de praktische handleiding voor het schrijven en publiceren van nieuwe teksten.

## Snel een nieuwe tekst publiceren

1. Open in GitHub de map `src/content/teksten`.
2. Kies **Add file → Create new file**.
3. Geef het bestand een korte naam met kleine letters en koppeltekens, bijvoorbeeld `mijn-nieuwe-verhaal.md`.
4. Kopieer het sjabloon hieronder en pas de gegevens en tekst aan.
5. Kies **Commit changes** en commit naar `main`.
6. GitHub Actions bouwt en publiceert de site automatisch. Onder **Actions** is te zien of de build groen is.

De bestandsnaam bepaalt de URL. `mijn-nieuwe-verhaal.md` wordt bijvoorbeeld:

```text
https://snaphaan.nl/teksten/mijn-nieuwe-verhaal/
```

## Compleet sjabloon

```md
---
title: Mijn nieuwe verhaal
description: Een korte omschrijving voor de homepage.
date: 2026-08-04
type: verhaal
tags:
  - familie
  - aandacht
card: true
draft: false
---

Hier begint de tekst.
```

Alles tussen de twee regels met `---` bovenaan heet de frontmatter. De eigenlijke tekst begint na de tweede `---`.

## Betekenis van de velden

| Veld | Verplicht | Gebruik |
| --- | --- | --- |
| `title` | ja | De titel op de homepage, tekstpagina en eventuele kaart. |
| `description` | ja | De korte omschrijving op de homepage en voor zoekmachines. |
| `date` | ja | Publicatiedatum in de vorm `JJJJ-MM-DD`. Teksten worden van nieuw naar oud gesorteerd. |
| `type` | ja | Alleen `gedicht`, `gedachte` of `verhaal`. |
| `tags` | nee | Vrij te kiezen trefwoorden. Laat het hele veld weg als je geen tags wilt. |
| `card` | nee | `true` maakt automatisch een deelbare PNG. Standaard is dit `false`. |
| `draft` | nee | `true` houdt de tekst buiten de website, RSS-feed en kaartgenerator. Standaard is dit `false`. |

Voor één tag:

```yaml
tags:
  - familie
```

Voor meerdere tags:

```yaml
tags:
  - familie
  - aandacht
```

Tags zijn niet beperkt tot vaste categorieën. Nieuwe woorden mogen dus gewoon worden toegevoegd. Op een tekstpagina staan ze onder de tekst. Op de homepage verschijnt een filter zodra er meer dan één verschillende tag in gebruik is. Hetzelfde geldt voor de drie teksttypen.

## Markdown en opmaak

### Alinea's en witregels

Een lege regel maakt een nieuwe alinea:

```md
Dit is de eerste alinea.

Dit is de tweede alinea.
```

### Nieuwe regels in een gedicht

Markdown voegt gewone regels standaard samen. Zet daarom **twee spaties aan het einde van iedere dichtregel**:

```md
Jong geleerd  
Oud gedaan  
Vaak bewust  
Soms spontaan
```

Een lege regel tussen twee groepen regels blijft een grotere witruimte, zoals tussen strofen.

### Tussenkoppen

Gebruik hekjes voor tussenkoppen. De hoofdtitel hoeft niet opnieuw in de tekst te staan; die komt al uit `title`.

```md
## Tussenkop

### Kleinere tussenkop
```

### Cursief en vet

```md
*cursief*

**vet**
```

### Onderstrepen en doorstrepen

Voor aansluiting op Bear is één tilde gekozen voor onderstrepen:

```md
~onderstreept~
```

Twee tildes betekenen, zoals in gewone Markdown, doorstrepen:

```md
~~doorgestreept~~
```

Onderstreepte tekst krijgt een dunne rode lijn in de stijl van de website.

### Markeren

De Bear-notatie met dubbele gelijktekens wordt ondersteund:

```md
Dit woord is ==gemarkeerd==.
```

Alle markeringen krijgen bewust dezelfde warme, lichtgele kleur. Er zijn geen verschillende markeerkleuren; zo blijft de vormgeving rustig en herkenbaar.

### Scheidingslijn

Zet `---` op een eigen regel, met een lege regel erboven en eronder:

```md
Tekst boven de lijn.

---

Tekst onder de lijn.
```

De lijn wordt subtiel en lichtgrijs weergegeven. De eerste twee regels met `---` in een bestand hebben een andere functie: die sluiten de frontmatter in.

### Links

```md
[Tekst van de link](https://voorbeeld.nl)
```

### Lijsten

```md
- Eerste punt
- Tweede punt

1. Eerste stap
2. Tweede stap
```

### Tabellen

```md
| Naam | Betekenis |
| --- | --- |
| Appel | Het kind |
| Boom | De ouder |
```

Tabellen krijgen bewust geen zware kaders. De kop heeft een donkere onderlijn en de rijen lichte scheidingslijnen, passend bij de rest van de site.

## Werken vanuit Bear

Tekst kan vanuit Bear naar een Markdown-bestand worden gekopieerd. Let daarna vooral op het volgende:

- Voeg altijd de frontmatter bovenaan toe.
- Verwijder een eventuele Bear-titel als die de titel uit de frontmatter onnodig herhaalt.
- Controleer bij gedichten de twee spaties aan het einde van iedere dichtregel.
- `~tekst~` wordt onderstreept, `~~tekst~~` wordt doorgestreept en `==tekst==` wordt gemarkeerd.
- Controleer tabellen en scheidingslijnen na publicatie even op de website.

## Automatisch een kaart maken

Voeg in de frontmatter dit veld toe:

```yaml
card: true
```

Tijdens de build wordt dan automatisch een PNG van **1080 × 1350 pixels** gemaakt in dezelfde papier-en-inktstijl als de website. De kaart bevat:

- de titel;
- het rode streepje;
- de tekst;
- de signatuur `Harm.` met rode punt.

Op de tekstpagina verschijnt onderaan de link **Download kaart**. Het bestand is ook rechtstreeks beschikbaar via:

```text
https://snaphaan.nl/cards/bestandsnaam.png
```

Een bestand met de naam `de-appel-en-de-boom.md` krijgt dus:

```text
https://snaphaan.nl/cards/de-appel-en-de-boom.png
```

De kaartgenerator verwijdert Markdown-opmaak en kiest op basis van de tekstlengte automatisch een passende lettergrootte. De functie is vooral bedoeld voor gedichten en korte gedachten. Controleer langere teksten altijd visueel; een volledig verhaal is meestal te lang voor één kaart.

Laat `card` weg of gebruik `card: false` wanneer geen kaart nodig is.

## Eerst als concept bewaren

Gebruik:

```yaml
draft: true
```

De tekst wordt dan wel in GitHub bewaard, maar niet gepubliceerd. Verander dit later in `draft: false` of verwijder de regel om de tekst zichtbaar te maken.

## Bewuste ontwerpkeuzes

- **Lettertype:** Crimson Pro, gekozen omdat het rustig leest voor zowel gedichten als langere verhalen en ook geschikt is voor boektekst.
- **Kleur:** warm papier, donkere inkt en één gedempt rood accent.
- **Rode punt:** de punt in `Harm.` is het vaste herkenningsteken op de website, Over-pagina en kaarten.
- **Rust:** tags staan onder de tekst; opmaak en tabellen zijn terughoudend; markeringen hebben één vaste kleur.
- **Chronologie:** de homepage is een eenvoudig archief, van nieuw naar oud.
- **Onafhankelijkheid:** de inhoud staat als gewone Markdown in deze repository en is daardoor niet opgesloten in een sociaal platform of publicatiesysteem.

## Andere vaste teksten aanpassen

De Over-pagina is bewust rechtstreeks in de website vastgelegd en staat hier:

```text
src/pages/over.astro
```

De grote tekst bovenaan de homepage staat in:

```text
src/pages/index.astro
```

Deze teksten zijn dus geen Markdown-berichten en worden alleen aangepast als de website zelf wordt gewijzigd.

## Lokaal bekijken

Voor lokaal ontwikkelen is Node.js nodig:

```sh
npm install
npm run dev
```

De volledige controle en productiebuild draait met:

```sh
npm run build
```

## Publicatie en hosting

Iedere wijziging op de `main`-branch start automatisch de workflow **Deploy to GitHub Pages**. Een groene workflow betekent dat de site is gebouwd en gepubliceerd. De website draait op `https://snaphaan.nl` en `www` verwijst naar hetzelfde domein.

De DNS-records staan bij TransIP. De e-mailrecords voor Fastmail staan los van de website en mogen bij wijzigingen aan de website-DNS niet worden verwijderd.
