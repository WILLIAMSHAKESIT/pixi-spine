import Game from "./core/desktop/Game"
import GameMobile from "./core/mobile/Game"
import "./main.css"

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    new GameMobile();
    document.getElementsByTagName("body")[0].classList.remove("desktop");
    document.getElementsByTagName("canvas")[0].classList.remove("desktop");
}else{
    new Game();
    document.getElementsByTagName("body")[0].classList.add("desktop");
    document.getElementsByTagName("canvas")[0].classList.add("desktop");
}

window.addEventListener('touchend', function () {
    var elem = document.documentElement;
    elem.requestFullscreen();
})