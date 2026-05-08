# wdd-api

Web APIs:
*  Canvas, CanvasRenderingContext2D
*  Storage
*  File
*  Camera, Media Stream
*  Popover

Content APIs:
*  Random cats: [CATAAS](https://cataas.com/)
*  Random dogs: [DaaS](https://dog.ceo/dog-api/)
*  Random ducks: [Random-d.uk](https://random-d.uk/api)
*  ~~YouTube search results: [Search: list](https://developers.google.com/youtube/v3/docs/search/list)~~


## Dag 1

### Log

*  Over Astro geleerd

Ik had een probleem met het updaten van node.js. Morgen wil ik mijn achterstand inhalen en mijn idee bedenken.

### Morgen

*  Astro leren
*  Nieuw idee ontwerpen


## Dag 2

*  Nieuw idee ontworpen
*  Youtube API key aangevraagd

Ik heb vandaag geleerd hoe je pagina's kan aanmaken in astro.

### Morgen

*  Layout maken


## Dag 3

*  HTML + CSS layout gemaakt
*  Geleerd over Astro components
*  App architectuur ontworpen

### Checkout

*  Om TypeScript errors uit te zetten kan je `// @ts-nocheck` gebruiken

### Morgen

*  Beginnen aan API's in JavaScript


## Dag 4

*  Onderzocht hoe je functies op de server uitvoert ([#ontwerp](#Ontwerp))
*  Astro actions tutorial uitgevoerd ([#bron](#Bronnen))


## Dag 5

*  Architectuur ontworpen ([#ontwerp](#Ontwerp)):
   *  Ingeladen buttons
      *  `data`
      *  `template`
   *  Inladen info in UI
      *  `data`
*  API voor foto's

## Morgen

*  Meer foto API's toevoegen


## Dag 6

*  Meer foto API's toegevoegd
*  Gewerkt aan foto select; geleerd over:
   *  `popover`
   *  `<select>`

Geen checkout


## Dag 7

*  Canvas API
*  Storage API
   *  Save
   *  Delete

Geen checkout


## Dag 8

*  Tekenen op canvas
   *  CanvasRenderingContext2D
*  File upload
   *  File API
*  ENV aangemaakt
*  Youtube API geleerd

Geen checkout


## Dag 9

Render geleerd

## Volgende keer

*  Meer pagina's toevoegen


## Dag 10

*  Render probleem opgelost
*  Details pagina toegevoegd
*  Kijken naar components


## Dag 11

### Feedback

*  Detailspagina = landingspagina
   *  Mag zelf ontwerpen
   *  Route omwisselen met app
*  Focus op web API camera, dan YouTube API
   *  Video PIP gebruiken?

## Volgende keer

*  Gallerij op landingspagina
*  Camera API

## Dag 12

*  LocalStorage gebruikt voor gallerij ([ontwerp](#Ontwerp))
*  Camera API geïmplementeerd


## Ontwerp

### Frontend

*  Canvas
*  Reference image (overlay)
*  Tutorial (PIP)
*  Drawing list
   *  Dynamisch ingeladen

### Backend

*  Drawing list
   *  Opgeslagen naar local storage

### Buttons

Omdat buttons dynamisch worden ingeladen, kan ik geen Components gebruiken. Andere mogelijkheden zijn `id`, `onclick` en `data`.

In de toekomst wil ik misschien meerdere buttons met dezelfde functionaliteit. Daarom gebruik ik `data`:

```html
<button data-do="open-drawing"></button>
```

Deze buttons kunnen dan gekoppeld worden met event listeners:

```js
document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'open-drawing':
      openDrawing(e);
      break;
    case 'delete-drawing':
      deleteDrawing();
      break;
  }
});
```

### Calling server functions

Voor deze app moeten functies pas worden uitgevoerd als de gebruiker op een button klikt. In Astro kan dit met Actions ([bronnen](#Bronnen)). Bijvoorbeeld:

```js
import { defineAction } from 'astro:actions';

export const server = {
  getCatUrl: defineAction({
    handler: async () => {
      const url = 'https://cataas.com/cat?json=true';
      const response = await fetch(url);
      const result = await response.json();
      const imageUrl = result.url;
      return imageUrl;
    }
  })
}
```
```js
const refUrlResult = await actions.getCatUrl();
refUrl = refUrlResult.data;
title = 'Cat';

const newDrawing = new Drawing(
 menuId, title, null, false, refUrl
);
```

#### Render security

Op Render kreeg ik eerst een CORS error als APIs werden opgehaald.

Ik herkende deze error. Omdat mijn setup hetzelfde was lag dit waarschijnlijk aan Astro Actions.

Ik heb de volgende aanpassing gemaakt in de Astro config volgens de documentatie ([bronnen](#Bronnen)):

```js
server: { host: true },
security: { checkOrigin: false }
```

### Dynamic content

Voor de items en gallerij wilde ik eerst components met JavaScript in de HTML gebruiken. Maar dit is niet mogelijk, omdat deze dynamisch moeten worden ingeladen (van local storage).

Het wordt nu volledig met JavaScript gegenereerd:

```js
for (const drawing of drawings) {
  if (drawing.piece !== null) {
    const pieceElem = document.createElement('img');
    pieceElem.src = drawing.piece;
    galleryElem.append(pieceElem);
  }
}
```

Voor items gebruik ik HTML templates, zodat het makkelijker te bewerken is. Deze krijgen tekst via data (zie [#tekst](#tekst))

### Tekst

Omdat dezelfde tekst misschien meerdere plekken moet worden laten zien, heb ik hiervoor weer `data` gebruikt:

```html
<span class="label">
  <span class="before">Drawing: </span>
  <span data-insert="current-title"></span>
</span>
```

### Items

Item elementen krijgen de volgende data van storage:

*  title
*  is finished

Omdat ik maar 1 pagina heb, en items dynamisch moeten kunnen worden ingeladen, kan ik geen Astro components gebruiken. In plaats daarvan heb ik `template` gebruikt.

Dit gebruik ik zo in JavaScript:

```js
const templateMenuItemElems = document.getElementById('template-menu-item').content.children;
if (templateMenuItemElems === null) return;

const itemElem = templateMenuItemElems[0].cloneNode(true);

menuElem.append(itemElem);
```


## Bronnen

*  Astro Actions:
   *  https://docs.astro.build/en/guides/actions/
   *  https://docs.astro.build/en/reference/configuration-reference/
   *  https://docs.astro.build/en/guides/integrations-guide/node/
   *  https://docs.astro.build/en/reference/configuration-reference/#security
*  MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript
*  `getUserMedia()` https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia