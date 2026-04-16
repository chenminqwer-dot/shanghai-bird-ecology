import type { DatasetRecord } from '../types/dataset';

function normalizeCsvText(input: string): string {
  return input.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export function parseCsv(text: string): DatasetRecord[] {
  const normalized = normalizeCsvText(text);
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);

    return headers.reduce<DatasetRecord>((record, header, index) => {
      record[header] = values[index] ?? '';
      return record;
    }, {});
  });
}

export async function loadCsv(path: string): Promise<DatasetRecord[]> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${path}`);
  }

  const text = await response.text();
  return parseCsv(text);
}
