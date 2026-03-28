(function () {
  "use strict";

  /* ──────────────── Tracking ──────────────── */
  function track(event, data) {
    // Clarity custom tags
    if (typeof window.clarity === "function") {
      window.clarity("set", event, JSON.stringify(data || {}));
    }
    // dataLayer for GTM / GA4 if wired later
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  }

  /* ──────────────── Questions ──────────────── */
  const QUESTIONS = [
    {
      id: "heart",
      section: "Seu momento emocional",
      text: "Como você descreve seu coração neste momento?",
      options: [
        { label: "Partido, mas ainda esperançoso", sub: "A dor fala alto, mas não apagou o amor", score: { hope: 2, tie: 1 } },
        { label: "Confuso — um dia sim, outro não", sub: "Altos e baixos que não deixam decidir", score: { hope: 1, tie: 2 } },
        { label: "Cansado, quase sem forças", sub: "Já pensei em desistir várias vezes", score: { hope: 0, urgent: 2 } },
        { label: "Firme: sei o que quero", sub: "Quero essa pessoa de volta de verdade", score: { hope: 2, urgent: 1 } },
      ],
    },
    {
      id: "time",
      section: "Tempo e peso da situação",
      text: "Há quanto tempo essa situação pesa em você?",
      options: [
        { label: "Menos de um mês", sub: "Ainda recente", score: { urgent: 2, tie: 1 } },
        { label: "Entre um e seis meses", sub: "Um vácuo que já dói no dia a dia", score: { tie: 2, hope: 1 } },
        { label: "Mais de seis meses", sub: "Carrego isso há muito tempo", score: { tie: 2, urgent: 1 } },
        { label: "Anos", sub: "É uma história longa", score: { tie: 3 } },
      ],
    },
    {
      id: "try",
      section: "Contato e dinâmica atual",
      text: "Você já tentou se aproximar ou conversar de novo?",
      options: [
        { label: "Sim, e a porta ainda está aberta", sub: "Há algum contato ou sinal", score: { hope: 2 } },
        { label: "Sim, mas fui ignorado(a) ou bloqueado(a)", sub: "A resposta foi fria", score: { urgent: 2, tie: 1 } },
        { label: "Ainda não tive coragem", sub: "Medo de piorar", score: { hope: 1, tie: 2 } },
        { label: "Nem quero humilhação", sub: "Prefiro agir por outro caminho", score: { urgent: 1, tie: 2 } },
      ],
    },
    {
      id: "block",
      section: "O que mais pesa agora",
      text: "O que mais trava você hoje?",
      options: [
        { label: "Saudade que não passa", sub: "Lembro o tempo todo", score: { tie: 3 } },
        { label: "Medo de sofrer de novo", sub: "E se nada mudar?", score: { hope: 1, urgent: 1 } },
        { label: "Raiva ou orgulho", sub: "Uma parte minha resiste", score: { tie: 2 } },
        { label: "Outras pessoas no meio", sub: "Família, terceiros, ciúmes…", score: { urgent: 2, tie: 1 } },
      ],
    },
    {
      id: "spirit",
      section: "Ligação e intuição",
      text: "Você sente que ainda existe uma ligação inexplicável entre vocês?",
      options: [
        { label: "Sim, sonhos, sinais ou coincidências", sub: "Como se algo puxasse", score: { tie: 3, hope: 1 } },
        { label: "Às vezes sinto, mas duvido", sub: "Não sei se é fé ou ilusão", score: { tie: 2 } },
        { label: "Não muito", sub: "Quero mais clareza do que feeling", score: { hope: 1 } },
        { label: "Acredito que sim, no invisível", sub: "Confio no plano espiritual", score: { tie: 2, hope: 2 } },
      ],
    },
    {
      id: "faith",
      section: "Experiência com trabalhos espirituais",
      text: "Sobre trabalho espiritual ou ritual, você…",
      options: [
        { label: "Já fiz ou conheço quem fez", sub: "Não é novidade para mim", score: { hope: 2, tie: 1 } },
        { label: "Tenho curiosidade, com respeito", sub: "Quero entender antes", score: { hope: 2 } },
        { label: "Sou cético(a), mas estou aberto(a)", sub: "O que importa é o que funciona", score: { urgent: 2 } },
        { label: "Confio na linha Maria Padilha e Pomba Gira", sub: "Incluindo ritual 7 Saias quando couber", score: { tie: 2, hope: 2 } },
      ],
    },
    {
      id: "urgent",
      section: "Urgência e expectativa",
      text: "Quão urgente é para você ver movimento nessa história?",
      options: [
        { label: "Preciso de algo já", sub: "Não aguento mais esperar", score: { urgent: 3 } },
        { label: "Urgente, mas com calma certa", sub: "Quero fazer do jeito certo", score: { urgent: 2, hope: 1 } },
        { label: "Posso esperar o tempo certo", sub: "Se for para dar certo, espero", score: { hope: 2 } },
        { label: "Só quero paz, com ou sem a pessoa", sub: "Quero desfecho honesto", score: { hope: 2 } },
      ],
    },
  ];

  /* ──────────────── Results ──────────────── */
  const RESULTS = [
    {
      id: "binding",
      match: (s) => s.tie >= 5 && s.urgent >= 2,
      title: "Perfil: laço profundo ainda ativo",
      body: "Suas respostas sugerem um vínculo que não se dissolveu só no plano da razão: há saudade, tempo carregado e sensação de ligação. Em muitos casos, isso pede um trabalho que alinhe energia e favoreça reaproximação sem humilhação nem pressão desalinhada com o livre-arbítrio.",
      hint: "A linha costuma indicar fortalecimento de vínculo e abertura de diálogo. Compare o Ritual 7 Saias (bloqueio e campo entre duas pessoas) com a jornada Maria Padilha em 7 dias para ver qual formato combina mais com você.",
    },
    {
      id: "sweeten",
      match: (s) => s.hope >= 4 && s.urgent < 3,
      title: "Perfil: esperança viva — clima pede suavidade",
      body: "Você ainda não fechou a porta. O padrão que aparece é de tensão ou frieza no ambiente emocional, não de ausência total de caminho. Muitas vezes o próximo passo é suavizar o campo: menos atrito, mais atração e lembrança afetiva positiva.",
      hint: "Trabalhos de adoçamento e harmonia costumam ser mencionados quando ainda há porta entreaberta ou memória afetiva forte. O catálogo na bio costuma reunir variações desse tipo de encaminhamento.",
    },
    {
      id: "urgent",
      match: (s) => s.urgent >= 5,
      title: "Perfil: urgência alta — encaminhamento direto",
      body: "O tempo e o desgaste aparecem no limite. Suas respostas pedem clareza rápida e um ritual com narrativa objetiva, sem rodeios. O importante é escolher um caminho em que você confie e que respeite sua segurança emocional.",
      hint: "Em afastamento seco, muitas pessoas olham primeiro para propostas que falam em quebra de barreira e reaproximação (7 Saias) e, em paralelo, para uma jornada estruturada (7 dias Maria Padilha). Leia as duas páginas e sinta qual ressoa.",
    },
    {
      id: "default",
      match: () => true,
      title: "Perfil: misto — clareza e escolha consciente",
      body: "Há combinação de esperança, cansaço e dúvida: comum em quem ama de verdade. Isso não é falha; é sinal de que vale parar para nomear o que trava e escolher um trabalho alinhado à sua intenção, sem autopunição.",
      hint: "Use os links abaixo como menu: 7 Saias para foco em bloqueio/reconexão, Maria Padilha em 7 dias para ritual guiado em etapas, bio link para explorar outras linhas quando quiser comparar.",
    },
  ];

  const LETTERS = "ABCD";

  let step = 0;
  const scores = { hope: 0, tie: 0, urgent: 0 };
  const scoreHistory = [];
  const answerHistory = [];
  const startTime = Date.now();

  const flowStepEls = document.querySelectorAll("#flow-steps .flow-step");

  function setFlowStep(index) {
    flowStepEls.forEach((li, i) => {
      li.classList.toggle("is-active", i === index);
      li.classList.toggle("is-complete", i < index);
    });
  }

  const el = {
    intro: document.getElementById("screen-intro"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    btnStart: document.getElementById("btn-start"),
    btnBack: document.getElementById("btn-back"),
    btnRestart: document.getElementById("btn-restart"),
    question: document.getElementById("question-text"),
    options: document.getElementById("options-root"),
    progressBar: document.getElementById("progress-bar"),
    progressFill: document.getElementById("progress-fill"),
    quizTheme: document.getElementById("quiz-theme"),
    quizProgressText: document.getElementById("quiz-progress-text"),
    resultTitle: document.getElementById("result-title"),
    resultBody: document.getElementById("result-body"),
    resultHint: document.getElementById("result-hint"),
  };

  /* ──────────────── Reveal on scroll / panel entry ──────────────── */
  function activateReveals(root) {
    root.querySelectorAll(".reveal:not(.is-visible)").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 80 * i);
    });
  }

  function showPanel(name) {
    el.intro.classList.toggle("active", name === "intro");
    el.intro.hidden = name !== "intro";
    el.quiz.classList.toggle("active", name === "quiz");
    el.quiz.hidden = name !== "quiz";
    el.result.classList.toggle("active", name === "result");
    el.result.hidden = name !== "result";

    if (name === "intro") setFlowStep(0);
    else if (name === "quiz") setFlowStep(1);
    else if (name === "result") setFlowStep(2);

    const root =
      name === "intro" ? el.intro : name === "quiz" ? el.quiz : el.result;
    requestAnimationFrame(() => activateReveals(root));
  }

  function addScores(delta) {
    const s = delta || {};
    scores.hope += s.hope || 0;
    scores.tie += s.tie || 0;
    scores.urgent += s.urgent || 0;
  }

  function subtractScores(delta) {
    const s = delta || {};
    scores.hope -= s.hope || 0;
    scores.tie -= s.tie || 0;
    scores.urgent -= s.urgent || 0;
  }

  function setProgress() {
    const n = QUESTIONS.length;
    const pct = ((step + 1) / n) * 100;
    el.progressFill.style.width = pct + "%";
    el.progressBar.setAttribute("aria-valuenow", String(Math.round(pct)));
    el.progressBar.setAttribute(
      "aria-valuetext",
      `Pergunta ${step + 1} de ${n}, ${Math.round(pct)}% concluído`
    );
    if (el.quizProgressText) {
      el.quizProgressText.textContent = `Pergunta ${step + 1} de ${n}`;
    }
  }

  function renderQuestion() {
    const q = QUESTIONS[step];
    if (el.quizTheme) el.quizTheme.textContent = q.section;

    el.question.classList.remove("q-enter");
    void el.question.offsetWidth;
    el.question.classList.add("q-enter");
    el.question.textContent = q.text;

    el.options.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option opt-enter";
      btn.style.animationDelay = (i * 0.06) + "s";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");

      const row = document.createElement("span");
      row.className = "option-row";

      const key = document.createElement("span");
      key.className = "option-key";
      key.textContent = LETTERS[i] || String(i + 1);

      const textWrap = document.createElement("span");
      textWrap.className = "option-text";

      const main = document.createElement("span");
      main.className = "opt-main";
      main.textContent = opt.label;
      textWrap.appendChild(main);
      if (opt.sub) {
        const sub = document.createElement("span");
        sub.className = "opt-sub";
        sub.textContent = opt.sub;
        textWrap.appendChild(sub);
      }

      row.appendChild(key);
      row.appendChild(textWrap);
      btn.appendChild(row);

      btn.addEventListener("click", () => {
        btn.classList.add("opt-selected");
        const delta = opt.score || {};
        scoreHistory.push(delta);
        answerHistory.push({ q: q.id, a: opt.label });
        addScores(delta);

        track("quiz_answer", {
          question_id: q.id,
          question_index: step + 1,
          answer: opt.label,
        });

        setTimeout(() => {
          if (step < QUESTIONS.length - 1) {
            step += 1;
            renderQuestion();
            setProgress();
            el.btnBack.disabled = step === 0;
          } else {
            finishQuiz();
          }
        }, 260);
      });
      el.options.appendChild(btn);
    });
    el.btnBack.disabled = step === 0;
    setProgress();
  }

  function pickResult() {
    for (const r of RESULTS) {
      if (r.match(scores)) return r;
    }
    return RESULTS[RESULTS.length - 1];
  }

  function finishQuiz() {
    const r = pickResult();
    el.resultTitle.textContent = r.title;
    el.resultBody.textContent = r.body;
    el.resultHint.textContent = r.hint;

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    track("quiz_complete", {
      result_id: r.id,
      result_title: r.title,
      scores: { ...scores },
      duration_seconds: elapsed,
      answers: answerHistory,
    });

    showPanel("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetQuiz() {
    step = 0;
    scores.hope = 0;
    scores.tie = 0;
    scores.urgent = 0;
    scoreHistory.length = 0;
    answerHistory.length = 0;
    track("quiz_restart", {});
    showPanel("quiz");
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ──────────────── CTA tracking ──────────────── */
  document.querySelectorAll("[data-track]").forEach((a) => {
    a.addEventListener("click", () => {
      track("cta_click", {
        cta_id: a.dataset.track,
        href: a.href,
      });
    });
  });

  /* ──────────────── Events ──────────────── */
  el.btnStart.addEventListener("click", () => {
    track("quiz_start", {});
    showPanel("quiz");
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  el.btnBack.addEventListener("click", () => {
    if (step <= 0) return;
    const last = scoreHistory.pop();
    answerHistory.pop();
    if (last) subtractScores(last);
    step -= 1;
    renderQuestion();
    setProgress();
    el.btnBack.disabled = step === 0;
  });

  el.btnRestart.addEventListener("click", resetQuiz);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.quiz.hidden && step > 0) {
      el.btnBack.click();
    }
  });

  setFlowStep(0);
  activateReveals(el.intro);

  track("page_view", { referrer: document.referrer });
})();
