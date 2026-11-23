const songList = document.querySelector("#song-list");
const songPicker = document.querySelector("#song-picker");
const lyricView = document.querySelector("#letra");
const lyricsSearch = document.querySelector("#lyrics-search");

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function songSlug(album, title) {
  return normalizeText(`${album}-${title}`)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function flattenSongs(albums) {
  return [...albums]
    .reverse()
    .flatMap((album) => album.songs.map((song) => ({
      ...song,
      album: album.title,
      slug: songSlug(album.title, song.title)
    })));
}

function renderSongList(albums, activeSlug, query = "") {
  const normalizedQuery = normalizeText(query.trim());
  const groups = [...albums].reverse().map((album) => {
    const songs = album.songs
      .map((song) => ({ ...song, slug: songSlug(album.title, song.title) }))
      .filter((song) => normalizeText(`${album.title} ${song.title}`).includes(normalizedQuery));

    if (!songs.length) return "";

    const buttons = songs.map((song) => `
      <button class="song-button${song.slug === activeSlug ? " active" : ""}" type="button" data-song="${song.slug}">
        ${escapeHtml(song.title)}
      </button>
    `).join("");

    return `
      <section class="song-group">
        <h3 class="song-group-title">${escapeHtml(album.title)}</h3>
        ${buttons}
      </section>
    `;
  }).join("");

  songList.innerHTML = groups || '<p class="song-empty">No encontramos una canción con ese nombre.</p>';
}

function renderPicker(songs, activeSlug) {
  songPicker.innerHTML = songs.map((song) => `
    <option value="${song.slug}"${song.slug === activeSlug ? " selected" : ""}>
      ${escapeHtml(song.title)} · ${escapeHtml(song.album)}
    </option>
  `).join("");
}

function renderLyric(song, updateUrl = true) {
  const stanzas = song.stanzas
    .map((stanza) => `<p>${escapeHtml(stanza)}</p>`)
    .join("");

  lyricView.innerHTML = `
    <p class="lyric-album">${escapeHtml(song.album)}</p>
    <h2>${escapeHtml(song.title)}</h2>
    <div class="lyric-body">${stanzas}</div>
  `;

  document.querySelectorAll(".song-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.song === song.slug);
  });
  songPicker.value = song.slug;

  if (updateUrl) {
    history.replaceState(null, "", `#${song.slug}`);
  }
}

function initializeLyrics() {
  const albums = window.LUDMI_LYRICS;

  if (!Array.isArray(albums) || !albums.length) {
    lyricView.innerHTML = '<p class="lyrics-error">No fue posible cargar las letras.</p>';
    return;
  }

  const songs = flattenSongs(albums);
  const requestedSlug = window.location.hash.slice(1);
  const initialSong = songs.find((song) => song.slug === requestedSlug) || songs[0];

  renderSongList(albums, initialSong.slug);
  renderPicker(songs, initialSong.slug);
  renderLyric(initialSong, false);

  songList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-song]");
    if (!button) return;

    const song = songs.find((item) => item.slug === button.dataset.song);
    if (song) renderLyric(song);
  });

  songPicker.addEventListener("change", () => {
    const song = songs.find((item) => item.slug === songPicker.value);
    if (song) {
      renderLyric(song);
      lyricView.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  lyricsSearch.addEventListener("input", () => {
    renderSongList(albums, songPicker.value, lyricsSearch.value);
  });
}

initializeLyrics();
