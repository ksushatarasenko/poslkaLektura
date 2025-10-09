// prowerka Optima

function toggleHint1(element, event) {
    event.stopPropagation(); // остановить всплытие
    element.classList.toggle('active');
}

function toggleHint2(element, event) {
    event.stopPropagation(); // остановить всплытие
    element.classList.toggle('active');
}


// Увеличение картинки при клике
document.addEventListener('DOMContentLoaded', function () {
    var zoomableImages = document.querySelectorAll('.zoomable');

    zoomableImages.forEach(function (img) {
        img.addEventListener('click', function () {
            this.classList.toggle('zoomed');
        });
    });
    // Зачёркивание слов
    initWordStrikethrough();
});