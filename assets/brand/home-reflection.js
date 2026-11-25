(() => {
  // Enhance the existing homepage bubble after the Framer page has loaded.
  const sheet = document.getElementById("home-speech-bubble");
  const labels = {
    "zh-Hant": ["閱讀我的近況", "我的近況"],
    en: ["Read my reflection", "A personal reflection"],
    ja: ["最近の思いを読む", "最近の思い"]
  };

  const copy = {
    "zh-Hant": [
      "曾經，我以為人生是一條不斷向上的道路。",
      "只要努力一點、勇敢一點，願意走出熟悉的環境，就能慢慢接近自己想要的生活。",
      "後來才發現，很多事情比我想像中複雜。努力未必會得到期待的回報，做了選擇，也不代表就能掌握結果。",
      "有機會到不同的地方生活、求學與工作，我很幸運。這些經歷讓我看見更多可能，也讓我對自己有了更多期待。有時走得太急，便忘了停下來想想，自己究竟在追求什麼。",
      "近期的簽證變動，讓我必須回到台灣，重新看待原本習以為常的事。我還在學著接受失落，也學著承認自己的不足，明白自己仍有許多可以做得更好的地方。",
      "一路走來，我得到過很多人的幫助。許多看似靠自己走過的路，其實都有家人、朋友與前輩的支持。現在回頭看，心裡有更多感謝，也希望自己能更認真地聽懂別人的經驗與提醒。",
      "有時候，先把眼前的生活過好，把答應的事情做好，慢慢找回方向，也是一種前進。",
      "我還有很多不懂的事，也還在學習。希望往後的自己，能少一點急著證明，多一點耐心；帶著感謝，繼續走下去。",
      "成長，就是明知道自己的渺小，卻仍然有勇氣繼續前進。"
    ],
    "en": [
      "I once believed that life was a continuous climb upward.",
      "I thought that by working a little harder, being a little braver, and stepping outside my comfort zone, I could gradually move closer to the life I envisioned.",
      "Over time, I came to realize that life is far more complicated than I had imagined. Effort does not always bring the rewards we hope for, and making choices does not mean we can control their outcomes.",
      "I have been fortunate to live, study, and work in different parts of the world. These experiences opened my eyes to new possibilities and raised my expectations of myself. Sometimes, I moved forward so quickly that I forgot to reflect on what I was truly pursuing.",
      "Recent visa circumstances required me to return to Taiwan and reconsider many things I had once taken for granted. I am still learning to accept disappointment, acknowledge my shortcomings, and recognize how much room I have to grow.",
      "Throughout this journey, I have received support from many people. Much of what seemed like an independent journey was made possible by my family, friends, and mentors. Looking back, I feel a deeper sense of gratitude and a greater willingness to listen to the experiences and advice of others.",
      "Sometimes, taking care of the life in front of us, honoring our commitments, and gradually finding our direction again is also a form of progress.",
      "There is still so much I do not know, and I am still learning. Moving forward, I hope to be less eager to prove myself, more patient, and always grateful for the journey.",
      "Growth is recognizing how small we are, yet still finding the courage to move forward."
    ],
    "ja": [
      "かつて私は、人生とは絶えず上を目指して進んでいくものだと思っていました。",
      "もう少し努力し、もう少し勇気を持ち、慣れ親しんだ環境から一歩踏み出せば、理想とする人生に少しずつ近づけると信じていました。",
      "しかし、人生は想像していた以上に複雑なものだと気づきました。努力が必ずしも望んだ結果につながるわけではなく、自分で選択したからといって、その結果まで思い通りになるとは限りません。",
      "さまざまな国や地域で生活し、学び、働く機会に恵まれたことを、幸運に思っています。こうした経験を通じて、多くの可能性を知り、自分自身への期待も大きくなりました。時には先を急ぐあまり、自分が本当に何を求めているのか、立ち止まって考えることを忘れていました。",
      "最近、ビザの事情により台湾へ帰国することになり、これまで当たり前だと思っていたことを改めて見つめ直すようになりました。今もなお、失ったものを受け入れ、自分の未熟さと向き合いながら、成長する余地がまだ多くあることを学んでいます。",
      "これまでの道のりでは、多くの方々に支えていただきました。自分一人で歩んできたように思える道も、実際には家族や友人、先輩方の支えがあってこそのものでした。振り返ると、感謝の気持ちがより深まり、周囲の方々の経験や助言にも、より真摯に耳を傾けたいと思うようになりました。",
      "目の前の日々を大切にし、約束したことを一つひとつ果たしながら、少しずつ自分の進むべき道を見つけていくことも、前進の一つの形だと思います。",
      "まだ知らないことも多く、学びの途中にいます。これからは、自分を証明することを焦らず、もう少し心に余裕を持ち、感謝の気持ちを忘れずに歩んでいきたいと思います。",
      "成長とは、自分の小ささを知りながらも、なお前へ進む勇気を持つこと。"
    ]
  };

  function install() {
    if (!sheet || document.getElementById("home-reflection")) return;
    const template = document.createElement("template");
    template.innerHTML = `<dialog id="home-reflection" aria-label="我的近況">
    <article tabindex="-1" autofocus></article>
  </dialog>`;
    const dialog = template.content.firstElementChild;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "home-bubble-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
    const article = dialog.querySelector("article");
    function applyLanguage() {
      const requested = document.documentElement.lang;
      const locale = Object.hasOwn(copy, requested) ? requested : "en";
      if (article.lang === locale) return;
      article.lang = locale;
      const [open, title] = labels[locale];
      const paragraphs = copy[locale].map((text, index, lines) => {
        const paragraph = document.createElement("p");
        if (index === lines.length - 1) {
          const emphasis = document.createElement("strong");
          emphasis.textContent = text;
          paragraph.append(emphasis);
        } else {
          paragraph.textContent = text;
        }
        return paragraph;
      });
      article.replaceChildren(...paragraphs);
      dialog.scrollTop = 0;
      trigger.setAttribute("aria-label", open);
      dialog.setAttribute("aria-label", title);
    }

    const style = document.createElement("style");
    // Keep the original artwork and responsive coordinates in the viewport.
    style.textContent = sheet.textContent.replaceAll("#section-1::after", ".home-bubble-trigger") + `
      #section-1::after { content: none; }
      .home-bubble-trigger {
        position: fixed; z-index: 10; border: 0; padding: 0; appearance: none; cursor: pointer; pointer-events: auto;
        --dock-shift: 0px;
        animation: jarvis-dock-bubble 3s ease-in-out infinite;
        transform-origin: center;
        opacity: var(--bubble-opacity, 1); filter: blur(var(--bubble-blur, 0px));
        transition: opacity 180ms ease-out, filter 180ms ease-out, visibility 180ms;
      }
      .home-bubble-trigger[data-dispersed] { visibility: hidden; pointer-events: none; }
      .home-bubble-trigger:is(:hover, :focus-visible, [data-dispersed]),
      body:has(#home-reflection[open]) .home-bubble-trigger { animation-play-state: paused; }
      @media (prefers-reduced-motion: reduce) {
        .home-bubble-trigger { animation: none; filter: none; transition: none; }
      }
      [data-framer-name="Download CV Button Container"] { pointer-events: none; }
      [data-framer-name="Download CV Button Container"] a { pointer-events: auto; }
      .home-bubble-trigger:focus-visible { outline: 3px solid #ffbc23; outline-offset: 3px; }
      html:has(#home-reflection[open]) { overflow: hidden; }
      #home-reflection {
        box-sizing: border-box; width: min(44rem, calc(100% - 2rem));
        max-height: 86dvh; margin: auto; padding: clamp(18px, 3vw, 42px);
        overflow-y: auto; scrollbar-width: none; overscroll-behavior: contain; border: 0; border-radius: 14px;
        background: #201c1b; color: #fff9f0; font: 400 clamp(1rem, 1.2vw, 1.125rem)/1.75 system-ui, sans-serif;
      }
      #home-reflection::-webkit-scrollbar { display: none; }
      #home-reflection::backdrop { background: rgb(12 9 8 / 84%); }
      #home-reflection article { outline: none; }
      #home-reflection p { margin: 0 0 .85em; }
      #home-reflection p:last-child { margin-bottom: 0; }`;
    document.head.append(style);
    if (!document.getElementById("section-1")) style.textContent = style.textContent.replaceAll("#section-1", "#hero-section");
    document.body.append(trigger, dialog);
    applyLanguage();
    new MutationObserver(applyLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    trigger.onclick = () => {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
    };
    dialog.onclick = () => dialog.close();

    let frame = 0;
    function updateBubble() {
      frame = 0;
      const hero = document.querySelector("#section-1, #hero-section");
      const title = hero && [...hero.querySelectorAll("h1")].find(heading => heading.offsetWidth);
      if (!title) return;
      const top = title.getBoundingClientRect().top;
      const progress = window.scrollY > 0 ? Math.min(1, Math.max(0, (132 - top) / 108)) : 0;
      trigger.style.setProperty("--bubble-opacity", String(1 - progress));
      trigger.style.setProperty("--bubble-blur", `${progress * 18}px`);
      trigger.toggleAttribute("data-dispersed", progress === 1);
      trigger.inert = progress === 1;
    }

    function scheduleBubbleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateBubble);
    }

    window.addEventListener("scroll", scheduleBubbleUpdate, { passive: true });
    window.addEventListener("resize", scheduleBubbleUpdate);
    window.addEventListener("pageshow", scheduleBubbleUpdate);
    document.fonts.ready.then(scheduleBubbleUpdate);
    scheduleBubbleUpdate();
  }

  install();
})();
