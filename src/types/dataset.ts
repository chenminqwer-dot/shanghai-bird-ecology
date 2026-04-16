export type DatasetKey =
  | 'birdList'
  | 'localityInfo'
  | 'sourceList'
  | 'shanghaiSubset';

export type DatasetRecord = Record<string, string>;

export type DatasetSummary = {
  id: DatasetKey;
  path: string;
  kind: 'master' | 'derived';
  rowCount: number;
  columns: string[];
  records: DatasetRecord[];
};

export type DatasetDefinition = {
  id: DatasetKey;
  fileName: string;
  path: string;
  kind: 'master' | 'derived';
};
