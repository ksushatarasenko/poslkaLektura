const player = document.getElementById('player');

    document.querySelectorAll('.playable').forEach(word => {
      word.addEventListener('click', () => {
        const src = word.getAttribute('data-audio');
        player.src = src;
        player.play();
      });
    });

    // кликаешь по времени, и плеер перематывает аудио к нужному моменту:
function setTime(event, seconds) {
  event.preventDefault(); // отменяем переход по ссылке
  const audio = document.getElementById("audio");
  if (audio) {
    audio.currentTime = seconds;
    audio.play();
  }
}



function playItem(index) {
  const item = items[index];
  const audio = document.getElementById('player');
  const frame = document.getElementById('pageFrame');

  audio.src = item.audio;
  frame.src = item.page;

  audio.onloadedmetadata = () => {
    audio.currentTime = item.time;
    audio.play();
  };
}