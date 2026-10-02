// ---------------------------------------------------------------------------
// soundManager.js — tiny audio pool for hover/click UI sounds.
// If the mp3 files under assets/audio/ are missing, playback fails silently
// (browsers also block audio before the first user gesture — that's expected).
// ---------------------------------------------------------------------------

export function createSoundManager({ hoverSrc = "assets/audio/hover.mp3", clickSrc = "assets/audio/click.mp3" } = {}) {
  let muted = false;

  const hoverAudio = new Audio(hoverSrc);
  hoverAudio.volume = 0.25;
  const clickAudio = new Audio(clickSrc);
  clickAudio.volume = 0.35;

  function safePlay(audio) {
    if (muted) return;
    const clone = audio.cloneNode();
    clone.volume = audio.volume;
    clone.play().catch(() => {
      /* autoplay/gesture restrictions or missing file — ignore */
    });
  }

  return {
    playHover: () => safePlay(hoverAudio),
    playClick: () => safePlay(clickAudio),
    toggleMute() {
      muted = !muted;
      return muted;
    },
    get muted() {
      return muted;
    },
  };
}
