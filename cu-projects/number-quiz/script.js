//Гра
function game(){
    //Випадкове число
    var randomNumber = Math.floor(Math.random() * 20) + 1;
    console.log(randomNumber);
    
    //Очки
    var score = 100;

    //Переводиме важливе в перемінні
    var showRandomNumber = document.querySelector('.number_random');
    var scores = document.querySelector('.scoreN');
    //Виводимо загадане число
    showRandomNumber.innerHTML = randomNumber;

    var i = 0;
    while(i<10){
        var guess = prompt('Введіть число. У вас залишається ' + score + ' очків');
        console.log(guess);
        if (guess === null){
            break;
        } else if(guess.length>2){
            alert("Максимальне число: 20");
            i--;
        }else if(guess>20){
            alert("Максимальне число: 20");
            i--;
        } else if(guess == 0){
            alert('Введіть число більше ніж 0');
            i--;
        } else{
            //Якщо виграв
            if(randomNumber == guess){
                alert("Так, ти найкращий");
                break;
            }
            //Ввів неправильне число 
            else if(guess !== randomNumber){
                alert('Ти ввів неравильне число');
                score -=10;
            }
        }
        i++;
        //Виводимо скільки очків залишилося
        scores.innerHTML = score;
    }
    //Якщо гравець програв
    if (i == 10){
        alert('Ти програв. Загадане число: ' + randomNumber);
    }
}