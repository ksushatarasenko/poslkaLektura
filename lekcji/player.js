document.addEventListener("DOMContentLoaded", () => {
  let items = [];
let activeButton = null;

// 🔹 Загрузка списка страниц и аудио
async function loadItems() {
  try {
    const res = await fetch("items.json");
    if (!res.ok) throw new Error("Ошибка загрузки items.json");
    items = await res.json();
  } catch (err) {
    console.error("Не удалось загрузить список:", err);
  }
}

// 🔹 Ждём, пока аудио будет готово к воспроизведению
function waitForAudioCanPlay(audio, timeout = 5000) {
  return new Promise(resolve => {
    if (audio.readyState >= 3) return resolve(); // уже готово
    const timer = setTimeout(() => resolve(), timeout); // резервный таймаут
    audio.oncanplay = () => {
      clearTimeout(timer);
      resolve();
    };
  });
}

// 🔹 Основная функция воспроизведения по ID страницы
async function playById(id, userClick = true) {
  if (items.length === 0) await loadItems();

  const item = items.find(i => i.id === id);
  if (!item) return console.error("Элемент с таким ID не найден:", id);

  const index = items.findIndex(i => i.id === id);
  const nextItem = items[index + 1];

  const audio = document.getElementById("player");
  const frame = document.getElementById("pageFrame");
  const header = document.querySelector(".pages h6");

  // 🔹 Заголовок и подсветка кнопки
  header.textContent = `Strona ${id}`;
  if (activeButton) activeButton.classList.remove("active");
  const newButton = document.querySelector(`button[onclick="playById('${id}')"]`);
  if (newButton) {
    newButton.classList.add("active");
    activeButton = newButton;
  }

  // 🔹 Встраиваем картинку внутрь iframe
  frame.srcdoc = `
    <html>
      <head>
        <style>
          html, body { margin:0; padding:0; width:100%; display:flex; justify-content:center; align-items:center; background:#000;}
          img { max-width:100%; max-height:100%; object-fit:contain; }
        </style>
      </head>
      <body>
        <img src="${item.page}" alt="Strona ${id}">
      </body>
    </html>
  `;

  // 🔹 Настройка аудио
  audio.src = item.audio;

  // 🔹 Сбрасываем предыдущие слушатели
  audio.onended = null;
  audio.ontimeupdate = null;

  // 🔹 Ждём полной готовности аудио
  await waitForAudioCanPlay(audio);
  audio.currentTime = item.time || 0;
  audio.play().catch(e => console.log("Ошибка воспроизведения:", e));

  // 🔹 Автопереход на следующую страницу
  if (nextItem) {
    const stopListener = () => {
      if (audio.currentTime >= nextItem.time) {
        audio.pause();
        audio.removeEventListener("timeupdate", stopListener);

        // Автозапуск следующей страницы, только если не клик пользователя
        if (!userClick) {
          setTimeout(() => playById(nextItem.id, false), 500);
        }
      }
    };
    audio.addEventListener("timeupdate", stopListener);
  } else {
    // Последняя страница
    audio.onended = () => {
      header.textContent = `Strona ${id} — (koniec książki 📖)`;
    };
  }
}

// 🔹 Делаем функцию глобальной для использования из HTML
window.playById = playById;

});


