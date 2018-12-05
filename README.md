# js-ws-3d-visualization-livecoding
Live coding repo.

## Autocomplete in VSCode for THREE.js

do http://shrekshao.github.io/2016/06/20/vscode-01/

and create `jsconfig.json`:

```
{
  "typeAcquisition": {
    "include": [
      "three"
    ]
  },
  "compilerOptions": {
    "target": "ES6",
    "module": "es6"
  },
  "exclude": [
    "assets/js/build",
    "assets/js/build-min",
    "assets/js/vendor",
    "node_modules"
  ]
}
```

Watch files and reload browser:

```
npm install -g browser-sync
browser-sync start --server --files *
```

Base map of Budapest: https://i.imgur.com/E8vbaRC.png
Noise map of Budapest: https://i.imgur.com/MtBe8P6.png

The final result is something similar on a 3D canvas: 

![a screenshot](https://github.com/jmalyik/js-ws-3d-visualization-livecoding/blob/master/screenshot.png)