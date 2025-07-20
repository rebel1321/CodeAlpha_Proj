document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseButton = document.getElementById('playPauseButton');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const prevTrackButton = document.getElementById('prevTrackButton');
  const nextTrackButton = document.getElementById('nextTrackButton');
  const rewindButton = document.getElementById('rewindButton');
  const fastForwardButton = document.getElementById('fastForwardButton');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const progressThumb = document.getElementById('progressThumb');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationTimeDisplay = document.getElementById('durationTime');

  const currentCoverArt = document.getElementById('currentCoverArt');
  const currentTrackTitle = document.getElementById('currentTrackTitle');
  const currentTrackArtist = document.getElementById('currentTrackArtist');
  const playlistContainer = document.getElementById('playlistContainer');

  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');

  // Playlist data
  const playlist = [
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      title: "Electric Dreams",
      artist: "Neon Nights",
      coverArt: "https://picsum.photos/seed/music1/256/256",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "Golden Hour",
      artist: "Sunset Boulevard",
      coverArt: "https://picsum.photos/seed/music2/256/256",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      title: "Rhythm of the City",
      artist: "Urban Pulse",
      coverArt: "https://picsum.photos/seed/music3/256/256",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      title: "Moonlight Groove",
      artist: "Silver Strings",
      coverArt: "https://picsum.photos/seed/music4/256/256",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      title: "Ocean Waves",
      artist: "Blue Horizon",
      coverArt: "https://picsum.photos/seed/music5/256/256",
    },
  ];

  let currentTrackIndex = 0;

  // --- Utility Functions ---

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  function updatePlayPauseIcons() {
    if (audioPlayer.paused) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }
  }

  function loadTrack(index) {
    if (index < 0) {
      currentTrackIndex = playlist.length - 1;
    } else if (index >= playlist.length) {
      currentTrackIndex = 0;
    } else {
      currentTrackIndex = index;
    }

    const track = playlist[currentTrackIndex];
    audioPlayer.src = track.src;
    currentCoverArt.style.backgroundImage = `url("${track.coverArt}")`;
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;

    audioPlayer.load(); // Load the new audio source
    if (!audioPlayer.paused) {
      audioPlayer.play().catch(e => console.error("Error playing audio:", e));
    }
    updatePlaylistHighlight();
  }

  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audioPlayer.pause();
    }
    updatePlayPauseIcons();
  }

  function playNextTrack() {
    currentTrackIndex++;
    loadTrack(currentTrackIndex);
  }

  function playPreviousTrack() {
    currentTrackIndex--;
    loadTrack(currentTrackIndex);
  }

  function updateProgressBar() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    const thumbPosition = (progressBarContainer.offsetWidth * progress) / 100;
    progressThumb.style.left = `${thumbPosition}px`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
  }

  function setProgress(e) {
    const width = progressBarContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  function updatePlaylistHighlight() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
      if (index === currentTrackIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function renderPlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((track, index) => {
      const playlistItem = document.createElement('div');
      playlistItem.classList.add('playlist-item');
      if (index === currentTrackIndex) {
        playlistItem.classList.add('active');
      }
      playlistItem.dataset.index = index;

      playlistItem.innerHTML = `
        <div class="playlist-cover-art" style='background-image: url("${track.coverArt}");'></div>
        <div class="playlist-info">
          <p class="playlist-title">${track.title}</p>
          <p class="playlist-artist">${track.artist}</p>
        </div>
      `;
      playlistItem.addEventListener('click', () => {
        loadTrack(index);
        audioPlayer.play();
        updatePlayPauseIcons();
      });
      playlistContainer.appendChild(playlistItem);
    });
  }

  // --- Event Listeners ---

  playPauseButton.addEventListener('click', togglePlayPause);
  prevTrackButton.addEventListener('click', playPreviousTrack);
  nextTrackButton.addEventListener('click', playNextTrack);

  rewindButton.addEventListener('click', () => {
    audioPlayer.currentTime -= 10; // Rewind 10 seconds
  });

  fastForwardButton.addEventListener('click', () => {
    audioPlayer.currentTime += 10; // Fast forward 10 seconds
  });

  volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
  });

  audioPlayer.addEventListener('timeupdate', updateProgressBar);

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationTimeDisplay.textContent = formatTime(audioPlayer.duration);
    updateProgressBar(); // Set initial progress bar and thumb position
  });

  audioPlayer.addEventListener('ended', playNextTrack); // Autoplay next track

  progressBarContainer.addEventListener('click', setProgress);

  // Profile Modal Logic
  profileButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from immediately closing the modal
    profileModal.classList.toggle('show');
  });

  // Close profile modal when clicking outside
  document.addEventListener('click', (event) => {
    if (!profileModal.contains(event.target) && !profileButton.contains(event.target)) {
      profileModal.classList.remove('show');
    }
  });


  // --- Initial Setup ---
  loadTrack(currentTrackIndex);
  audioPlayer.volume = volumeSlider.value; // Set initial volume
  updatePlayPauseIcons(); // Set initial icon state
  renderPlaylist(); // Render the playlist
});