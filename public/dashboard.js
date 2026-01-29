fetch('dashboard.json')
  .then(res => res.json())
  .then(data => {
    renderMeta(data.meta);
    renderKPIs(data.kpis);
    renderWidgets(data.widgets);
  });

function renderMeta(meta) {
  document.getElementById('last-updated').textContent =
    `Last updated: ${new Date(meta.generated_at).toLocaleString()}`;
}

function renderKPIs(kpis) {
  const container = document.getElementById('kpis');
  container.innerHTML = '';

  kpis.forEach(kpi => {
    const div = document.createElement('div');
    div.className = 'kpi';
    div.innerHTML = `
      <div class="kpi-label">${kpi.label}</div>
      <div class="kpi-value">${kpi.value.toLocaleString()}</div>
    `;
    container.appendChild(div);
  });
}

function renderWidgets(widgets) {
  const container = document.getElementById('widgets');

  widgets.forEach(widget => {
    if (widget.type === 'line') {
      renderLineWidget(widget, container);
    }
  });
}

function renderLineWidget(widget, container) {
  const div = document.createElement('div');
  div.className = 'widget';

  const title = document.createElement('h2');
  title.textContent = widget.title;

  const list = document.createElement('ul');
  widget.data.forEach(point => {
    const li = document.createElement('li');
    li.textContent = `${point.month}: ${point.value.toLocaleString()}`;
    list.appendChild(li);
  });

  div.appendChild(title);
  div.appendChild(list);
  container.appendChild(div);
}
