const introSound = new Audio(`${import.meta.env.BASE_URL}sounds/netflix-intro.mp3`);
introSound.preload = "auto";

// Browsers only allow sound after a click, so call this from a click handler.
export function playTaDum() {
  introSound.currentTime = 0;
  introSound.play().catch(() => {
    // Sound blocked or unavailable: the site simply stays silent.
  });
}
