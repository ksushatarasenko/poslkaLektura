let items = [];
let activeButton = null;

// Загружаем JSON-файл со списком
async function loadItems() {
  try {
    const res = await fetch("items.json");
    if (!res.ok) throw new Error("Ошибка загрузки items.json");
    items = await res.json();
  } catch (err) {
    console.error("Не удалось загрузить список:", err);
  }
}

async function playById(id) {
  if (items.length === 0) await loadItems();

  const item = items.find(i => i.id === id);
  if (!item) {
    console.error("Элемент с таким ID не найден:", id);
    return;
  }

  const index = items.findIndex(i => i.id === id);
  const nextItem = items[index + 1]; // следующая страница

  const audio = document.getElementById("player");
  const frame = document.getElementById("pageFrame");
  const header = document.querySelector(".pages h6");

  // 🔹 Обновляем заголовок
  header.textContent = `Strona ${id}`;

  // 🔹 Подсветка активной кнопки
  if (activeButton) activeButton.classList.remove("active");
  const newButton = document.querySelector(`button[onclick="playById('${id}')"]`);
  if (newButton) {
    newButton.classList.add("active");
    activeButton = newButton;
  }

  // 🔹 Загружаем аудио
  audio.src = item.audio;
  audio.onloadedmetadata = () => {
    audio.currentTime = item.time || 0;
    audio.play();
  };

  // 🔹 Определяем конец страницы
  let endTime = nextItem ? nextItem.time : null;

  // Убираем предыдущие слушатели
  audio.onended = null;
  audio.ontimeupdate = null;

  // 🔹 Останавливаем или переходим дальше
  if (endTime) {
    const stopListener = () => {
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.removeEventListener("timeupdate", stopListener);

        // ⏩ Автопереход на следующую страницу
        if (nextItem) {
          setTimeout(() => playById(nextItem.id), 800); // 0.8 секунды пауза
        }
      }
    };
    audio.addEventListener("timeupdate", stopListener);
  } else {
    // Если это последняя страница — просто останавливаемся
    audio.onended = () => {
      header.textContent = `Strona ${id} — (koniec książki 📖)`;
    };
  }

  // 🔹 Встраиваем картинку внутрь iframe
  frame.srcdoc = `
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${item.page}" alt="Strona ${id}">
      </body>
    </html>
  `;
}

window.playById = playById;
