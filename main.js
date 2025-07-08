import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm';

let textData = [];
let metadata = {};

async function loadCsv(url) {
  const response = await fetch(url);
  const csvText = await response.text();
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data)
    });
  });
}

async function init() {
  textData = await loadCsv('/kwic_ballad/public/merged_text_lines.csv');
  const metaArray = await loadCsv('/kwic_ballad/public/merged_metadata.csv');

  metaArray.forEach(m => {
    metadata[m.file_id] = m;
  });

  document.getElementById('searchBtn').addEventListener('click', searchKWIC);
}

function searchKWIC() {
  const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";

  if (!keyword || textData.length === 0) return;

  for (const row of textData) {
    const text = row.text.toLowerCase();
    const tokens = text.split(/\s+/);
    tokens.forEach((token, idx) => {
      if (token.includes(keyword)) {
        const left = tokens.slice(Math.max(0, idx - 5), idx).join(" ");
        const right = tokens.slice(idx + 1, idx + 6).join(" ");

        const meta = metadata[row.file_id] || {};
        const author = meta.author || "–";
        const title = meta.title || "–";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.file_id}</td>
          <td>${row.line_number}</td>
          <td>${author}</td>
          <td>${title}</td>
          <td>${left}</td>
          <td><strong>${token}</strong></td>
          <td>${right}</td>
        `;
        tbody.appendChild(tr);
      }
    });
  }
}

init();
