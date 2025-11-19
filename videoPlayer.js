

// 1) Подключаем YouTube IFrame API
// Добавь этот <script> один раз в <head> или перед закрывающим </body>
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// 2) Переменные плеера
let player;
const VIDEO_ID = 'iQPuMsCTCaU'; // <- замените на ваш YouTube ID (из embed src)

// 3) Функция, которую YouTube вызовет, когда API готов
function onYouTubeIframeAPIReady() {
  player = new YT.Player('audio', {
    height: '315',
    width: '560',
    videoId: VIDEO_ID,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      enablejsapi: 1,
      //autoplay: 0, // не ставим autoplay сразу
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Плеер готов. Можно подписать обработчики кликов.
  initSeekLinks();
}

function onPlayerStateChange(event) {
  // Здесь можно обрабатывать окончание (event.data === YT.PlayerState.ENDED) и т.д.
}

// 4) Инициализация обработчиков ссылок
function initSeekLinks() {
  document.querySelectorAll('a.seek').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const start = Number(this.getAttribute('data-start')) || 0;
      seekAndPlay(start);
    });
  });
}

// 5) Основная функция — прыжок и воспроизведение
function seekAndPlay(seconds) {
  if (!player || typeof player.seekTo !== 'function') {
    // Если по какой-то причине плеер ещё не готов, делаем fallback: меняем src
    const iframe = document.getElementById('audio');
    iframe.innerHTML = `<iframe width="560" height="315"
      src="https://www.youtube.com/embed/${VIDEO_ID}?start=${Math.floor(seconds)}&autoplay=1&rel=0"
      frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    return;
  }
  // Если плеер готов:
  try {
    player.seekTo(seconds, true); // true — точный seek
    player.playVideo();
  } catch (err) {
    console.warn('seek/play error, fallback to reload iframe', err);
    // fallback — перезагрузить iframe с параметром start
    const container = document.getElementById('audio');
    container.innerHTML = `<iframe width="560" height="315"
      src="https://www.youtube.com/embed/${VIDEO_ID}?start=${Math.floor(seconds)}&autoplay=1&rel=0"
      frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }
}
