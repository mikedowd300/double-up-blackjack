import { 
  DealerRecord, 
  HandRecord,
  PlayerRecord, 
  SpotRecord, 
  TableRecord 
} from "./history-models";

export class History {
  records: TableRecord[] = [];
  activeRecord: TableRecord;
  recordId: number = 0;
  activePlayers: PlayerRecord[];

  constructor(){}

  createNewRecord(): void {
    this.activePlayers = [];
    this.activeRecord = {
      roundId: this.recordId,
      spots: [],
      players: [],
      dealer: null,
    }
    this.recordId += 1;
  }

  getDealerRecord(record: DealerRecord): void {
    this.activeRecord.dealer = { ...record };
  }

  addSpotsRecordWithEmptyHands(spot: SpotRecord): void {
    this.activeRecord.spots.push(spot);
  }

  addHandRecordToSpotRecordById(id: number, hand: HandRecord): void {
    let activeSpot = this.activeRecord.spots.find(s => s?.spotId === id);
    activeSpot.hands.push(hand);
  }

  addPlayersRecord(player: PlayerRecord): void {
    this.activeRecord.players.push(player);
  }

  finalizeRecord(): void {
    this.records.push(this.activeRecord);
  }
}