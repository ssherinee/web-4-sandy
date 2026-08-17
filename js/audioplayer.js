const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const pauseIcon = document.getElementById('pause-icon');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const volumeSlider = document.getElementById('volume');

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseIcon.style.display = 'flex';
        playIcon.style.display = 'none';
    } else {
        audio.pause();
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    }
});

audio.addEventListener('timeupdate', () => {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

    if(audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

function updateVolume() {
audio.volume = volumeSlider.value;
volumeSlider.style.setProperty('--fill', (volumeSlider.value * 100) + '%');
}

volumeSlider.addEventListener('input', updateVolume);
updateVolume();

function startMusic() {
audio.play().then(() => {
  document.removeEventListener('click', startMusic);
  document.removeEventListener('keydown', startMusic);
  document.removeEventListener('touchstart', startMusic);
}).catch(() => {
});
}

startMusic();
document.addEventListener('click', startMusic);
document.addEventListener('keydown', startMusic);
document.addEventListener('touchstart', startMusic);