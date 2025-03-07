let menuState = false;

function openMenuButton() {
    openMenuButton = createButton("»");
    openMenuButton.position(width, height);
    openMenuButton.mousePressed(() => toggleMenu(menuState));
}

function toggleMenu(menuState) {
    menuState =! menuState;
}