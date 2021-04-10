function myfunction(){
    var minInput = document.querySelector('.min_input');
    var maxInput = document.querySelector('.max_input');
    var generateButton = document.querySelector('.generate');
    var result = document.querySelector('.output');

    //Змінні для чисел input
    var min = minInput.value;
    var max = maxInput.value;
    //Переводимо текст в цифри
    var min_n = Number.parseInt(min);
    var max_n = Number.parseInt(max);

    //ИВзначаємо рандомний номер
    var numb = Math.floor(Math.random() * (max_n-(min_n-1))) + min_n;
    //Виводимо
    result.innerHTML = numb;
}