import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import { useCsvDatasets } from './hooks/useCsvDatasets';
import { buildStoryData } from './utils/storyData';

const COLORS = {
  primary: '#1f4d3b',
  secondary: '#5f8f7d',
  accent: '#c8913b',
  pale: '#d8e6df',
  migrant: '#2f6a53',
  resident: '#c8913b',
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function App() {
  const { datasets, isLoading, error } = useCsvDatasets();
  const story = useMemo(() => buildStoryData(datasets), [datasets]);

  if (isLoading) {
    return (
      <div className="app-shell">
        <main className="poster-page">
          <section className="hero-panel">
            <p className="kicker">Loading data</p>
            <h1>Shanghai Bird Ecology</h1>
            <p>Preparing a static visual summary from the four CSV source tables.</p>
          </section>
        </main>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="app-shell">
        <main className="poster-page">
          <section className="hero-panel">
            <p className="kicker">Data error</p>
            <h1>Shanghai Bird Ecology</h1>
            <p>{error ?? 'Unable to derive the poster page from the current CSV files.'}</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="poster-page">
        <section className="hero-panel">
          <p className="kicker">Static data visualization page</p>
          <h1>{story.intro.title}</h1>
          <p className="hero-subtitle">{story.intro.subtitle}</p>
          <p className="hero-note">{story.intro.note}</p>
        </section>

        <section className="poster-section">
          <div className="section-heading">
            <p className="kicker">Overview</p>
            <h2>Dataset scope at a glance</h2>
          </div>
          <div className="summary-grid">
            {story.overview.map((item) => (
              <article key={item.label} className="summary-card">
                <p className="summary-label">{item.label}</p>
                <p className="summary-value">
                  {item.format === 'percent'
                    ? formatPercent(item.value)
                    : formatNumber(item.value)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="poster-section">
          <div className="section-heading">
            <p className="kicker">Park-level charts</p>
            <h2>How the Shanghai parks compare</h2>
          </div>
          <div className="chart-grid chart-grid--three">
            <article className="chart-card">
              <h3>Species count by park</h3>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={story.parkCharts.speciesByPark}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 77, 59, 0.12)" />
                    <XAxis dataKey="shortPark" tick={{ fill: '#536a61', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#536a61', fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                    <Bar dataKey="speciesCount" fill={COLORS.primary} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card">
              <h3>Record count by park</h3>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={story.parkCharts.recordsByPark}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 77, 59, 0.12)" />
                    <XAxis dataKey="shortPark" tick={{ fill: '#536a61', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#536a61', fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                    <Bar dataKey="recordCount" fill={COLORS.secondary} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card">
              <h3>Migrant share by park</h3>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={story.parkCharts.migrantShareByPark}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 77, 59, 0.12)" />
                    <XAxis dataKey="shortPark" tick={{ fill: '#536a61', fontSize: 12 }} />
                    <YAxis
                      tick={{ fill: '#536a61', fontSize: 12 }}
                      tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
                    />
                    <Tooltip formatter={(value: number) => formatPercent(value)} />
                    <Bar dataKey="migrantRatio" fill={COLORS.accent} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </section>

        <section className="poster-section">
          <div className="section-heading">
            <p className="kicker">Taxonomy and migration</p>
            <h2>Family structure, migratory balance, and park composition</h2>
          </div>
          <div className="chart-grid chart-grid--taxonomy">
            <article className="chart-card">
              <h3>Top 10 families by species count</h3>
              <div className="chart-area chart-area--tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...story.taxonomy.familyTop10].reverse()}
                    layout="vertical"
                    margin={{ top: 0, right: 8, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 77, 59, 0.12)" />
                    <XAxis type="number" tick={{ fill: '#536a61', fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="family"
                      width={92}
                      tick={{ fill: '#536a61', fontSize: 12 }}
                    />
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                    <Bar dataKey="speciesCount" fill={COLORS.primary} radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card">
              <h3>Migratory type share</h3>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={story.taxonomy.migrationShare}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={58}
                      outerRadius={98}
                      paddingAngle={3}
                    >
                      {story.taxonomy.migrationShare.map((entry) => (
                        <Cell
                          key={entry.label}
                          fill={
                            entry.label === 'Migrant species'
                              ? COLORS.migrant
                              : COLORS.resident
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="legend-row">
                {story.taxonomy.migrationShare.map((entry) => (
                  <div key={entry.label} className="legend-item">
                    <span
                      className="legend-swatch"
                      style={{
                        background:
                          entry.label === 'Migrant species'
                            ? COLORS.migrant
                            : COLORS.resident,
                      }}
                    />
                    <span>
                      {entry.label}: {formatNumber(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="chart-card">
              <h3>Migrant and resident species by park</h3>
              <div className="chart-area chart-area--tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={story.taxonomy.migrantResidentByPark}
                    margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 77, 59, 0.12)" />
                    <XAxis dataKey="shortPark" tick={{ fill: '#536a61', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#536a61', fontSize: 12 }} />
                    <Legend />
                    <Tooltip formatter={(value: number) => formatNumber(value)} />
                    <Bar
                      dataKey="residentSpeciesCount"
                      name="Resident species"
                      stackId="composition"
                      fill={COLORS.resident}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="migrantSpeciesCount"
                      name="Migrant species"
                      stackId="composition"
                      fill={COLORS.migrant}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </section>

        <section className="poster-section">
          <div className="section-heading">
            <p className="kicker">Relationship matrix</p>
            <h2>Park by migratory type richness</h2>
          </div>
          <div className="matrix-card">
            <div className="matrix-grid">
              {story.matrix.map((cell) => (
                <article key={`${cell.park}-${cell.type}`} className="matrix-cell">
                  <p className="matrix-cell-label">{cell.park}</p>
                  <p className="matrix-cell-type">{cell.type}</p>
                  <div
                    className="matrix-swatch"
                    style={{
                      backgroundColor:
                        cell.type === 'Migrant species'
                          ? `rgba(47, 106, 83, ${0.12 + cell.intensity * 0.88})`
                          : `rgba(200, 145, 59, ${0.12 + cell.intensity * 0.88})`,
                    }}
                  />
                  <p className="matrix-cell-value">{formatNumber(cell.value)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="poster-section">
          <div className="section-heading">
            <p className="kicker">Findings</p>
            <h2>Short observations derived from the data</h2>
          </div>
          <div className="findings-grid">
            {story.findings.map((finding) => (
              <article key={finding.title} className="finding-card">
                <h3>{finding.title}</h3>
                <p>{finding.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <p className="page-footer-title">Source files</p>
        <ul className="source-list">
          {story.footerFiles.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
