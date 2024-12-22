import { LocalStorageItemsEnum } from './../models-constants-enums/enumerations';
import { defaultBetSpreads } from './bet-spread-strategies';
import { allDefaultConditions } from './conditions';
import { defaultCounts } from './counting-methods';
import { defaultInsurancePlans } from './insurance-plan';
import { defaultPlay } from './play-strategies';
import { defaultPlayers } from './player-config';
import { defaultTables } from './table-config';
import { defaultTippingPlans } from './tipping-plan';
import { defaultUnitResizings } from './unit-resize-strategies';
import { defaultWongings } from './wonging-strategies';

export const strategyConfigStorageEnumMap: any = {
  [LocalStorageItemsEnum.BET_SPREAD]: defaultBetSpreads,
  [LocalStorageItemsEnum.CONDITIONS]: allDefaultConditions,
  [LocalStorageItemsEnum.COUNT]: defaultCounts,
  [LocalStorageItemsEnum.PLAY]: defaultPlay,
  [LocalStorageItemsEnum.PLAYER_CONFIG]: defaultPlayers,
  [LocalStorageItemsEnum.TABLE_CONFIG]: defaultTables,
  [LocalStorageItemsEnum.TIPPING]: defaultTippingPlans,
  [LocalStorageItemsEnum.UNIT_RESIZE]: defaultUnitResizings,
  [LocalStorageItemsEnum.WONG]: defaultWongings,
  [LocalStorageItemsEnum.INSURANCE]: defaultInsurancePlans,
}