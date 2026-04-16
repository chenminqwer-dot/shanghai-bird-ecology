import type { DatasetDefinition } from '../types/dataset';

export const datasetDefinitions: DatasetDefinition[] = [
  {
    id: 'birdList',
    fileName: 'ERDP-2021-02.2.1-Bird_List.csv',
    path: '/data/ERDP-2021-02.2.1-Bird_List.csv',
    kind: 'master',
  },
  {
    id: 'localityInfo',
    fileName: 'ERDP-2021-02.3.1-Locality_Infor.csv',
    path: '/data/ERDP-2021-02.3.1-Locality_Infor.csv',
    kind: 'master',
  },
  {
    id: 'sourceList',
    fileName: 'ERDP-2021-02.5.1-Source_List.csv',
    path: '/data/ERDP-2021-02.5.1-Source_List.csv',
    kind: 'master',
  },
  {
    id: 'shanghaiSubset',
    fileName: 'Shanghai_Bird_Biodiversity.csv',
    path: '/data/Shanghai_Bird_Biodiversity.csv',
    kind: 'derived',
  },
];
