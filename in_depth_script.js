// --- Elements ---
const tabImprovement = document.getElementById('tab-improvement');
const tabHiw = document.getElementById('tab-hiw');
const mainContent = document.getElementById('main-content');

const TRANSCRIPTION_PLACEHOLDER = "[Transcription output here]";
const CORRECT_COLOR = "#56F000";
const WRONG_COLOR = "#FF3B30";
const NEUTRAL_COLOR = "#C0C7D6";

var currInterval;
// stores the index of the previous augmentation played so that it isn't played twice in a rwo
var prevAugmentationInd = 0;  // initial state generated audio to play is 0 index  

// --- Tab utility ---
function setActiveTab(tab) {
    tabImprovement.classList.remove('active');
    tabHiw.classList.remove('active');
    tab.classList.add('active');
}

function playAndTranscribe(badTranscript, okTranscript, goodTranscript){
    let goodTranscriptEl = document.getElementById('with-asrboost');
    goodTranscriptEl.textContent = "";
    goodTranscriptEl.style = `color:${CORRECT_COLOR};`;

    let okTranscriptEl = document.getElementById("with-spec-aug");
    okTranscriptEl.textContent = "";

    let badTranscriptEl = document.getElementById('without');
    badTranscriptEl.innerHTML = "";

    document.getElementById('asr-audio').play();

    let goodList = goodTranscript.split(" ");
    let badList = badTranscript.split(" ");
    let okList = okTranscript.split(" ");
    let i = 0;  // index of word being shown
    currInterval = setInterval(function(){
        if(i >= goodList.length && i >= badList.length){
            clearInterval(currInterval);
        }
        if(i < goodList.length){
            goodTranscriptEl.textContent += `${goodList[i]} `;
        }
        if(i < okList.length){
            if(okList[i] == goodList[i]){
                okTranscriptEl.innerHTML += `<span style="color:${CORRECT_COLOR}">${okList[i]} </span>`;
            }
            else{
                okTranscriptEl.innerHTML += `<span style="color:${WRONG_COLOR}">${okList[i]} </span>`;
            }
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
        <div class="top-area">
            <label class="dropdown-label" for="audio-dropdown">Pick audio to transcribe:</label>
            <select id="audio-dropdown" class="full-width">
                <option value="audio1">Sample Audio 1</option>
                <option value="audio2">Sample Audio 2</option>
                <option value="audio3">Sample Audio 3</option>
            </select>

            <audio class="audio-player full-width" controls id="asr-audio">
                <source src="audio/asr/cen6-mjgm-b.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <button class="demo-btn full-width" id="transcribe-btn">
                Click here to see the ASRBoost advantage!
            </button>
        </div>

        <div class="model-results">
            <div class="info-block">
                <div class="info-bold">Model trained with ASRBoost</div>
                <div class="info-text" id="with-asrboost">${TRANSCRIPTION_PLACEHOLDER}</div>
            </div>
            <div class="info-block">
                <div class="info-bold">
                    Model trained with 
                    <a 
                        href="https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/asr/configs.html#augmentation-configurations" 
                        target="_blank"
                        style="color: #C0C7D6;"
                    >SpecAugment</a>
                </div>
                <div class="info-text" id="with-spec-aug">${TRANSCRIPTION_PLACEHOLDER}</div>
            </div>
            <div class="info-block">
                <div class="info-bold">Model trained without augmentation</div>
                <div class="info-text" id="without">${TRANSCRIPTION_PLACEHOLDER}</div>
            </div>
        </div>
        <div id="model-info" class="model-info">
            Models: NeMo ASR (100 epochs, AN4 dataset)<br>
            ASRBoost and SpecAugment training include 5x data augmentation
        </div>
    `;
    
    // Button logic
    document.getElementById('transcribe-btn').onclick = function() { 
        // bad, ok, good
        playAndTranscribe("one five of {?} foe", "one five two two our", "one five two two four");
    };

    document.getElementById('audio-dropdown').onchange = function(e) {
        clearInterval(currInterval);
        let audioSrc; let goodTranscript; let badTranscript; let okTranscript;
        switch (e.target.value) {
            case 'audio1': 
                audioSrc = 'audio/asr/cen6-mjgm-b.mp3'; 
                badTranscript = "one five of {?} foe";
                okTranscript = "one five two two our";
                goodTranscript = "one five two two four";
                break;
            case 'audio2': 
                audioSrc = 'audio/asr/cen3-menk-b.mp3'; 
                badTranscript = "six sixtitsxty {?} {?}";
                okTranscript = "sixty six thirtyter {?}";
                goodTranscript = "sixty six thirty three";
                break;
            case 'audio3': 
                audioSrc = 'audio/asr/cen4-fjlp-b.mp3'; 
                badTranscript = "e e r i r";
                okTranscript = "s e p e r";
                goodTranscript = "s p e e r";
                break;
        }
        document.getElementById('asr-audio').src = audioSrc;
        document.getElementById('transcribe-btn').onclick = function() {
            playAndTranscribe(badTranscript, okTranscript, goodTranscript);
        };

        document.getElementById('with-asrboost').textContent = TRANSCRIPTION_PLACEHOLDER;
        document.getElementById('with-asrboost').style = `color:${NEUTRAL_COLOR};`;
        document.getElementById('with-spec-aug').textContent = TRANSCRIPTION_PLACEHOLDER;
        document.getElementById('without').textContent = TRANSCRIPTION_PLACEHOLDER;
    };
}


// --- How It Works page content ---
function showHowItWorks() {
    mainContent.innerHTML = `
        <div class="hiw-section">
            <div class="top-area">
                <div class="info-block">
                    <div class="info-bold">
                        See how ASRBoost generates the extra training data that boosts your ASR models!
                    </div>
                </div>
                <label class="dropdown-label" for="audio-dataset-dropdown">Pick audio from sample dataset:</label>
                <select id="audio-dataset-dropdown" class="full-width" ">
                    <option value="0">Sample Audio 1</option>
                    <option value="1">Sample Audio 2</option>
                    <option value="2">Sample Audio 3</option>
                    <option value="3">Sample Audio 4</option>
                    <option value="4">Sample Audio 5</option>
                </select>
                <audio class="audio-player full-width" controls id="hiw-real-audio">
                    <source id="hiw-real-audio-src" src="audio/generation/0/real.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <button class="demo-btn full-width" id="run">Run ASRBoost</button>
            </div>
            
            <div class="info-text" id="generating" style="display:none;">
                Generating new & realistic voice...
            </div>
            <div class="info-text" id="combining" style="display:none;">
                Combining new voice with original words...
            </div>
            <div id="generation-result" style="display:none;">
                <audio class="audio-player full-width" controls id="hiw-generated-audio">
                    <source id="hiw-generated-audio-src" src="audio/generation/0/augment0.mp3" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <div class="info-bold" style="margin:1%;">
                    Done! ASRBoost repeats this process on every audio clip to expand your dataset and improve ASR models.
                </div>
                <button class="demo-btn full-width" id="restart">Restart</button>
            </div>
        </div>
    `;

    document.getElementById('audio-dataset-dropdown').onchange = function(e) {
        let realAudioSrc = document.getElementById("hiw-real-audio-src");
        realAudioSrc.src = `audio/generation/${e.target.value}/real.mp3`;
        let realAudioTag = document.getElementById("hiw-real-audio");
        realAudioTag.load();
        
        let randNum = pickRandNumButNot(prevAugmentationInd);
        let generatedAudioSrc = document.getElementById("hiw-generated-audio-src");
        generatedAudioSrc.src = `audio/generation/${e.target.value}/augment${randNum}.mp3`;
        let generatedAudioTag = document.getElementById("hiw-generated-audio");
        generatedAudioTag.load();
        prevAugmentationInd = randNum;
    }

    document.getElementById("run").onclick = function(e){
        document.getElementById("generating").style = "display:visible; margin:2%;";
        setTimeout(function(){
            document.getElementById("combining").style = "display:visible; margin:2%;";
        }, 500);
        setTimeout(function(){
            document.getElementById("generation-result").style = "display:visible;";
            let generatedAudioTag = document.getElementById("hiw-generated-audio");
            generatedAudioTag.play();
        }, 1000);
    }

    document.getElementById("restart").onclick = function(e){
        // hide stuff
        document.getElementById("generating").style = "display:none;";
        document.getElementById("combining").style = "display:none;";
        document.getElementById("generation-result").style = "display:none;";
        // set new generated audio
        let randNum = pickRandNumButNot(prevAugmentationInd);
        let generatedAudioSrc = document.getElementById("hiw-generated-audio-src");
        // audio/generation/{dataset index}/augment{augmentation index}.mp3
        // just replace augment{prevAugmentationInd} with augment{randNum}
        generatedAudioSrc.src = generatedAudioSrc.src.replace(`augment${prevAugmentationInd}`, `augment${randNum}`);
        let generatedAudioTag = document.getElementById("hiw-generated-audio");
        generatedAudioTag.load();
        prevAugmentationInd = randNum;
    }
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
