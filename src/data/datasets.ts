import type { DatasetDefinition } from '../types/dataset';

const dataBasePath = `${import.meta.env.BASE_URL}data/`;

export const datasetDefinitions: DatasetDefinition[] = [
  {
    id: 'birdList',
    fileName: 'ERDP-2021-02.2.1-Bird_List.csv',
    path: `${dataBasePath}ERDP-2021-02.2.1-Bird_List.csv`,
    kind: 'master',
  },
  {
    id: 'localityInfo',
    fileName: 'ERDP-2021-02.3.1-Locality_Infor.csv',
    path: `${dataBasePath}ERDP-2021-02.3.1-Locality_Infor.csv`,
    kind: 'master',
  },
  {
    id: 'sourceList',
    fileName: 'ERDP-2021-02.5.1-Source_List.csv',
    path: `${dataBasePath}ERDP-2021-02.5.1-Source_List.csv`,
    kind: 'master',
  },
  {
    id: 'shanghaiSubset',
    fileName: 'Shanghai_Bird_Biodiversity.csv',
    path: `${dataBasePath}Shanghai_Bird_Biodiversity.csv`,
    kind: 'derived',
  },
];
