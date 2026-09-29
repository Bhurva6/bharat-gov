/* Bharat.gov — concept demo app logic */
(function () {
  const D = window.BHARAT_DATA;
  const I = window.BHARAT_I18N;
  const LANGS = window.BHARAT_LANGS;
  let lang = localStorage.getItem("bharat_lang") || "en";
  if (!I[lang]) lang = "en";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const t = (k) => (I[lang] && I[lang][k]) || I.en[k] || k;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Category colour lookup ---------- */
  const catColor = {}; const catName = {};
  D.categories.forEach(c => { catColor[c.id] = c.color; catName[c.id] = c.key; });

  /* ---------- Render language selector ---------- */
  function renderLangs() {
    const sel = $("#langSelect");
    sel.innerHTML = LANGS.map(l => `<option value="${l.code}" ${l.code === lang ? "selected" : ""}>${l.native}</option>`).join("");
  }

  /* ---------- Render popular chips ---------- */
  function renderPopular() {
    $("#popularChips").innerHTML = D.popular.map(p =>
      `<a class="chip" href="${p.url}" target="_blank" rel="noopener">${esc(p.name)}</a>`).join("");
  }

  /* ---------- Render categories ---------- */
  function renderCats() {
    $("#catGrid").innerHTML = D.categories.map(c => `
      <div class="cat reveal" style="--c:${c.color}" data-cat="${c.id}" role="button" tabindex="0">
        <div class="icon-badge" style="--c:${c.color}">${c.icon}</div>
        <h3>${esc(t(c.key))}</h3>
      </div>`).join("");
    $$("#catGrid .cat").forEach(el => {
      const go = () => { setFilter(el.dataset.cat); document.getElementById("schemes").scrollIntoView({ behavior: "smooth" }); };
      el.addEventListener("click", go);
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  /* ---------- Render scheme filter buttons ---------- */
  let activeFilter = "all";
  function renderFilters() {
    const all = `<button class="filter ${activeFilter === "all" ? "active" : ""}" data-f="all">${lang === "en" ? "All" : "✦"}</button>`;
    $("#filterRow").innerHTML = all + D.categories.map(c =>
      `<button class="filter ${activeFilter === c.id ? "active" : ""}" data-f="${c.id}">${c.icon} ${esc(t(c.key))}</button>`).join("");
    $$("#filterRow .filter").forEach(b => b.addEventListener("click", () => setFilter(b.dataset.f)));
  }
  function setFilter(f) { activeFilter = f; renderFilters(); applyFilter(); }

  /* ---------- Render scheme cards ---------- */
  function renderSchemes() {
    $("#schemeGrid").innerHTML = D.schemes.map((s, i) => `
      <a class="scheme reveal" href="${s.url}" target="_blank" rel="noopener" data-cat="${s.cat}" data-name="${esc(s.name.toLowerCase())}">
        <div class="top" style="background:linear-gradient(135deg, ${catColor[s.cat]}22, ${catColor[s.cat]}0d)">
          <span class="cat-tag" style="background:${catColor[s.cat]}">${esc(t(catName[s.cat]))}</span>
          <span>${s.emoji}</span>
        </div>
        <div class="body">
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.blurb)}</p>
          <span class="open">${esc(t("open_portal"))}</span>
        </div>
      </a>`).join("");
    observeReveal();
  }
  function applyFilter() {
    const q = ($("#heroSearch").value || "").trim().toLowerCase();
    $$("#schemeGrid .scheme").forEach(el => {
      const okCat = activeFilter === "all" || el.dataset.cat === activeFilter;
      const okQ = !q || el.dataset.name.includes(q) || el.textContent.toLowerCase().includes(q);
      el.hidden = !(okCat && okQ);
    });
  }

  /* ---------- Render states ---------- */
  function renderStates() {
    $("#stateGrid").innerHTML = D.states.map(s =>
      `<a class="state" href="https://www.google.com/search?q=${encodeURIComponent(s + " government services portal")}" target="_blank" rel="noopener">${esc(s)}</a>`).join("");
  }

  /* ---------- Apply i18n to static [data-i18n] nodes ---------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    const rtl = (LANGS.find(l => l.code === lang) || {}).rtl;
    document.body.setAttribute("dir", rtl ? "rtl" : "ltr");
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    // brand
    $("#brandName").innerHTML = `<b>${esc(t("brand"))}</b><span>${esc(t("brand2"))}</span>`;
  }

  function rerender() {
    applyI18n(); renderCats(); renderFilters(); renderSchemes(); applyFilter();
  }

  /* ---------- Scroll reveal ---------- */
  let io;
  function observeReveal() {
    if (io) io.disconnect();
    io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    $$(".reveal").forEach(el => io.observe(el));
  }

  /* ==================================================================
     AI ASSISTANT  — calls Claude (Anthropic) directly from the browser.
     Key is user-supplied, stored only in localStorage. Streaming SSE.
     ================================================================== */
  const AI = {
    key: localStorage.getItem("bharat_ai_key") || "",
    model: localStorage.getItem("bharat_ai_model") || "claude-sonnet-5",
    history: []
  };

  function systemPrompt() {
    const langName = (LANGS.find(l => l.code === lang) || {}).label || "English";
    const schemeList = D.schemes.map(s => `- ${s.name} (${s.url}): ${s.blurb}`).join("\n");
    return `You are "Bharat AI", a warm, concise assistant on a concept portal for Indian government services (inspired by america.gov). Help citizens understand and access real Government of India schemes, documents and services.

RULES:
- Reply in ${langName} (the user's selected language). Keep answers short, friendly and practical — use simple steps and bullet points.
- Ground answers in real Indian schemes. When relevant, name the official scheme and give its official website as a markdown link.
- If eligibility or exact process depends on the person, say what's typical and point them to the official portal to confirm.
- Never invent fake portals, phone numbers, or amounts. If unsure, say so and suggest myScheme.gov.in or the relevant ministry.
- Add a one-line reminder to verify on official .gov.in sites when giving procedural steps.

Reference list of key schemes you can link to:
${schemeList}`;
  }

  // Minimal, safe markdown: links, bold, bullet lines, line breaks
  function mdToHtml(s) {
    let h = esc(s);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/(^|[\s(])(https?:\/\/[^\s)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    h = h.replace(/^\s*[-*]\s+(.*)$/gm, "• $1");
    return h;
  }

  function addMsg(role, text) {
    const box = $("#aiMessages");
    const div = document.createElement("div");
    div.className = "msg " + (role === "user" ? "user" : "bot");
    div.innerHTML = role === "user" ? esc(text) : mdToHtml(text);
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  function updateKeyUI() {
    const box = $("#aiKeybox");
    if (AI.key) box.classList.add("hidden"); else box.classList.remove("hidden");
    $("#aiModel").value = AI.model;
  }

  async function askAI(question) {
    if (!AI.key) { addMsg("bot", t("ai_need_key")); $("#aiKeybox").classList.remove("hidden"); return; }
    addMsg("user", question);
    AI.history.push({ role: "user", content: question });

    // typing bubble
    const box = $("#aiMessages");
    const typing = document.createElement("div");
    typing.className = "msg bot";
    typing.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    box.appendChild(typing); box.scrollTop = box.scrollHeight;

    let answerDiv = null, acc = "";
    const setAnswer = (txt) => {
      if (!answerDiv) { typing.remove(); answerDiv = addMsg("bot", ""); }
      answerDiv.innerHTML = mdToHtml(txt);
      box.scrollTop = box.scrollHeight;
    };

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": AI.key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: AI.model,
          max_tokens: 1024,
          stream: true,
          system: systemPrompt(),
          messages: AI.history.slice(-10)
        })
      });

      if (!res.ok || !res.body) {
        let detail = "";
        try { const j = await res.json(); detail = j.error && j.error.message ? j.error.message : JSON.stringify(j); } catch (e) {}
        typing.remove();
        addMsg("bot", `⚠️ ${res.status} ${res.statusText}. ${detail}\n\nCheck that your Claude API key is valid and the selected model is available on your account.`);
        return;
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();
        for (const line of lines) {
          const s = line.trim();
          if (!s.startsWith("data:")) continue;
          const payload = s.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "content_block_delta" && evt.delta && evt.delta.text) {
              acc += evt.delta.text; setAnswer(acc);
            }
          } catch (e) { /* ignore keep-alives */ }
        }
      }
      if (!acc) { setAnswer("…"); }
      AI.history.push({ role: "assistant", content: acc || "…" });
    } catch (err) {
      typing.remove();
      addMsg("bot", `⚠️ Couldn't reach Claude: ${err.message}. If you're behind a proxy/VPN it may block api.anthropic.com. Your key is only used from your browser.`);
    }
  }

  /* ---------- AI panel open/close & wiring ---------- */
  function openAI() { $("#aiOverlay").classList.add("open"); $("#aiPanel").classList.add("open"); setTimeout(() => $("#aiInput").focus(), 200); }
  function closeAI() { $("#aiOverlay").classList.remove("open"); $("#aiPanel").classList.remove("open"); }

  function resetChat() {
    AI.history = [];
    $("#aiMessages").innerHTML = "";
    addMsg("bot", t("ai_welcome"));
  }

  function wireAI() {
    $$("[data-open-ai]").forEach(b => b.addEventListener("click", openAI));
    $("#aiClose").addEventListener("click", closeAI);
    $("#aiOverlay").addEventListener("click", closeAI);

    $("#aiSaveKey").addEventListener("click", () => {
      const v = $("#aiKeyInput").value.trim();
      if (!v) return;
      AI.key = v; localStorage.setItem("bharat_ai_key", v);
      updateKeyUI(); addMsg("bot", "✅ " + t("ai_save_key") + " ✓");
    });
    $("#aiModel").addEventListener("change", e => { AI.model = e.target.value; localStorage.setItem("bharat_ai_model", AI.model); });

    const send = () => {
      const v = $("#aiInput").value.trim();
      if (!v) return;
      $("#aiInput").value = ""; $("#aiInput").style.height = "auto";
      askAI(v);
    };
    $("#aiSendBtn").addEventListener("click", send);
    $("#aiInput").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
    $("#aiInput").addEventListener("input", e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; });
    $("#aiClearBtn").addEventListener("click", resetChat);

    $$("#aiSuggest button").forEach(b => b.addEventListener("click", () => { $("#aiInput").value = b.textContent; send(); }));
  }

  /* ---------- Search ---------- */
  function wireSearch() {
    $("#heroSearch").addEventListener("input", applyFilter);
    $("#heroSearch").addEventListener("keydown", e => {
      if (e.key === "Enter") { document.getElementById("schemes").scrollIntoView({ behavior: "smooth" }); }
    });
    $("#heroSearchBtn").addEventListener("click", () => document.getElementById("schemes").scrollIntoView({ behavior: "smooth" }));
  }

  /* ---------- Language change ---------- */
  function wireLang() {
    $("#langSelect").addEventListener("change", e => {
      lang = e.target.value; localStorage.setItem("bharat_lang", lang);
      rerender();
      // refresh AI welcome if chat only has the welcome line
      if (AI.history.length === 0) resetChat();
    });
  }

  /* ---------- Ashoka Chakra (national symbol) as SVG ---------- */
  function renderChakras() {
    $$("[data-chakra]").forEach(el => {
      const col = el.style.getPropertyValue("--chakra-color") || "#0A2A66";
      let spokes = "";
      for (let i = 0; i < 24; i++) {
        const a = (i * 15) * Math.PI / 180;
        const x1 = 50 + 8 * Math.cos(a), y1 = 50 + 8 * Math.sin(a);
        const x2 = 50 + 40 * Math.cos(a), y2 = 50 + 40 * Math.sin(a);
        spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="1.6"/>`;
      }
      el.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="${col}" stroke-width="4"/>
        <circle cx="50" cy="50" r="7" fill="${col}"/>
        ${spokes}
      </svg>`;
      el.style.display = "inline-block";
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderChakras();
    renderLangs(); renderPopular(); renderStates();
    rerender();
    wireSearch(); wireLang(); wireAI();
    updateKeyUI(); resetChat();
    observeReveal();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
