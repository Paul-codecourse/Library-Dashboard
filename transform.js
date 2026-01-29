import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csv = fs.readFileSync('kpis.csv', 'utf8');

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true
});

const dashboard = {
  meta: {
    generated_at: new Date().toISOString(),
    source: 'Koha'
  },
  kpis: records.map(r => ({
    id: r.metric,
    label: r.metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Number(r.value)
  })),
  widgets: []
};

fs.writeFileSync(
  'dashboard.json',
  JSON.stringify(dashboard, null, 2)
);