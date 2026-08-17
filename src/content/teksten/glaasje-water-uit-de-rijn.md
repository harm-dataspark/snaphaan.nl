---
title: Glaasje water, uit de Rijn?
description: Over waarom AI voor analyses niet altijd rechtstreeks uit de bron moet drinken.
date: 2026-08-17
type: gedachte
tags:
  - technologie
  - AI
card: false
draft: false
---

De Rijn is, net als de Maas, een belangrijke leverancier van ons drinkwater in Nederland. Maar als ik je zou vragen om even een lekker glas water rechtstreeks uit de Rijn te drinken, het is immers de bron, dan verklaar je me hopelijk voor gek.

Het water uit de rivieren is, op het moment dat het Nederland heeft bereikt, niet geschikt om direct te consumeren. Voordat het bij ons uit de kraan komt, wordt het daarom zorgvuldig gereinigd door drinkwaterbedrijven. Een proces dat weken tot maanden kan duren.

Met data doen we eigenlijk iets vergelijkbaars.

De laatste tijd hoor en zie ik steeds vaker dat mensen bedrijfskritische beslissingen willen nemen op basis van data die rechtstreeks uit de bron komt. En dat terwijl brondata en bruikbare informatie niet hetzelfde zijn.

Het probleem is daarbij niet eens dat de data in een bronsysteem per definitie fout is. Een order in je ERP-systeem kan volkomen correct zijn. Een deal in je CRM ook. Maar voordat je op basis van duizenden van die orders en deals uitspraken kunt doen over bijvoorbeeld je brutomarge, cashflow of *monthly recurring revenue*, is er vaak meer nodig.

En juist daar ontstaat door de opkomst van AI iets interessants.

## Rechtstreeks naar de bron

Mede door de opkomst van MCP-servers wordt het steeds eenvoudiger om chatbots als Claude, ChatGPT en Copilot rechtstreeks te verbinden met je CRM, ERP en andere applicaties.

Dat is fantastisch, zeker vanuit technologisch perspectief. De mogelijkheden zijn bijna oneindig. Of het nu gaat om het automatisch aanmaken van een gespreksverslag, het controleren van een order of het boeken van uren: als het bronsysteem het toestaat, weet je AI-vriend er wel raad mee.

Voor dat soort toepassingen geloof ik ook absoluut in een rechtstreekse verbinding.

Maar het wordt een ander verhaal wanneer je dezelfde verbinding gaat gebruiken om vragen te beantwoorden als:

*Wat was onze brutomarge vorige maand?*

*Hoe ontwikkelt onze MRR zich?*

*Welke klanten zijn het meest winstgevend?*

*Hoe ziet onze verwachte cashflow voor de komende drie maanden eruit?*

Je kunt een AI-model toegang geven tot alle onderliggende gegevens en het vervolgens zelf laten uitzoeken. De kans is zelfs groot dat er uiteindelijk een mooi en kloppend overzicht uit komt.

Maar ik denk niet dat dit de beste manier is.

Daar zijn wat mij betreft vier redenen voor.

## 1. Businesslogica

"Kun je even een overzicht van de brutomarge maken?"

Het klinkt eenvoudig en in de basis is het dat ook. Je neemt de omzet en trekt daar de kostprijs vanaf.

Maar wat als in het bronsysteem alleen de inkoopprijs staat, terwijl binnen het bedrijf is afgesproken om voor de margeberekening de *landed cost price* te gebruiken? En daarvoor eerst een aparte berekening moet worden uitgevoerd met gegevens uit een ander systeem?

Of misschien moeten bepaalde klanten worden samengevoegd. Sommige omzetrekeningen juist niet worden meegenomen. Intercompany-transacties worden uitgesloten. Of abonnementen met een bepaalde status tellen binnen jullie definitie van MRR anders mee.

In vrijwel alle dashboards die wij de afgelopen tien jaar hebben gemaakt, hebben we ergens bedrijfsspecifieke logica toegepast. Soms heel eenvoudig, soms behoorlijk complex.

Zonder die logica is de onderliggende data niet noodzakelijk fout. Maar het antwoord op de bedrijfsvraag kan dat wel zijn.

En natuurlijk kun je die logica uitleggen aan een AI-model. Je kunt een uitgebreide prompt maken waarin precies staat hoe de brutomarge moet worden berekend.

Maar dan ontstaat een nieuwe vraag: waar leg je die definitie vast?

Want als Finance morgen dezelfde vraag aan ChatGPT stelt, Sales hem aan Claude stelt en het management naar een dashboard in Power BI of Qlik kijkt, wil je niet drie verschillende definities van brutomarge hebben.

Businesslogica hoort wat mij betreft daarom niet alleen in een prompt thuis. Je wilt die logica centraal vastleggen, zodat iedere toepassing dezelfde definitie gebruikt.

## 2. Security en privacy

Wanneer een externe applicatie toegang moet krijgen tot bijvoorbeeld Exact Online, wordt daarvoor regelmatig een gebruiker met veel of zelfs alle rechten ingezet.

Superhandig. Je hoeft geen aparte gebruiker met beperkte rechten in te richten en weet zeker dat de koppeling overal bij kan.

Maar die gebruiker kan dus ook overal bij.

Als dezelfde rechten vervolgens worden gebruikt om een chatbot toegang te geven, kan er onbedoeld een achterdeur ontstaan. Een medewerker die in Exact Online zelf geen salarissen, managementfees of BSN's mag bekijken, zou die informatie mogelijk via een chatbot alsnog kunnen opvragen.

Niet omdat iemand bewust de beveiliging omzeilt, maar simpelweg omdat de chatbot meer rechten heeft dan de persoon die de vraag stelt.

Bij een centrale datalaag kun je veel preciezer bepalen welke gegevens beschikbaar worden gesteld voor analyse. Gevoelige gegevens kunnen worden weggelaten, geanonimiseerd of alleen toegankelijk worden gemaakt voor specifieke toepassingen of gebruikers.

## 3. Limieten en performance

Als je bronsysteem relatief weinig records bevat, zal dit niet snel een probleem zijn. Maar zodra de hoeveelheid data groeit, kan rechtstreeks analyseren op de bron behoorlijk inefficiënt worden.

Neem bijvoorbeeld een CRM-systeem waarin in de loop der jaren 40.000 tickets zijn opgebouwd. Als een API maximaal 100 records per aanvraag teruggeeft, zijn honderden API-calls nodig voordat alle data überhaupt beschikbaar is voor de analyse.

En dan moet de analyse nog beginnen.

Stelt een collega een uur later een soortgelijke vraag, dan begint het proces mogelijk opnieuw.

API's van CRM- en ERP-systemen zijn bovendien in de eerste plaats gebouwd om met het betreffende systeem te werken. Ze hebben rate limits, paginering en andere beperkingen. Ze zijn meestal niet ontworpen om iedere analytische vraag over jaren aan historische gegevens steeds opnieuw te beantwoorden.

Waarom zou je diezelfde data iedere keer opnieuw uit de Rijn pompen als je haar ook één keer kunt opslaan op een plek die juist voor analyse is bedoeld?

## 4. Eén definitie van de waarheid

Dit vind ik misschien nog wel het belangrijkste punt.

Stel dat Finance aan ChatGPT vraagt wat de MRR is. Sales stelt dezelfde vraag aan Claude. Het management bekijkt de MRR in een Power BI-dashboard.

Krijgen ze dan allemaal hetzelfde antwoord?

Als iedere toepassing rechtstreeks naar de bron gaat en vervolgens zelf moet bepalen welke records nodig zijn en welke businesslogica moet worden toegepast, creëer je meerdere mogelijke versies van dezelfde waarheid.

Dat probleem bestond overigens al lang voordat ChatGPT bestond. We hebben jarenlang Excel-bestanden en dashboards gebouwd waarin dezelfde KPI op verschillende manieren werd berekend.

AI kan dat probleem oplossen, maar het kan het net zo makkelijk groter maken.

Daarom geloof ik dat definities als omzet, brutomarge, MRR, churn of actieve klant op één centrale plek moeten worden vastgelegd.

Niet omdat een AI-model die berekeningen niet kan maken.

Maar omdat je wilt dat het antwoord volgende week, bij een andere gebruiker en zelfs bij een ander AI-model nog steeds hetzelfde is.

## Een datalaag tussen de bron en AI

In plaats van voor iedere analytische vraag rechtstreeks naar de bron te gaan, geloof ik daarom in een centrale datalaag. Of een datawarehouse, als je het zo liever noemt.

Dat klinkt al snel groot, complex en duur, maar dat hoeft het helemaal niet te zijn.

In de basis is het niet veel meer dan een kopie van gegevens uit één of meerdere systemen die je op een centrale plek bij elkaar opslaat.

Zodra die gegevens daar staan, kun je ze opschonen, combineren en verrijken. Je kunt bedrijfsspecifieke logica toepassen en definities vastleggen. En het belangrijkste: je kunt die logica vervolgens steeds opnieuw gebruiken.

Je dashboard gebruikt dezelfde definitie van MRR als je rapportage. En je AI-assistent krijgt toegang tot diezelfde definitie.

Daarmee wordt die centrale datalaag meer dan alleen een plek waar je gegevens opslaat. Het wordt ook de plek waar je vastlegt **wat die gegevens binnen jouw organisatie betekenen**.

En daar zit voor mij het interessante verschil.

Wil je dat Claude een nieuwe deal aanmaakt in HubSpot? Laat Claude dan vooral met HubSpot praten.

Wil je dat ChatGPT een order controleert in Exact Online? Geef het toegang tot die order.

Maar wil je weten hoe je omzet zich ontwikkelt, welke klanten het meest winstgevend zijn of wat je MRR is?

Zorg eerst dat het water is gefilterd, verrijkt en gecontroleerd, voordat je besluit ervan te drinken.
