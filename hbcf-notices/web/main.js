const API_BASE = "http://localhost:8000"; // FastAPI 기본 포트

const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function load(page = 1, limit = 6) {
  try {
    statusEl.textContent = "불러오는 중…";
    const r = await fetch(
      `${API_BASE}/api/hbcf/notices?page=${page}&limit=${limit}`,
      { cache: "no-store" }
    );
    if (!r.ok) throw new Error("API " + r.status);
    const data = await r.json();
    const items = data.items || [];
    statusEl.textContent = `page ${data.page} · ${data.count}건 중 ${items.length}건 표시`;

    listEl.innerHTML = "";
    items.forEach((it) => {
      const card = document.createElement("article");
      card.className = "event-card";
      card.innerHTML = `
        <img src="./assets/event-museum.png" alt="${escapeHTML(it.title)}" />
        <div class="event-title">${escapeHTML(it.title)}</div>
        <div class="meta">
          <span class="badge">${escapeHTML(it.category)}</span>
          <span>${escapeHTML(it.department)}</span>
          <span>${escapeHTML(it.date)}</span>
          ${it.has_attachment ? '<span class="badge">첨부</span>' : ""}
          <span>조회 ${escapeHTML(it.views)}</span>
        </div>
        <a class="event-link" href="${
          it.link
        }" target="_blank" rel="noopener">자세히 보기 →</a>
      `;
      listEl.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    statusEl.textContent = "불러오기 실패";
  }
}

load();
