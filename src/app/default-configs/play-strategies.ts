import { PlayStrategy } from "../models-constants-enums/models";
import { basicS17Strategy } from './play-strategies/basic-s17';
import { basicH17Strategy } from './play-strategies/basic-h17';
import { illustriousH17Strategy } from './play-strategies/illustrious-h17';
import { illustriousS17Strategy } from './play-strategies/illustrious-s17';
import { deviationFinder } from './play-strategies/deviation-finder';
import { heavy6DeviationsStrategy } from './play-strategies/heavy-6-h17-deviations';
import { heavy6Strategy } from './play-strategies/heavy-6-h17-basic';

export const playTitles: string[] = [
  "Basic H17",
  "Basic S17",
  "illustrious H17",
  "illustrious S17",
  "DeviationFinder",
  "Heavy 6 H17 Deviations",
  "Heavy 6 H17 Basic",
];

export const defaultPlay: { [k: string]: PlayStrategy } = {
  "Basic H17": basicH17Strategy,
  "Basic S17": basicS17Strategy,
  "illustrious H17": illustriousH17Strategy,
  "illustrious S17": illustriousS17Strategy,
  "deviationFinder": deviationFinder,
  "Heavy 6 H17 Deviations": heavy6DeviationsStrategy,
  "Heavy 6 H17 Basic": heavy6Strategy 
};