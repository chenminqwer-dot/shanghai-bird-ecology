import { useEffect, useState } from 'react';
import { datasetDefinitions } from '../data/datasets';
import type { DatasetSummary } from '../types/dataset';
import { loadCsv } from '../utils/csv';

type DatasetState = {
  datasets: DatasetSummary[];
  isLoading: boolean;
  error: string | null;
};

export function useCsvDatasets() {
  const [state, setState] = useState<DatasetState>({
    datasets: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchDatasets() {
      try {
        const datasets = await Promise.all(
          datasetDefinitions.map(async (dataset) => {
            const records = await loadCsv(dataset.path);
            const columns = Object.keys(records[0] ?? {});

            return {
              id: dataset.id,
              path: dataset.path,
              kind: dataset.kind,
              rowCount: records.length,
              columns,
              records,
            };
          }),
        );

        if (isMounted) {
          setState({
            datasets,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            datasets: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    fetchDatasets();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
