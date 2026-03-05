#!/usr/bin/env node

import { readFile, writeFile, rename, readdir } from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

const INBOX = './inbox';
const OUTPUT = './public/dashboard.json';
const TEMP_OUTPUT = './public/dashboard.tmp.json';

/* ---------- helpers ---------- */

function extractPeriod(filename) {
  const match = filename.match(/_(\d{4}-\d{2})\.csv$/);
  return match ? match[1] : null;
}

async function readCSV(filePath) {
  const text = await readFile(filePath, 'utf8');
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

async function loadKPIsByFile(file) {
  const rows = parse(
    await readFile(path.join(INBOX, file), 'utf8'),
    { columns: true, skip_empty_lines: true }
  );

  return rows.map(r => ({
    id: r.metric,
    value: Number(r.value),
    period_end: r.period_end
  }));
}


function latestFile(prefix) {
  return readdir(INBOX)
    .then(files =>
      files
        .filter(f => f.startsWith(prefix))
        .sort()
        .pop()
    );
}

/* ---------- KPI loaders ---------- */

async function loadCirculationKPIs() {
  
  const currentFile = await latestFile('kpis_circulation_');
if (!currentFile) return [];

const period = extractPeriod(currentFile);      // e.g. 2026-01
const previousPeriod = `${Number(period.slice(0,4)) - 1}${period.slice(4)}`;
const previousFile = `kpis_circulation_${previousPeriod}.csv`;

const currentRows = await loadKPIsByFile(currentFile);
let previousRows = null;

try {
  previousRows = await loadKPIsByFile(previousFile);
} catch {
  previousRows = null;
}

  if (!file) return [];

  const rows = parse(
    await readFile(path.join(INBOX, file), 'utf8'),
    { columns: true, skip_empty_lines: true }
  );

  return rows.map(r => ({
    id: r.metric,
    label: r.metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Number(r.value)
  }));
}

function attachYoY(current, previous) {
  if (!previous) return current;

  const prev = previous.value;
  const curr = current.value;

  if (prev === 0) return current;

  return {
    ...current,
    comparison: {
      previous_value: prev,
      change: curr - prev,
      change_pct: ((curr - prev) / prev) * 100,
      period: previous.period_end
    }
  };
}

return currentRows.map(curr => {
  const prev = previousRows?.find(p => p.id === curr.id);
  return attachYoY(curr, prev);
});


async function loadCollectionKPIs() {
  const file = await latestFile('collection_metrics_');
  if (!file) return [];

  const rows = parse(
    await readFile(path.join(INBOX, file), 'utf8'),
    { columns: true, skip_empty_lines: true }
  );

  return rows.map(r => ({
    id: r.metric,
    label: r.metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Number(r.value)
  }));
}

/* ---------- Widget loaders ---------- */

async function loadEquityWidgets() {
  const file = await latestFile('equity_');
  if (!file) return [];

  const rows = parse(
    await readFile(path.join(INBOX, file), 'utf8'),
    { columns: true, skip_empty_lines: true }
  );

  const widgets = [];

  if (rows[0]?.branch) {
    widgets.push({
      id: 'loans_by_branch',
      type: 'line',
      title: 'Loans by Branch',
      data: rows.map(r => ({
        month: r.branch,
        value: Number(r.loans)
      }))
    });
  }

  if (rows[0]?.item_type) {
    widgets.push({
      id: 'loans_by_item_type',
      type: 'line',
      title: 'Loans by Item Type',
      data: rows.map(r => ({
        month: r.item_type,
        value: Number(r.loans)
      }))
    });
  }

  return widgets;
}

async function loadPerformanceKPIs() {
  const file = await latestFile('performance_');
  if (!file) return [];

  const rows = parse(
    await readFile(path.join(INBOX, file), 'utf8'),
    { columns: true, skip_empty_lines: true }
  );

  return rows.map(r => ({
    id: r.metric,
    label: r.metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Number(r.value)
  }));
}

async function loadKPIsForPeriod(prefix, period) {
  const file = `kpis_circulation_${period}.csv`;
  try {
    const rows = parse(
      await readFile(path.join(INBOX, file), 'utf8'),
      { columns: true, skip_empty_lines: true }
    );
    return rows;
  } catch {
    return null;
  }
}

function attachComparison(current, previous) {
  if (!previous) return current;

  const prevValue = Number(previous.value);
  const currValue = Number(current.value);

  return {
    ...current,
    comparison: {
      previous_value: prevValue,
      change: currValue - prevValue,
      change_pct: prevValue === 0
        ? null
        : ((currValue - prevValue) / prevValue * 100),
      period: previous.period_end
    }
  };
}


/* ---------- main ---------- */

async function buildDashboard() {
  const kpis = [
    ...(await loadCirculationKPIs()),
    ...(await loadCollectionKPIs()),
    ...(await loadPerformanceKPIs())
  ];

  const widgets = [
    ...(await loadEquityWidgets())
  ];

  if (!kpis.length) {
    throw new Error('No KPIs generated — aborting');
  }

  const dashboard = {
    meta: {
      generated_at: new Date().toISOString(),
      source: 'Koha CSV Email',
      schema_version: 1
    },
    kpis,
    widgets
  };

  await writeFile(TEMP_OUTPUT, JSON.stringify(dashboard, null, 2));
  await rename(TEMP_OUTPUT, OUTPUT);

  console.log(`Dashboard built successfully (${kpis.length} KPIs, ${widgets.length} widgets)`);
}

/* ---------- run ---------- */

buildDashboard().catch(err => {
  console.error('Dashboard build failed:', err.message);
  process.exit(1);
});
