console.log('audioplayer.js loaded');

   

const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const pauseIcon = document.getElementById('pause-icon');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const volumeSlider = document.getElementById('volume');

let userPaused = false;

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
    audio.muted = false;
    if (audio.paused) {
        userPaused = false;
        audio.play().catch(err => console.error('audio failed to play:', err));
    } else {
        userPaused = true;
        audio.pause();
    }
});

audio.addEventListener('play', updateIcons);
audio.addEventListener('pause', updateIcons);
audio.addEventListener('ended', updateIcons);
audio.addEventListener('error', () => {
    console.error('Could not load the audio file. Check the path:', audio.src);
});
updateIcons();

audio.addEventListener('timeupdate', () => {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) audio.currentTime = (clickX / width) * duration;
});

function updateVolume() {
    audio.volume = volumeSlider.value;
    volumeSlider.style.setProperty('--fill', (volumeSlider.value * 100) + '%');
}

volumeSlider.addEventListener('input', updateVolume);
updateVolume();

const events = ['click', 'keydown', 'touchstart'];

function unmute() {
    audio.muted = false;
    if (audio.paused && !userPaused) audio.play().catch(() => {});
    events.forEach(ev => document.removeEventListener(ev, unmute));
}

audio.play().catch(() => {
    audio.muted = true;
    audio.play().catch(() => {});
    events.forEach(ev => document.addEventListener(ev, unmute));
});


const player = document.querySelector('.player-container');
let dragging = false;
let offsetX = 0;
let offsetY = 0;

player.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, .progress-container')) return;

    const r = player.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;
    dragging = true;

    player.style.left = r.left + 'px';
    player.style.top = r.top + 'px';
    player.style.right = 'auto';

    player.setPointerCapture(e.pointerId);
    player.classList.add('dragging');
});

player.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const maxX = window.innerWidth - player.offsetWidth;
    const maxY = window.innerHeight - player.offsetHeight;
    const x = Math.min(Math.max(0, e.clientX - offsetX), maxX);
    const y = Math.min(Math.max(0, e.clientY - offsetY), maxY);
    player.style.left = x + 'px';
    player.style.top = y + 'px';
});

function stopDrag() {
    dragging = false;
    player.classList.remove('dragging');
}
player.addEventListener('pointerup', stopDrag);
player.addEventListener('pointercancel', stopDrag);


window.addEventListener('resize', () => {
    const r = player.getBoundingClientRect();
    const maxX = Math.max(0, window.innerWidth - player.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - player.offsetHeight);
    if (r.left > maxX) player.style.left = maxX + 'px';
    if (r.top > maxY) player.style.top = maxY + 'px';
});