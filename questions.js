document.querySelectorAll(".info-icon").forEach(icon => {
    icon.addEventListener("click", () => {
        const answer = icon.parentElement.nextElementSibling;

        // если открыто — закрыть
        if (answer.classList.contains("show")) {
            answer.classList.remove("show");
            setTimeout(() => answer.style.display = "none", 300);
        } 
        // если закрыто — открыть
        else {
            answer.style.display = "block";
            setTimeout(() => answer.classList.add("show"), 10);
        }
    });
});