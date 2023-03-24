import { expect } from '@esm-bundle/chai';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';
import path from 'path';
import { registerTransforms } from '../../src/registerTransforms.js';

const outputDir = 'test/integration/tokens/';
const outputFileName = 'vars.css';
const outputFilePath = path.resolve(outputDir, outputFileName);

const cfg = {
  source: ['test/integration/tokens/test.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      prefix: 'sd',
      buildPath: outputDir,
      files: [
        {
          destination: outputFileName,
          format: 'css/variables',
        },
      ],
    },
  },
};

let dict: StyleDictionary.Core | undefined;

describe('sd-transforms smoke tests', () => {
  function cleanup() {
    if (dict) {
      dict.cleanAllPlatforms();
    }
    delete StyleDictionary.transformGroup['tokens-studio'];
    Object.keys(StyleDictionary.transform).forEach(transform => {
      if (transform.startsWith('ts/')) {
        delete StyleDictionary.transform[transform];
      }
    });
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('supports tokens-studio tokens', async () => {
    registerTransforms(StyleDictionary);
    dict = StyleDictionary.extend(cfg);
    dict.buildAllPlatforms();
    const file = await promises.readFile(outputFilePath, 'utf-8');
    expect(file).to.include(`:root {
  --sdDimensionScale: 2;
  --sdDimensionXs: 4px;
  --sdDimensionSm: 8px;
  --sdDimensionMd: 16px;
  --sdDimensionLg: 32px;
  --sdDimensionXl: 64px;
  --sdSpacingSm: 8px;
  --sdSpacingXl: 64px;
  --sdSpacingMultiValue: 8px 64px; /* You can have multiple values in a single spacing token. Read more on these: https://docs.tokens.studio/available-tokens/spacing-tokens#multi-value-spacing-tokens */
  --sdColorsBlack: #000000;
  --sdColorsWhite: #ffffff;
  --sdColorsRed400: #f67474;
  --sdColorsRed500: #f56565;
  --sdColorsRed600: #dd5b5b;
  --sdLineHeightsHeading: 1.1;
  --sdLineHeightsBody: 1.4;
  --sdLetterSpacingDefault: 0;
  --sdLetterSpacingIncreased: 1.5em;
  --sdLetterSpacingDecreased: -0.05em;
  --sdFontWeightsHeadingRegular: 600;
  --sdFontWeightsHeadingBold: 700;
  --sdFontWeightsBodyRegular: 400;
  --sdFontSizesH6: 16px;
  --sdFontSizesBody: 16px;
  --sdShadow: 0 4 10 0 rgba(0,0,0,0.4);
}`);
  });
});
