document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicLabel = document.querySelector(".music-label");
  const storageKey = "romantic-music-state";

  const saveState = () => {
    if (!bgMusic) return;
    localStorage.setItem(storageKey, JSON.stringify({
      isPlaying: !bgMusic.paused,
      currentTime: bgMusic.currentTime,
    }));
  };

  const updateMusicLabel = () => {
    if (!musicLabel) return;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const opacity = Math.max(0, Math.min(1, 1 - scrollTop / 180));
    musicLabel.style.opacity = String(opacity);
    musicLabel.style.transform = `translateY(${opacity === 0 ? 8 : 0}px)`;
  };

  const restoreState = async () => {
    if (!bgMusic) return;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
      if (saved.currentTime) {
        bgMusic.currentTime = saved.currentTime;
      }

      if (saved.isPlaying) {
        await bgMusic.play();
        if (musicToggle) musicToggle.textContent = "🔇 Stop Music";
      }
    } catch (error) {
      console.error("Audio restore failed", error);
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const heart = document.createElement("span");
      heart.className = "spark";
      heart.textContent = "💖";
      heart.style.left = `${event.clientX}px`;
      heart.style.top = `${event.clientY}px`;
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 900);
    });
  });

  if (musicToggle && bgMusic) {
    bgMusic.addEventListener("timeupdate", saveState);
    bgMusic.addEventListener("pause", saveState);
    bgMusic.addEventListener("play", saveState);
    window.addEventListener("scroll", updateMusicLabel, { passive: true });

    musicToggle.addEventListener("click", async () => {
      const isPlaying = !bgMusic.paused;

      if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = "🎵 Play Music";
      } else {
        try {
          await bgMusic.play();
          musicToggle.textContent = "🔇 Stop Music";
        } catch (error) {
          musicToggle.textContent = "🎵 Play Music";
        }
      }
    });

    restoreState();
    updateMusicLabel();
  }

  // Register service worker for PWA installability and offline support
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('./service-worker.js').then(() => {
        console.log('Service worker registered');
      }).catch((err) => console.warn('SW registration failed', err));
    } catch (e) {
      console.warn('Service worker registration error', e);
    }
  }
});
