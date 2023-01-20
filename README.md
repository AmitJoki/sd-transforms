# Style Dictionary Transforms for Tokens Studio

This package contains 3 custom transforms for [Style-Dictionary](https://amzn.github.io/style-dictionary/#/),
to work with Design Tokens that are exported from [Tokens Studio](https://tokens.studio/):

- Transform dimensions tokens to have `px` as a unit when missing
- Transform Tokens Studio colors to `rgba()` format
- Transform Tokens Studio shadow objects to CSS shadow format
- Registers these transforms, in addition to `name/cti/camelCase` as a transform group called `tokens-studio`

## Usage

```js
import { registerTransforms } from '@tokens-studio/sd-transforms';

// will register them on StyleDictionary object
// that is installed as a dependency of this package,
// in most case this will be npm install deduped with your installation,
// thus being the same object as you use
registerTransforms();

// or pass your own StyleDictionary object to it in case the former doesn't work
registerTransforms(sdObject);
```

In your Style-Dictionary config:

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "js": {
      "transformGroup": "tokens-studio",
      "buildPath": "build/js/",
      "files": [
        {
          "destination": "variables.js",
          "format": "javascript/es6"
        }
      ]
    },
    "css": {
      "transformGroup": "tokens-studio",
      "transforms": ["name/cti/kebab"],
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

More fine-grained control:

```js
import module from 'module';
import { transformDimension } from '@tokens-studio/sd-transforms';

const require = module.createRequire(import.meta.url);
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'my/size/px',
  type: 'value',
  transitive: true,
  matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
  transformer: token => transformDimension(token.value),
});
```

### CommonJS

If you use CommonJS, no problem, you can use this package as CommonJS just fine!

```js
const { registerTransforms } = require('@tokens-studio/sd-transforms');
```
