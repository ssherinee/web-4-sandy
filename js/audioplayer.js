const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const pauseIcon = document.getElementById('pause-icon');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const volumeSlider = document.getElementById('volume');

function updateIcons() {
    if (audio.paused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    } else {
        pauseIcon.style.display = 'flex';
        playIcon.style.display = 'none';
    }
}

playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
        audio.play().catch(err => console.error('audio failed to play:', err));
    } else {
        audio.pause();
    }
});

audio.addEventListener('play', updateIcons);
audio.addEventListener('pause', updateIcons);
audio.addEventListener('ended', updateIcons);
updateIcons();
