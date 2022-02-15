document.querySelectorAll('.delivery-accordeon__title').forEach((item) => {
    item.addEventListener('click', (e) => {
        e.path[1].classList.toggle('accordeon-item__active');
    })
});
