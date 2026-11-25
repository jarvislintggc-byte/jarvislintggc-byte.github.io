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
      "從萬華出發，走向世界，再重新認識自己。",
      "小時候在萬華長大的我，其實並不是一個愛讀書的孩子。",
      "那時候的我，從來沒有想過，有一天自己會在日本生活多年、創業、學習不同的語言，甚至遠赴美國攻讀碩士，努力走進半導體產業。",
      "回頭看，人生中的每一次轉變，都不是理所當然。",
      "從十二歲開始的六年住宿學校生活，到獨自前往日本留學；從十九歲開始經濟獨立，到一邊求學、一邊經營自己的事業；再從菲律賓的語言學習，走到美國的研究所。",
      "這一路上，我做過正確的選擇，也犯過許多錯誤。有過值得驕傲的時刻，也有過無數次對自己的懷疑。",
      "曾經，我以為人生是一條不斷向上的道路。",
      "只要努力一點、勇敢一點，願意走出熟悉的環境，就能慢慢接近自己想要的生活。",
      "直到最近，我才逐漸明白，人生並不總是如此。",
      "努力未必會得到期待的回報，做了選擇，也不代表就能掌握結果。",
      "因為簽證問題，我不得不離開原本期待展開職涯的美國，回到台灣，重新思考自己的下一步。",
      "兜兜轉轉，走過了不同的國家，認識了不同的人，最後又回到了自己最初出發的地方。",
      "我仍舊渴望成功，仍舊對世界充滿好奇，也仍舊希望有一天，能夠成為連結台灣、日本與美國的橋樑。",
      "只是現在的我，開始明白人生不只有向上攀爬，也有停下來、失去、接受，以及重新開始。",
      "或許成長不是變得越來越厲害，而是越來越清楚自己的渺小，卻依然有勇氣繼續前進。"
    ],
    "en": [
      "From Wanhua into the world, and back to a new understanding of myself.",
      "Growing up in Wanhua, I was never much of a student.",
      "Back then, I never imagined that I would spend years living in Japan, start a business, learn other languages, or travel as far as the United States to earn a master’s degree and work toward a career in the semiconductor industry.",
      "Looking back, I realize that none of these turning points was a given.",
      "At twelve, I started six years of boarding school. Then I went to Japan on my own to study. At nineteen, I became financially independent, and I went on to run my own business while studying. Later, language studies in the Philippines led me to graduate school in the United States.",
      "Along the way, I made good decisions and plenty of mistakes. There were moments I was proud of and countless times when I doubted myself.",
      "I once thought life was a steady climb upward.",
      "I believed that if I worked a little harder, found a little more courage, and stepped outside what was familiar, I could gradually move closer to the life I wanted.",
      "Only recently have I begun to understand that life doesn’t always unfold that way.",
      "Hard work doesn’t always bring the reward we hope for, and making a choice doesn’t give us control over what happens next.",
      "Because of visa issues, I had to leave the United States, where I had hoped to start my career, and return to Taiwan to rethink my next step.",
      "After all those detours, after living in different countries and meeting so many people, I found myself back where I started.",
      "I still want to succeed. I’m still curious about the world, and I still hope to become a bridge between Taiwan, Japan, and the United States someday.",
      "What I’m beginning to understand now is that life also asks us to stop, to lose things, to accept what has happened, and to start again.",
      "Maybe growth is about seeing more clearly how small we are and still finding the courage to keep going."
    ],
    "ja": [
      "萬華から世界へ。そして、あらためて自分を知る。",
      "萬華で育った子どもの頃の私は、実は勉強が好きではありませんでした。",
      "当時は、いつか日本で何年も暮らし、起業し、さまざまな言葉を学び、さらにはアメリカに渡って修士号を取得し、半導体業界を目指すようになるとは、想像もしていませんでした。",
      "振り返ると、人生の一つひとつの転機は、決して当たり前に訪れたものではありません。",
      "12歳から6年間の寮生活を送り、その後、一人で日本へ留学しました。19歳で経済的に自立し、学業と並行して自分の事業を営みました。やがてフィリピンでの語学学習を経て、アメリカの大学院へ進みました。",
      "その道のりでは、正しい選択もしましたが、たくさんの失敗もしました。誇りに思える瞬間もあれば、自分を疑ったことも数え切れないほどあります。",
      "かつて私は、人生とは上へと登り続ける道だと思っていました。",
      "もう少し努力し、もう少し勇気を出して、慣れ親しんだ環境から一歩踏み出せば、望む暮らしに少しずつ近づけると信じていました。",
      "でも最近になって、人生はいつもそう進むわけではないと、少しずつ分かってきました。",
      "努力がいつも期待どおりに報われるとは限りません。自分で選んだ道でも、その先の結果まで思いどおりにできるわけではありません。",
      "ビザの事情で、キャリアを始めたいと思っていたアメリカを離れざるを得なくなり、台湾に戻って次の一歩を考え直すことになりました。",
      "いくつもの国を巡り、さまざまな人と出会い、回り道をした末に、私は最初の出発点へ戻ってきました。",
      "今も成功したいという思いは変わりません。世界への好奇心も、いつか台湾、日本、アメリカをつなぐ架け橋になりたいという願いも、変わりません。",
      "今の私は、人生には上を目指すことだけでなく、立ち止まること、失うこと、受け入れること、そして再び始めることもあるのだと、少しずつ理解し始めています。",
      "成長とは、自分がどんどん立派になることよりも、自分の小ささをより深く知り、それでも前に進む勇気を持ち続けることなのかもしれません。"
    ]
  };

  const bubbleTitles = { "zh-Hant": "我的故事", en: "My Story", ja: "私の物語" };

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
      const paragraphs = copy[locale].map((text, index) => {
        const paragraph = document.createElement("p");
        if (index === 0) {
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
      trigger.textContent = bubbleTitles[locale];
      trigger.setAttribute("aria-label", open);
      dialog.setAttribute("aria-label", title);
    }

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Klee+One:wght@600&display=swap&text=" +
      encodeURIComponent(Object.values(bubbleTitles).join(""));
    document.head.append(font);

    const style = document.createElement("style");
    // Keep the original artwork and responsive coordinates in the viewport.
    style.textContent = sheet.textContent.replaceAll("#section-1::after", ".home-bubble-trigger") + `
      #section-1::after { content: none; }
      .home-bubble-trigger {
        position: fixed; z-index: 10; border: 0; padding: 0; appearance: none; cursor: pointer; pointer-events: auto;
        display: grid; place-items: center; padding: 0 .45em .45em 0;
        color: #332520; font: 600 clamp(.78rem, 2.25vw, 1.65rem)/1.15 "Klee One", "DFKai-SB", "Segoe Print", cursive;
        white-space: nowrap;
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
