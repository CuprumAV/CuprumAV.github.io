
window.onload = disabled;
function disabled(){
    var but = document.querySelector('.text-reg');
    but.disabled = true;

    var head = document.querySelector(".buts");
    head.onclick = disabledF;
    function disabledF(){
    var but = document.querySelector('.text-reg');
    but.disabled = false;
    }
}