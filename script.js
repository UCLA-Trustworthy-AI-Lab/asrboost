// --- Elements ---
const tabImprovement = document.getElementById('tab-improvement');
const tabHiw = document.getElementById('tab-hiw');
const mainContent = document.getElementById('main-content');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

const TRANSCRIPTION_PLACEHOLDER = "[Transcription output here]";
const CORRECT_COLOR = "#56F000";
const WRONG_COLOR = "#FF3B30";
const NEUTRAL_COLOR = "#C0C7D6";

var currInterval;
// stores the index of the previous augmentation played so that it isn't played twice in a rwo
var prevAugmentationInd = -1;  

// --- Tab utility ---
function setActiveTab(tab) {
    tabImprovement.classList.remove('active');
    tabHiw.classList.remove('active');
    tab.classList.add('active');
}

function playAndTranscribe(goodTranscript, badTranscript){
    let goodTranscriptEl = document.getElementById('with-instant');
    let badTranscriptEl = document.getElementById('without-instant');
    goodTranscriptEl.textContent = "";
    goodTranscriptEl.style = `color:${CORRECT_COLOR};`;
    badTranscriptEl.innerHTML = "";

    document.getElementById('asr-audio').play();

    let goodList = goodTranscript.split(" ");
    let badList = badTranscript.split(" ");
    let i = 0;  // index of word being shown
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
        i += 1;
    }, 400);    
}

function showImprovement() {
    mainContent.innerHTML = `
        <div class="asr-top-area">
            <label class="dropdown-label" for="audio-dropdown">Pick audio to transcribe:</label>
            <select id="audio-dropdown" class="full-width">
                <option value="audio1">Sample Audio 1</option>
                <option value="audio2">Sample Audio 2</option>
                <option value="audio3">Sample Audio 3</option>
            </select>

            <audio class="audio-player full-width" controls id="asr-audio">
                <source src="audio/asr/cen6-marh-b.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <button class="transcribe-btn full-width" id="transcribe-btn">Play and Transcribe</button>
        </div>

        <div class="model-results">
            <div class="model-block">
                <div class="model-title">Model trained with ASRBoost</div>
                <div class="model-placeholder" id="with-instant">${TRANSCRIPTION_PLACEHOLDER}</div>
            </div>
            <div class="model-block">
                <div class="model-title">Model trained without ASRBoost</div>
                <div class="model-placeholder" id="without-instant">${TRANSCRIPTION_PLACEHOLDER}</div>
            </div>
        </div>
        <div id="model-info" class="model-info">
            Models: NeMo ASR (100 epochs, AN4 dataset)<br>
            ASRBoost training includes 4x data augmentation
        </div>
    `;
    
    // Button logic
    document.getElementById('transcribe-btn').onclick = function() { 
        playAndTranscribe("one five two three two", "one five two wotwo");
    };

    document.getElementById('audio-dropdown').onchange = function(e) {
        clearInterval(currInterval);
        let audioSrc; let goodTranscript; let badTranscript;
        switch (e.target.value) {
            case 'audio1': 
                audioSrc = 'audio/asr/cen6-marh-b.mp3'; 
                badTranscript = "one five two wotwo";
                goodTranscript = "one five two three two";
                break;
            case 'audio2': 
                audioSrc = 'audio/asr/cen6-fcaw-b.mp3'; 
                badTranscript = "fone five tw o six";
                goodTranscript = "one five two three six";
                break;
            case 'audio3': 
                audioSrc = 'audio/asr/an433-marh-b.mp3'; 
                badTranscript = "enter tine tyfn onen";
                goodTranscript = "enter four five eight two one";
                break;
        }
        document.getElementById('asr-audio').src = audioSrc;
        document.getElementById('transcribe-btn').onclick = function() {
            playAndTranscribe(goodTranscript, badTranscript);
        };

        document.getElementById('with-instant').textContent = TRANSCRIPTION_PLACEHOLDER;
        document.getElementById('with-instant').style = `color:${NEUTRAL_COLOR};`;
        document.getElementById('without-instant').textContent = TRANSCRIPTION_PLACEHOLDER;
    };
}


// --- How It Works page content ---
function showHowItWorks() {
    mainContent.innerHTML = `
        <div class="hiw-section">
            <div class="hiw-title">Your Dataset</div>
            ${[0, 1, 2, 3, 4].map(i => `
                <div class="hiw-set">
                    <audio class="hiw-audio" controls>
                        <source src="audio/generation/${i}/real.mp3" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                    <button class="generate-btn" data-audio="${i}">Generate instant speech data</button>
                </div>
            `).join('')}
        </div>
    `;

    // Attach events to each "Generate instant speech data" button
    document.querySelectorAll('.generate-btn').forEach(btn => {
        btn.onclick = () => {
            // Randomize audio example
            let idx = btn.dataset.audio;
            let modalAudio = modalOverlay.querySelector('audio source');
            let randNum = pickRandNumButNot(prevAugmentationInd);
            modalAudio.src = `audio/generation/${idx}/augment${randNum}.mp3`;
            modalOverlay.querySelector('audio').load();
            modalOverlay.querySelector('audio').play();
            modalOverlay.style.display = 'block';
            document.getElementById("modalGeneration").setAttribute("data-audio", idx);
            prevAugmentationInd = randNum;
        };
    });
}

function pickRandNumButNot(badNum){
    // numbers to pick are always 0, 1, 2, 3, 4 
    let choices = [];
    for(let i = 0; i < 5; i++){
        if(i == badNum){
            continue;
        }
        choices.push(i);
    }
    return choices[Math.floor(Math.random() * 4)];
}

// --- Modal/Popup logic ---
modalClose.onclick = () => {
    let modalAudio = modalOverlay.querySelector('audio');
    modalAudio.pause();
    modalAudio.currentTime = 0;
    modalOverlay.style.display = 'none';
};
modalOverlay.onclick = e => {
    if(e.target === modalOverlay){
        let modalAudio = modalOverlay.querySelector('audio');
        modalAudio.pause();
        modalAudio.currentTime = 0;
        modalOverlay.style.display = 'none';
    }
};

// --- Tab events ---
tabImprovement.onclick = () => {
    setActiveTab(tabImprovement);
    showImprovement();
};
tabHiw.onclick = () => {
    setActiveTab(tabHiw);
    showHowItWorks();
};

// --- On page load ---
showImprovement();
