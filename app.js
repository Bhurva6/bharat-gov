/* Bharat.gov — concept demo app logic. Vanilla JS, no build. */
(function(){
  "use strict";
  var D = window.BHARAT_DATA, I = window.BHARAT_I18N;
  var LANG = localStorage.getItem("bharat_lang") || "en";
  var FILTER = "all";
  var CATCOLORS = {}; D.categories.forEach(function(c){ CATCOLORS[c.id]=c.color; });

  function t(k){ return (I.ui[LANG] && I.ui[LANG][k]) || I.ui.en[k] || k; }
  function catLabel(id){ return (I.cat[id] && (I.cat[id][LANG]||I.cat[id].en)) || id; }
  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

  /* ---------- render ---------- */
  function applyStatic(){
    var L = I.langs.find(function(x){return x.code===LANG;}) || I.langs[0];
    document.documentElement.lang = LANG;
    document.documentElement.dir = L.dir;
    document.querySelectorAll("[data-t]").forEach(function(n){ n.textContent = t(n.getAttribute("data-t")); });
    document.querySelectorAll("[data-tph]").forEach(function(n){ n.setAttribute("placeholder", t(n.getAttribute("data-tph"))); });
  }

  function renderCats(){
    el("cats").innerHTML = D.categories.map(function(c){
      return '<div class="cat" data-cat="'+c.id+'">'
        + '<span class="bar" style="background:'+c.color+'"></span>'
        + '<div class="ic" style="background:'+c.color+'">'+c.icon+'</div>'
        + '<h3>'+esc(catLabel(c.id))+'</h3></div>';
    }).join("");
    el("cats").querySelectorAll(".cat").forEach(function(n){
      n.onclick = function(){ FILTER = n.getAttribute("data-cat"); renderChips(); renderSchemes();
        document.getElementById("schemes-block").scrollIntoView({behavior:"smooth"}); };
    });
  }

  function renderChips(){
    var chips = [{id:"all",label:"★ "+ (LANG==="en"?"All":t("nav_schemes"))}].concat(
      D.categories.map(function(c){ return {id:c.id,label:c.icon+" "+catLabel(c.id)}; }));
    el("chips").innerHTML = chips.map(function(c){
      return '<button class="chip'+(FILTER===c.id?" on":"")+'" data-f="'+c.id+'">'+esc(c.label)+'</button>';
    }).join("");
    el("chips").querySelectorAll(".chip").forEach(function(n){
      n.onclick = function(){ FILTER = n.getAttribute("data-f"); renderChips(); renderSchemes(); };
    });
  }

  function renderSchemes(q){
    q = (q||"").trim().toLowerCase();
    var list = D.schemes.filter(function(s){
      var okCat = FILTER==="all" || s.cat===FILTER;
      var okQ = !q || (s.name+" "+s.blurb+" "+catLabel(s.cat)).toLowerCase().indexOf(q)>=0;
      return okCat && okQ;
    });
    if(!list.length){ el("schemes").innerHTML = '<p style="color:var(--muted)">No matches — try the AI assistant.</p>'; return; }
    el("schemes").innerHTML = list.map(function(s){
      return '<div class="scheme">'
        + '<div class="top"><div class="emoji">'+s.emoji+'</div><div>'
        + '<div class="cat-tag">'+esc(catLabel(s.cat))+'</div>'
        + '<h4>'+esc(s.name)+'</h4></div></div>'
        + '<p>'+esc(s.blurb)+'</p>'
        + '<div class="foot"><a href="'+s.url+'" target="_blank" rel="noopener">'+esc(t("visit"))+'</a>'
        + '<span class="ask" data-ask="'+esc(s.name)+'">💬 '+esc(t("nav_ai"))+'</span></div></div>';
    }).join("");
    el("schemes").querySelectorAll(".ask").forEach(function(n){
      n.onclick = function(){ openAI(); askAbout(n.getAttribute("data-ask")); };
    });
  }

  function renderServices(){
    el("services").innerHTML = D.popular.map(function(s){
      return '<a class="svc" href="'+s.url+'" target="_blank" rel="noopener"><span class="dot"></span>'+esc(s.name)+'</a>';
    }).join("");
  }
  function renderStates(){
    el("states").innerHTML = D.states.map(function(s){ return '<div class="state">'+esc(s)+'</div>'; }).join("");
  }
  function renderLangSel(){
    el("langsel").innerHTML = I.langs.map(function(l){
      return '<option value="'+l.code+'"'+(l.code===LANG?" selected":"")+'>'+l.name+'</option>';
    }).join("");
    el("langsel").onchange = function(){ LANG=this.value; localStorage.setItem("bharat_lang",LANG); renderAll(); };
  }

  function renderAll(){ applyStatic(); renderLangSel(); renderCats(); renderChips(); renderSchemes(el("q")?el("q").value:""); renderServices(); renderStates(); refreshAIChrome(); }

  /* ---------- AI assistant ---------- */
  var history = [];
  function openAI(){ el("scrim").classList.add("open"); el("ai").classList.add("open"); setTimeout(function(){var ta=el("ai-input"); if(ta) ta.focus();},300); }
  function closeAI(){ el("scrim").classList.remove("open"); el("ai").classList.remove("open"); }
  function getKey(){ return localStorage.getItem("bharat_key")||""; }
  function getModel(){ return localStorage.getItem("bharat_model")||"claude-sonnet-5"; }

  function refreshAIChrome(){
    if(el("ai-key-input")) el("ai-key-input").value = getKey();
    if(el("model-sel")) el("model-sel").value = getModel();
    if(el("ai-body") && !history.length) renderChat();
  }

  function bubble(role,text){
    var d=document.createElement("div"); d.className="msg "+(role==="user"?"me":"bot"); d.textContent=text; return d;
  }
  function renderChat(){
    var body=el("ai-body"); body.innerHTML="";
    body.appendChild(bubble("assistant", t("ai_welcome")));
    if(!getKey()){
      var n=document.createElement("div"); n.className="msg bot"; n.style.background="#fff5ea"; n.style.borderColor="#ffe0bf";
      n.textContent=t("ai_needkey"); body.appendChild(n);
    }
    var langName=(I.langs.find(function(x){return x.code===LANG;})||{}).name||"English";
    var sugg=document.createElement("div"); sugg.className="suggest";
    var prompts=[
      "How do I apply for a new passport?",
      "Am I eligible for PM-KISAN?",
      "How to get Ayushman Bharat health cover?",
      "How do I download my e-Aadhaar?"
    ];
    sugg.innerHTML=prompts.map(function(p){return '<button data-q="'+esc(p)+'">'+esc(p)+'</button>';}).join("");
    body.appendChild(sugg);
    sugg.querySelectorAll("button").forEach(function(b){ b.onclick=function(){ send(b.getAttribute("data-q")); }; });
    history.forEach(function(m){ body.appendChild(bubble(m.role, m.content)); });
    body.scrollTop=body.scrollHeight;
  }
  function askAbout(name){ if(el("ai-input")){ el("ai-input").value = "How do I apply for "+name+"? Explain the steps and eligibility."; el("ai-input").focus(); } }

  function systemPrompt(){
    var langName=(I.langs.find(function(x){return x.code===LANG;})||{}).name||"English";
    var schemes = D.schemes.map(function(s){ return "- "+s.name+" ("+s.url+"): "+s.blurb; }).join("\n");
    return "You are Bharat AI, a friendly, concise assistant for Indian government services on a concept demo portal (Bharat.gov). "
      + "You help citizens understand and apply for real Government of India schemes and services. "
      + "ALWAYS reply in this language: "+langName+" (unless the user clearly writes in another language, then match theirs). "
      + "Be practical: give step-by-step guidance, eligibility, documents needed, and the official portal link. "
      + "Use simple language and short paragraphs or bullet points. If unsure, say so and point to the official portal. "
      + "Add a one-line reminder that this is a concept demo and users should verify on the official site. "
      + "Here are key schemes you can reference (name, official URL, summary):\n" + schemes;
  }

  function saveKey(){
    var v=el("ai-key-input").value.trim();
    localStorage.setItem("bharat_key", v);
    var btn=el("save-key"); var old=btn.textContent; btn.textContent=t("ai_saved");
    setTimeout(function(){ btn.textContent=t("ai_save"); },1600);
    if(!history.length) renderChat();
  }

  function send(text){
    text = (text!=null?text:el("ai-input").value).trim();
    if(!text) return;
    var key=getKey();
    var body=el("ai-body");
    var sg=body.querySelector(".suggest"); if(sg) sg.remove();
    history.push({role:"user",content:text});
    body.appendChild(bubble("user",text));
    el("ai-input").value="";
    if(!key){
      var w=bubble("assistant", t("ai_needkey")); body.appendChild(w); body.scrollTop=body.scrollHeight;
      if(el("ai-key-input")) el("ai-key-input").focus();
      return;
    }
    var out=bubble("assistant",""); var cur=document.createElement("span"); cur.className="cursor";
    out.appendChild(cur); body.appendChild(out); body.scrollTop=body.scrollHeight;
    streamClaude(key, out, cur);
  }

  function streamClaude(key, out, cur){
    var acc="";
    fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "content-type":"application/json",
        "x-api-key":key,
        "anthropic-version":"2023-06-01",
        "anthropic-dangerous-direct-browser-access":"true"
      },
      body:JSON.stringify({
        model:getModel(), max_tokens:1024, stream:true,
        system:systemPrompt(),
        messages:history.map(function(m){return {role:m.role,content:m.content};})
      })
    }).then(function(res){
      if(!res.ok){ return res.text().then(function(tx){ throw new Error("HTTP "+res.status+": "+tx.slice(0,300)); }); }
      var reader=res.body.getReader(), dec=new TextDecoder(), buf="";
      function pump(){
        return reader.read().then(function(r){
          if(r.done){ finish(); return; }
          buf+=dec.decode(r.value,{stream:true});
          var lines=buf.split("\n"); buf=lines.pop();
          lines.forEach(function(line){
            line=line.trim(); if(!line.indexOf("data:")===0 && line.indexOf("data:")!==0) return;
            if(line.indexOf("data:")!==0) return;
            var payload=line.slice(5).trim(); if(!payload||payload==="[DONE]") return;
            try{ var ev=JSON.parse(payload);
              if(ev.type==="content_block_delta" && ev.delta && ev.delta.text){ acc+=ev.delta.text; paint(); }
            }catch(e){}
          });
          return pump();
        });
      }
      function paint(){ out.textContent=acc; out.appendChild(cur); el("ai-body").scrollTop=el("ai-body").scrollHeight; }
      function finish(){ if(cur.parentNode) cur.remove(); out.textContent=acc||"(no response)"; history.push({role:"assistant",content:acc}); }
      return pump();
    }).catch(function(err){
      if(cur.parentNode) cur.remove();
      out.style.background="#fff0f0"; out.style.borderColor="#ffc9c9";
      var msg=String(err.message||err);
      if(msg.indexOf("401")>=0) msg="Your Claude API key was rejected (401). Check the key and try again.";
      else if(msg.indexOf("Failed to fetch")>=0) msg="Network/CORS error reaching Anthropic. Check your key and connection.";
      out.textContent="⚠️ "+msg;
    });
  }

  /* ---------- wire ---------- */
  document.addEventListener("DOMContentLoaded",function(){
    renderAll();
    el("open-ai").onclick=openAI; el("open-ai-2") && (el("open-ai-2").onclick=openAI);
    el("close-ai").onclick=closeAI; el("scrim").onclick=closeAI;
    el("save-key").onclick=saveKey;
    el("model-sel").onchange=function(){ localStorage.setItem("bharat_model",this.value); };
    el("send").onclick=function(){ send(); };
    el("ai-input").addEventListener("keydown",function(e){ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); }});
    el("q").addEventListener("input",function(){ renderSchemes(this.value); });
    el("q").addEventListener("keydown",function(e){ if(e.key==="Enter"){ var v=this.value.trim(); if(v){ openAI(); send(v); } }});
    el("hero-img").onerror=function(){ this.style.display="none"; var f=document.querySelector(".hero-art .fallback"); if(f) f.style.display="grid"; };
  });
})();
