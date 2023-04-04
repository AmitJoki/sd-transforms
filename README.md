# Style Dictionary Transforms for Tokens Studio

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/sd-transforms) ![License badge](https://img.shields.io/github/license/tokens-studio/sd-transforms)

> This library is currently in beta.

This package contains custom transforms for [Style-Dictionary](https://amzn.github.io/style-dictionary/#/),
to work with Design Tokens that are exported from [Tokens Studio](https://tokens.studio/):

Generic:

- Maps token descriptions to comments -> `ts/descriptionToComment`
- Check and evaluate Math expressions (transitive) -> `ts/resolveMath`
- Transform dimensions tokens to have `px` as a unit when missing (transitive) -> `ts/size/px`
- Transform lineheight from `%` to unitless (150% -> 1.5) -> `ts/size/lineheight`
- Transform fontweight from keynames to fontweight numbers (100, 200, 300 ... 900) -> `ts/type/fontWeight`
- Transform color modifiers from Tokens Studio to color values -> `ts/color/modifiers`

CSS:

- Transform letterspacing from `%` to `em` -> `ts/size/css/letterspacing`
- Transform colors to `rgba()` format -> `ts/color/css/hexrgba`
- Transform typography objects to CSS shorthand -> `ts/typography/css/shorthand`
- Transform Tokens Studio shadow objects to CSS shadow shorthand -> `ts/shadow/css/shorthand`
- Transform border objects to CSS border shorthand -> `ts/border/css/shorthand`

Android:

- Transform typography objects to Android Compose shorthand -> `ts/typography/compose/shorthand`

Registers the **generic** and **CSS** transforms, in addition to `name/cti/camel` for naming purposes, as a transform group called `tokens-studio`.

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/sd-transforms
```

## Usage

> Note: this library is available both in CJS and ESM

```js
const { registerTransforms } = require('@tokens-studio/sd-transforms');

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms();
```

Can also import in ESM if needed.

### Using the transforms

In your Style-Dictionary config, you can **either** use the `tokens-studio` transformGroup **or** the separate transforms (all of the names of those are listed):

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "tokens-studio",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
```

More fine-grained control is possible, every transformation is available as a raw JavaScript function
for you to create your own Style-Dictionary transformer out of.

```js
const { transformDimension } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'my/size/px',
  type: 'value',
  transitive: true,
  matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
  transformer: token => transformDimension(token.value),
});
```

### Full example

```sh
node build-tokens.js
```

`build-tokens.js`:

```cjs
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

registerTransforms(StyleDictionary);

const sd = StyleDictionary.extend({
  source: ['**/*.tokens.json'],
  platforms: {
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'variables.js',
          format: 'javascript/es6',
        },
      ],
    },
    css: {
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/size/css/letterspacing',
        'ts/size/lineheight',
        'ts/type/fontWeight',
        'ts/resolveMath',
        'ts/typography/css/shorthand',
        'ts/border/css/shorthand',
        'ts/shadow/css/shorthand',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/cti/kebab',
      ],
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
```

> Note: make sure to choose either the full transformGroup, **OR** its separate transforms, so you can adjust or add your own.
> [Combining a transformGroup with a transforms array can give unexpected results](https://github.com/amzn/style-dictionary/issues/813).
