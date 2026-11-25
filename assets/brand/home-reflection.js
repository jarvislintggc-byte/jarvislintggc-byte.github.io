(() => {
  // Enhance the existing homepage bubble after the Framer page has loaded.
  const sheet = document.getElementById("home-speech-bubble");
  const labels = {
    "zh-Hant": ["閱讀我的近況", "我的近況", "再點一下關閉"],
    en: ["Read my reflection", "A personal reflection", "Click again to close"],
    ja: ["最近の思いを読む", "最近の思い", "もう一度タップして閉じる"]
  };

  function install() {
    if (!sheet || document.getElementById("home-reflection")) return;
    const template = document.createElement("template");
    template.innerHTML = `<dialog id="home-reflection" aria-label="我的近況">
    <article lang="zh-Hant" tabindex="-1" autofocus>
      <p>曾經，我以為人生是一條不斷向上的道路。</p>
      <p>只要努力一點、勇敢一點，願意走出熟悉的環境，就能慢慢接近自己想要的生活。</p>
      <p>後來才發現，很多事情比我想像中複雜。努力未必會得到期待的回報，做了選擇，也不代表就能掌握結果。</p>
      <p>有機會到不同的地方生活、求學與工作，我很幸運。這些經歷讓我看見更多可能，也讓我對自己有了更多期待。有時走得太急，便忘了停下來想想，自己究竟在追求什麼。</p>
      <p>近期的變動，讓我重新看待原本習以為常的事。我還在學著接受失落，也學著承認自己的不足。有些事當時沒有想清楚，有些地方還能做得更好。</p>
      <p>一路走來，我得到過很多人的幫助。許多看似靠自己走過的路，其實都有家人、朋友與前輩的支持。現在回頭看，心裡有更多感謝，也希望自己能更認真地聽懂別人的經驗與提醒。</p>
      <p>我仍然對未來有期待，也想繼續嘗試。但我不再那麼確定，每一步都必須往上，才算有意義。</p>
      <p>有時候，先把眼前的生活過好，把答應的事情做好，慢慢找回方向，也是一種前進。</p>
      <p>我還有很多不懂的事，也還在學習。希望往後的自己，能少一點急著證明，多一點耐心；帶著感謝，繼續走下去。</p>
    </article>
    <button type="button">再點一下關閉</button>
  </dialog>`;
    const dialog = template.content.firstElementChild;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "home-bubble-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
    function setLabels() {
      const [open, title, close] = labels[document.documentElement.lang] || labels["zh-Hant"];
      trigger.setAttribute("aria-label", open);
      dialog.setAttribute("aria-label", title);
      dialog.querySelector("button").textContent = close;
    }

    const style = document.createElement("style");
    // Reuse the published bubble artwork, position and responsive breakpoints.
    style.textContent = sheet.textContent.replaceAll("#section-1::after", "#section-1 > .home-bubble-trigger") + `
      #section-1:has(> .home-bubble-trigger)::after { content: none; }
      #section-1 > .home-bubble-trigger { z-index: 2; border: 0; padding: 0; appearance: none; cursor: pointer; pointer-events: auto; }
      [data-framer-name="Download CV Button Container"] { pointer-events: none; }
      [data-framer-name="Download CV Button Container"] a { pointer-events: auto; }
      .home-bubble-trigger:focus-visible, #home-reflection button:focus-visible { outline: 3px solid #ffbc23; outline-offset: 3px; }
      html:has(#home-reflection[open]) { overflow: hidden; }
      #home-reflection {
        box-sizing: border-box; width: min(44rem, calc(100% - 2rem));
        max-height: 86dvh; margin: auto; padding: clamp(18px, 3vw, 42px);
        overflow-y: auto; overscroll-behavior: contain; border: 0; border-radius: 14px;
        background: #201c1b; color: #fff9f0; font: 400 clamp(1rem, 1.2vw, 1.125rem)/1.75 system-ui, sans-serif;
      }
      #home-reflection::backdrop { background: rgb(12 9 8 / 84%); }
      #home-reflection article { outline: none; }
      #home-reflection p { margin: 0 0 .85em; }
      #home-reflection button {
        border: 0; background: transparent; color: #f1ce94; font: inherit; cursor: pointer; padding: .4em 0;
      }`;
    document.head.append(style);
    document.body.append(dialog);
    setLabels();
    new MutationObserver(setLabels).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    trigger.onclick = () => {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
    };
    dialog.onclick = () => dialog.close();

    function attach() {
      if (trigger.isConnected) return;
      if (dialog.open) dialog.close();
      document.getElementById("section-1")?.append(trigger);
    }
    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  }

  install();
})();
