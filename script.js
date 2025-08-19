const CORRECT_COLOR = "#56F000";
const WRONG_COLOR = "#FF3B30";
let currInterval;

function playAndTranscribe(goodTranscript, badTranscript){
  let goodTranscriptEl = document.getElementById('with-instant');
  let badTranscriptEl = document.getElementById('without-instant');
  goodTranscriptEl.style = `color:${CORRECT_COLOR};`;
  goodTranscriptEl.textContent = "";
  badTranscriptEl.textContent = "";

  let goodList = goodTranscript.split(" ");
  let badList = badTranscript.split(" ");

  let i = 0;
  document.getElementById('asr-audio').play();

  clearInterval(currInterval); // reset previous
  currInterval = setInterval(function(){
    if(i >= goodList.length && i >= badList.length){
      clearInterval(currInterval);
    }
    if(i < goodList.length){
      goodTranscriptEl.textContent += `${goodList[i]} `;
    }
    if(i < badList.length){
      if(badList[i] == goodList[i]){
        badTranscriptEl.innerHTML += `<span style="color:${CORRECT_COLOR}">${badList[i]} </span>`;
      }
      else{
        badTranscriptEl.innerHTML += `<span style="color:${WRONG_COLOR}">${badList[i]} </span>`;
      }
    }
    i++;
  }, 400);
}
