/* */
var sertificate = document.querySelector('.text-reg');
var button = document.querySelector(".buts");
var regInput = document.getElementById('reg');

button.onclick = disabled;
function disabled(){
    if(sertificate.disabled = true){
        sertificate.disabled = false;
        button.src = 'img/GAlochka.gif';
    }
    /*Не працює
    else if(sertificate.disabled = false){
        sertificate.disabled = true;
        button.src = 'img/inst_logo.png';
    }*/

}
sertificate.onclick = serInput;
function serInput(){
    if(!reg){
        alert('HEH');
    }
}
