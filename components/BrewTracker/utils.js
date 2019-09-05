// @flow

import {
  TASTE_BASE_PARTS,
  STRENGTH_BASE_PARTS,
  COFFEE_MULTIPLIER,
} from '../../lib/constants';

import { getCoffeeWeight } from '../../lib/conversion';

import { createLineSegments, stengthToSegments } from '../Range/Range';

export const convertTasteToWeight = (baseWeight: number, taste: number) => {
  const tasteWeight = baseWeight * COFFEE_MULTIPLIER * TASTE_BASE_PARTS;
  return [
    Math.round(tasteWeight * (taste / 100)),
    Math.round(tasteWeight * ((100 - taste) / 100)),
  ];
};

export const convertStrenghtToWeights = (
  baseWeight: number,
  strength: number,
): Array<number> => {
  const strenghtWeight = baseWeight * COFFEE_MULTIPLIER * STRENGTH_BASE_PARTS;
  const pours = createLineSegments(stengthToSegments(strength));
  return [...Array(pours.length + 1)].map((el, i, array) =>
    Math.round(strenghtWeight / array.length),
  );
};

export const getWeightSteps = (
  baseWeight: number,
  baseMesurement: Brew$UnitType,
  taste: number,
  strength: number,
) => {
  const coffeeWeight = getCoffeeWeight(baseWeight, baseMesurement);
  return [
    ...convertTasteToWeight(coffeeWeight, taste),
    ...convertStrenghtToWeights(coffeeWeight, strength),
  ];
};

export const getTimeToNextStep = (state: {}, time: number) => {
  const { pouringTimeTarget, waitingTimeTarget, activity } = state;

  if (activity === 'pouring') {
    return pouringTimeTarget - time;
  }
  if (activity === 'waiting') {
    return waitingTimeTarget - time;
  }
  return 0;
};
