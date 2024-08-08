mainContainer.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;
    if (target.className == "delToken") {
        let id = target.parentElement.parentElement.id;
        target.parentElement.parentElement.classList.add("fadeOut");
        let data = JSON.parse(localStorage.getItem('data'));
        if (data.length > 1) {
            data.splice(id, 1);
            localStorage.setItem('data', JSON.stringify(data));
            createTable();
        } else {
            target.parentElement.parentElement.remove();
            localStorage.setItem('data', JSON.stringify([]));
            createTable();
        }}
});

