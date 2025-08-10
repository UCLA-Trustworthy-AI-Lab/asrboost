// --- Elements ---
const tabImprovement = document.getElementById('tab-improvement');
const tabHiw = document.getElementById('tab-hiw');
const mainContent = document.getElementById('main-content');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

// --- Tab utility ---
function setActiveTab(tab) {
    tabImprovement.classList.remove('active');
    tabHiw.classList.remove('active');
    tab.classList.add('active');
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
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>

            <button class="transcribe-btn full-width" id="transcribe-btn">Play and Transcribe</button>
        </div>

        <div class="model-results">
            <div class="model-block">
                <div class="model-title">Model trained w/ an4 + instant speech data</div>
                <div class="model-placeholder" id="with-instant">[Transcription output here]</div>
            </div>
            <div class="model-block">
                <div class="model-title">Model trained without instant speech data</div>
                <div class="model-placeholder" id="without-instant">[Transcription output here]</div>
            </div>
        </div>
    `;
    
    // Button logic
    document.getElementById('transcribe-btn').onclick = function() {
        document.getElementById('with-instant').textContent = 'The quick brown fox jumps over the lazy dog. (with instant speech data)';
        document.getElementById('without-instant').textContent = 'The quick brown fox jumps over the dog. (without instant speech data)';
        document.getElementById('asr-audio').play();
    };

    document.getElementById('audio-dropdown').onchange = function(e) {
        let audioSrc;
        switch (e.target.value) {
            case 'audio1': audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; break;
            case 'audio2': audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; break;
            case 'audio3': audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'; break;
        }
        document.getElementById('asr-audio').src = audioSrc;
        document.getElementById('with-instant').textContent = '[Transcription output here]';
        document.getElementById('without-instant').textContent = '[Transcription output here]';
    };
}


// --- How It Works page content ---
function showHowItWorks() {
    mainContent.innerHTML = `
        <div class="hiw-section">
            <div class="hiw-title">Your Dataset</div>
            ${[1,2,3,4,5].map(i => `
                <div class="hiw-set">
                    <audio class="hiw-audio" controls>
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i}.mp3" type="audio/mpeg">
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
            modalAudio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + ((+idx)%5+1) + ".mp3";
            modalOverlay.querySelector('audio').load();
            modalOverlay.style.display = 'block';
        };
    });
}

// --- Modal/Popup logic ---
modalClose.onclick = () => {
    modalOverlay.style.display = 'none';
};
modalOverlay.onclick = e => {
    if(e.target === modalOverlay) modalOverlay.style.display = 'none';
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
