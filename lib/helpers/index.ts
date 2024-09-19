import { Maybe, Section } from "../types";

const isSectionArray = (arr: Maybe<Section>[]): arr is Section[] =>
  arr.every((item): item is Section => item !== null);

export { isSectionArray };
