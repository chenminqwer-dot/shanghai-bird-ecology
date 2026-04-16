import type { DatasetSummary } from '../types/dataset';

type SummaryCard = {
  label: string;
  value: number;
  format: 'number' | 'percent';
};

type Insight = {
  title: string;
  text: string;
};

type ParkChartDatum = {
  park: string;
  shortPark: string;
  speciesCount: number;
  recordCount: number;
  migrantSpeciesCount: number;
  residentSpeciesCount: number;
  migrantRatio: number;
};

type MatrixDatum = {
  park: string;
  type: 'Migrant species' | 'Resident species';
  value: number;
  intensity: number;
};

export type StoryData = {
  intro: {
    title: string;
    subtitle: string;
    note: string;
  };
  overview: SummaryCard[];
  parkCharts: {
    speciesByPark: ParkChartDatum[];
    recordsByPark: ParkChartDatum[];
    migrantShareByPark: ParkChartDatum[];
  };
  taxonomy: {
    familyTop10: Array<{ family: string; speciesCount: number }>;
    migrationShare: Array<{ label: string; value: number }>;
    migrantResidentByPark: ParkChartDatum[];
  };
  matrix: MatrixDatum[];
  findings: Insight[];
  footerFiles: string[];
};

function compareByName(a: string, b: string) {
  return a.localeCompare(b, 'en');
}

function shortenParkName(name: string) {
  return name.replace(/^Shanghai\s+/i, '').replace(/\s+Park$/i, '');
}

function getDataset(datasets: DatasetSummary[], id: DatasetSummary['id']) {
  return datasets.find((dataset) => dataset.id === id);
}

export function buildStoryData(datasets: DatasetSummary[]): StoryData | null {
  const shanghai = getDataset(datasets, 'shanghaiSubset');
  const birdList = getDataset(datasets, 'birdList');
  const localityInfo = getDataset(datasets, 'localityInfo');
  const sourceList = getDataset(datasets, 'sourceList');

  if (!shanghai || !birdList || !localityInfo || !sourceList || shanghai.records.length === 0) {
    return null;
  }

  const parks = new Map<
    string,
    {
      species: Set<string>;
      records: number;
      migrantSpecies: Set<string>;
      residentSpecies: Set<string>;
    }
  >();
  const allSpecies = new Set<string>();
  const allFamilies = new Set<string>();
  const migrantSpeciesOverall = new Set<string>();
  const residentSpeciesOverall = new Set<string>();
  const families = new Map<string, Set<string>>();
  for (const record of shanghai.records) {
    const park = record.Locality?.trim();
    const species = record.ScientificName?.trim();
    const family = record.Family?.trim();
    const status = record.Bird_MigrantStatus?.trim();

    if (!park || !species) {
      continue;
    }

    if (!parks.has(park)) {
      parks.set(park, {
        species: new Set<string>(),
        records: 0,
        migrantSpecies: new Set<string>(),
        residentSpecies: new Set<string>(),
      });
    }

    const parkEntry = parks.get(park)!;
    parkEntry.records += 1;
    parkEntry.species.add(species);
    allSpecies.add(species);

    if (family) {
      allFamilies.add(family);
      if (!families.has(family)) {
        families.set(family, new Set<string>());
      }
      families.get(family)!.add(species);
    }

    if (status === 'M') {
      parkEntry.migrantSpecies.add(species);
      migrantSpeciesOverall.add(species);
    } else {
      parkEntry.residentSpecies.add(species);
      residentSpeciesOverall.add(species);
    }
  }

  const parkData = Array.from(parks.entries())
    .map(([park, entry]) => ({
      park,
      shortPark: shortenParkName(park),
      speciesCount: entry.species.size,
      recordCount: entry.records,
      migrantSpeciesCount: entry.migrantSpecies.size,
      residentSpeciesCount: entry.residentSpecies.size,
      migrantRatio: entry.species.size === 0 ? 0 : entry.migrantSpecies.size / entry.species.size,
    }))
    .sort((a, b) => compareByName(a.park, b.park));

  const matrixMax = Math.max(
    ...parkData.flatMap((item) => [item.migrantSpeciesCount, item.residentSpeciesCount]),
    1,
  );

  const richestPark = [...parkData].sort((a, b) => b.speciesCount - a.speciesCount)[0];
  const highestMigrantPark = [...parkData].sort((a, b) => b.migrantRatio - a.migrantRatio)[0];
  const mostRecordsPark = [...parkData].sort((a, b) => b.recordCount - a.recordCount)[0];
  const topFamily = [...families.entries()]
    .map(([family, species]) => ({ family, speciesCount: species.size }))
    .sort((a, b) => b.speciesCount - a.speciesCount || compareByName(a.family, b.family))[0];
  return {
    intro: {
      title: 'Shanghai Bird Ecology',
      subtitle:
        'A static visual storytelling page built directly from four CSV tables in this repository.',
      note:
        'All values on this page are derived from ERDP-2021-02.2.1-Bird_List.csv, ERDP-2021-02.3.1-Locality_Infor.csv, ERDP-2021-02.5.1-Source_List.csv, and Shanghai_Bird_Biodiversity.csv.',
    },
    overview: [
      { label: 'Parks', value: parkData.length, format: 'number' },
      { label: 'Species', value: allSpecies.size, format: 'number' },
      { label: 'Families', value: allFamilies.size, format: 'number' },
      {
        label: 'Migrant share',
        value: allSpecies.size === 0 ? 0 : migrantSpeciesOverall.size / allSpecies.size,
        format: 'percent',
      },
      {
        label: 'Total records',
        value: datasets.reduce((sum, dataset) => sum + dataset.rowCount, 0),
        format: 'number',
      },
      { label: 'Source tables', value: datasets.length, format: 'number' },
    ],
    parkCharts: {
      speciesByPark: parkData,
      recordsByPark: parkData,
      migrantShareByPark: parkData,
    },
    taxonomy: {
      familyTop10: [...families.entries()]
        .map(([family, species]) => ({ family, speciesCount: species.size }))
        .sort((a, b) => b.speciesCount - a.speciesCount || compareByName(a.family, b.family))
        .slice(0, 10),
      migrationShare: [
        { label: 'Migrant species', value: migrantSpeciesOverall.size },
        { label: 'Resident species', value: residentSpeciesOverall.size },
      ],
      migrantResidentByPark: parkData,
    },
    matrix: parkData.flatMap((item) => [
      {
        park: item.shortPark,
        type: 'Migrant species' as const,
        value: item.migrantSpeciesCount,
        intensity: item.migrantSpeciesCount / matrixMax,
      },
      {
        park: item.shortPark,
        type: 'Resident species' as const,
        value: item.residentSpeciesCount,
        intensity: item.residentSpeciesCount / matrixMax,
      },
    ]),
    findings: [
      {
        title: 'Species richness peaks at Shanghai Bay Forest Park',
        text: `${richestPark.park} records ${richestPark.speciesCount} species, the highest count in the Shanghai subset.`,
      },
      {
        title: 'Migrants make up most species in the subset',
        text: `${migrantSpeciesOverall.size} of ${allSpecies.size} species are marked as migrant, a share of ${Math.round((migrantSpeciesOverall.size / allSpecies.size) * 100)}%.`,
      },
      {
        title: 'The same park leads both richness and raw records',
        text: `${mostRecordsPark.park} contributes ${mostRecordsPark.recordCount} records and also ranks first in species richness.`,
      },
      {
        title: 'Ardeidae is the widest family group',
        text: `${topFamily.family} contains ${topFamily.speciesCount} distinct species in the Shanghai subset, more than any other family.`,
      },
      {
        title: 'Migrant ratios vary, but all parks show mixed communities',
        text: `${highestMigrantPark.park} has the highest migrant ratio at ${Math.round(highestMigrantPark.migrantRatio * 100)}%, while every park still includes both migrant and resident species.`,
      },
    ].slice(0, 5),
    footerFiles: datasets.map((dataset) => dataset.path.split('/').pop() ?? dataset.path),
  };
}
