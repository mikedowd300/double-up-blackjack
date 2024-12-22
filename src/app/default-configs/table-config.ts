import { TableConfig } from "../models-constants-enums/models";

export const defaultTable: TableConfig = {
  title: "Default Table",
  players: [
    {
      seatNumber: 4,
      playerConfigTitle: 'Ploppy 1',
    },
    {
      seatNumber: 5,
      playerConfigTitle: 'Ploppy 2',
    }
  ],
  conditionsTitle: "Normal Conditions",
};

export const threeCountsTable: TableConfig = {
  title: "Three Counts Table",
  players: [
    {
      seatNumber: 1,
      playerConfigTitle: 'Hi Lo Jo',
    },
    {
      seatNumber: 4,
      playerConfigTitle: 'Heavy 6 Basic Bob',
    },
    {
      seatNumber: 7,
      playerConfigTitle: 'Heavy 6 Deviation Dan',
    }
  ],
  conditionsTitle: "Normal Conditions",
};

export const SinglePlayerBlitz: TableConfig = {
  title: "Single Player Blitz",
  players: [
    {
      seatNumber: 4,
      playerConfigTitle: "Blitz Barb",
    },
  ],
  conditionsTitle: "Normal Conditions",
};

export const tableTitles: string[] = [
  "Default Table",
  "Three Counts Table",
  "Single Player Blitz"
];

export  const defaultTables: { [k: string]: TableConfig } = {
  "Default Table": defaultTable,
  "Three Counts Table" : threeCountsTable,
  "Single Player Blitz": SinglePlayerBlitz
}