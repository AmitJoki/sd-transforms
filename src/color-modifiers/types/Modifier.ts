import { ColorModifierTypes } from './ColorModifierTypes';
import { ColorSpaceTypes } from './ColorSpaceTypes';

interface Modifier<T extends string, V> {
  type: T;
  value: V;
}
interface ColorGenericModifier<T extends ColorModifierTypes, V> extends Modifier<T, V> {
  space: ColorSpaceTypes;
  format?: ColorSpaceTypes;
}

export interface LightenModifier extends ColorGenericModifier<ColorModifierTypes.LIGHTEN, string> {}
export interface DarkenModifier extends ColorGenericModifier<ColorModifierTypes.DARKEN, string> {}
export interface MixModifier extends ColorGenericModifier<ColorModifierTypes.MIX, string> {
  color: string;
}
export interface AlphaModifier extends ColorGenericModifier<ColorModifierTypes.ALPHA, string> {}

export type ColorModifier = LightenModifier | DarkenModifier | MixModifier | AlphaModifier;
