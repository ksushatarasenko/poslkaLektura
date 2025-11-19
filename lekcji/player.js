document.addEventListener("DOMContentLoaded", () => {
  let items = [];
  let activeButton = null;
  let userInteracted = false;
  let loadingNext = false;
  const transitionDelay = 1200; // ⏳ задержка между страницами (мс)

  async function loadItems() {
    const res = await fetch("items.json");
    items = await res.json();
  }

  function waitForAudioCanPlay(audio, timeout = 5000) {
    return new Promise(resolve => {
      if (audio.readyState >= 3) return resolve();
      const timer = setTimeout(() => resolve(), timeout);
      audio.oncanplay = () => {
        clearTimeout(timer);
        resolve();
      };
    });
  }

  const loaderHTML = `
    <html>
      <head>
        <style>
          html, body {
            margin:0; padding:0; height:100%;
            display:flex; justify-content:center; align-items:center;
            background:#000; color:#fff; font-family:sans-serif;
          }
          .loader {
            border:6px solid #333;
            border-top:6px solid #0af;
            border-radius:50%;
            width:60px; height:60px;
            animation:spin 1s linear infinite;
          }
          img{width: 100%}
          @keyframes spin {
            0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}
          }
          p { position:absolute; bottom:40%; text-align:center; width:100%; }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <p>Ładowanie strony...</p>
      </body>
    </html>
  `;

  async function playById(id, userClick = true, autoPlay = true) {
    if (items.length === 0) await loadItems();

    const item = items.find(i => i.id === id);
    if (!item) return console.error("Страница не найдена:", id);

    const index = items.findIndex(i => i.id === id);
    const nextItem = items[index + 1];

    const audio = document.getElementById("player");
    const frame = document.getElementById("pageFrame");
    const header = document.querySelector(".pages h6");

    header.textContent = `Strona ${id}`;
    if (activeButton) activeButton.classList.remove("active");
    const btn = document.querySelector(`button[onclick="playById('${id}')"]`);
    if (btn) { btn.classList.add("active"); activeButton = btn; }

    frame.srcdoc = loaderHTML;

    if (audio.src !== item.audio) {
      audio.src = item.audio;
      await waitForAudioCanPlay(audio);
    }

    audio.pause();
    audio.currentTime = item.start;

    await new Promise(r => setTimeout(r, 100));

    frame.srcdoc = `
      <html>
        <head>
          <style>
            html, body {
              margin:0; padding:0; width:100%;
              display:flex; justify-content:center; align-items:center;
              background:#000;
            }
            img { max-width:100%;object-fit:contain; }
          </style>
        </head>
        <body>
          <img src="${item.page}" alt="Strona ${id}">
        </body>
      </html>
    `;

    // ждём загрузку картинки
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    // 🔹 Страница 03 НИКОГДА не запускается автоматически
    if (id === "03") {
      console.log("Strona 3: ручной запуск только!");
      return; // ⛔ выход без воспроизведения
    }

    // 🔹 Остальные — автозапуск, если разрешено
    if (autoPlay) {
      await new Promise(r => setTimeout(r, 200));
      try {
        await audio.play();
      } catch (e) {
        console.warn("Не удалось начать воспроизведение:", e);
      }
    }

    // 🔹 Контроль конца страницы
    const onTime = async () => {
      if (loadingNext) return;
      if (audio.currentTime >= item.end) {
        audio.pause();
        audio.removeEventListener("timeupdate", onTime);

        if (!userInteracted && nextItem) {
          loadingNext = true;
          await new Promise(r => setTimeout(r, transitionDelay));
          await playById(nextItem.id, false, true);
          loadingNext = false;
        } else if (!nextItem) {
          header.textContent = `Strona ${id} — (koniec książki 📖)`;
        }
      }
    };
    audio.addEventListener("timeupdate", onTime);

    if (userClick) {
      userInteracted = true;
      setTimeout(() => (userInteracted = false), 2000);
    }
  }

  window.playById = playById;

  // ⛔ Запуск 3-й страницы вручную (без автоплея)
  loadItems().then(() => playById("03", false, false));
});







