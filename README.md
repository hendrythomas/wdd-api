# wdd-api

Web APIs:
*  Canvas, CanvasRenderingContext2D
*  PIP
*  Storage
*  File
*  Camera

Content APIs:
*  Random cats: [CATAAS](https://cataas.com/)
*  Random dogs: [DaaS](https://dog.ceo/dog-api/)
*  Random ducks: [Random-d.uk](https://random-d.uk/api)
*  YouTube search results: [Search: list](https://developers.google.com/youtube/v3/docs/search/list)


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

Omdat buttons dynamisch worden ingeladen, kan ik geen IDs gebruiken. Andere mogelijkheden zijn `onclick` en `data`.

In de toekomst wil ik misschien meerdere buttons met dezelfde functionaliteit. Daarom gebruik ik `data`:

```html
<button data-do=""></button>
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

### Dynamic content

### Tekst

omdat tekst meerdere plekken
`data-insert`

title, is finished

### Items

template

geen components


## Bronnen

*  Astro Actions:
   *  https://docs.astro.build/en/guides/actions/
   *  https://docs.astro.build/en/reference/configuration-reference/
   *  https://docs.astro.build/en/guides/integrations-guide/node/