let randomNumbers;
let rightAnswer= [];
quantityTest = 40;
fetch('Test1.txt')
  .then(response => response.text())
  .then(data => {
    const container = document.getElementById('container'); // Елемент для відображення вмісту
    const lines = data.split(/\r?\n|\r/); // Розбиваємо вміст на рядки

    function getRandomNumbers() {
      let numbers = new Set();
      while (numbers.size < quantityTest) {
        let randomNumber = Math.floor(Math.random()*(lines.length/7)); // Генеруємо випадкове число від 0 до 200
        numbers.add(randomNumber);
      }
      return Array.from(numbers);
    }
    randomNumbers = getRandomNumbers();
    for(let i = 0; i<quantityTest;i++){
      let randomNumber = randomNumbers[i];
      container.innerHTML += `
        <div id="div-test${i}">
          <p>${lines[randomNumber*7]}</p>
          <input type="radio" name="test${i}" id="" value="1"><label for="">${lines[randomNumber*7+2]}</label><br>
          <input type="radio" name="test${i}" id="" value="2"><label for="">${lines[randomNumber*7+3]}</label><br>
          <input type="radio" name="test${i}" id="" value="3"><label for="">${lines[randomNumber*7+4]}</label><br>
          <input type="radio" name="test${i}" id="" value="4"><label for="">${lines[randomNumber*7+5]}</label><br>
          <input type="radio" name="test${i}" id="" value="5"><label for="">${lines[randomNumber*7+6]}</label><br>
          <p id="test${i}"></p>          
        <div>
      `;
      rightAnswer.push(Number(lines[randomNumber*7+1]));
    }
    container.innerHTML += `<button style="padding:5px; font-size:20px;">Перевірити</button>`;
  })
  .catch(err => {
    console.error(err);
  });
function myFunction(event){
  let quantityRightAnswer = 0;
  let quantityWrongAnswer = 0;
  event.preventDefault();
  console.log(rightAnswer);
  for(let i = 0; i<quantityTest;i++){
    let rightAnsw = "A";
    switch(rightAnswer[i]){
      case 2: rightAnsw = "B";break;
      case 3: rightAnsw = "C";break;
      case 4: rightAnsw = "D";break;
      case 5: rightAnsw = "E";break;
    }
    let radioButton = document.querySelector(`input[name="test${i}"]:checked`);
    let p = document.getElementById(`test${i}`);
    if(radioButton!=null){
      if(Number(radioButton.value)==rightAnswer[i]){
        quantityRightAnswer++;
        p.innerHTML = `<div style="color:green;">Правильна відповідь</div>`;
      }else{
        quantityWrongAnswer++;
        p.innerHTML = `<div style="color:red;">Неправильна відповідь. Правильна відповідь: ${rightAnsw}</div>`;
      }
    }else{
      quantityWrongAnswer++;
      p.innerHTML = `<div style="color:red;">Неправильна відповідь. Правильна відповідь: ${rightAnsw}</div>`;
    }
  }
  let divAnswer = document.getElementById("answeres");
  divAnswer.textContent = `Кількість правильних відповідей: ${quantityRightAnswer}`;
  alert(`Кількість правильних відповідей: ${quantityRightAnswer}`);
}