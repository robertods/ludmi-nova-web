const year = document.querySelector("#year");
const floatingLayer = document.querySelector(".floating-layer");

if (year) {
  year.textContent = new Date().getFullYear();
}

const shapes = [
  {
    className: "heart",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-6.9-4.3-9.4-8.5C.5 8.9 2.4 4.5 6.5 4.5c2 0 3.4 1 4.2 2.2.3.4.9.4 1.2 0 .8-1.2 2.2-2.2 4.2-2.2 4.1 0 6 4.4 3.9 8C18.9 16.7 12 21 12 21Z"/></svg>'
  },
  {
    className: "feather",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.4 3.6c-6.8 1-11.8 4.8-14.9 11.3-.8 1.7-1.2 3.4-1.3 5.1 1.6-.4 3.2-1.1 4.7-2.2 5.9-4.1 9.8-8.7 11.5-14.2Zm-4.7 4.7c-2.1 2.9-4.7 5.4-7.8 7.6-.5.4-1 .7-1.6 1 .2-.5.4-1 .7-1.6 1.9-3.8 4.7-6.7 8.7-8.5Z"/></svg>'
  },
  {
    className: "saturn",
    svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 23.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm13.8-12.2c1.2 2.1-3.2 6.2-9.8 9.2-6.7 3-13 3.8-14.2 1.7-.5-.9.1-2.2 1.7-3.6.3.4.6.8.9 1.1-.7.7-.9 1.3-.7 1.6.7 1.1 5.8.1 11.4-2.5 5.6-2.5 9.6-5.5 9-6.6-.3-.4-1.1-.5-2.2-.4-.1-.5-.2-1-.4-1.4 2.2-.3 3.8 0 4.3.9ZM2.2 20.7c-1.2-2.1 3.2-6.2 9.8-9.2 6.7-3 13-3.8 14.2-1.7.5.9-.1 2.2-1.7 3.6-.3-.4-.6-.8-.9-1.1.7-.7.9-1.3.7-1.6-.7-1.1-5.8-.1-11.4 2.5-5.6 2.5-9.6 5.5-9 6.6.3.4 1.1.5 2.2.4.1.5.2 1 .4 1.4-2.2.3-3.8 0-4.3-.9Z"/></svg>'
  }
];

function createFloatingItem(index) {
  const shape = shapes[index % shapes.length];
  const item = document.createElement("span");
  item.className = `float-item ${shape.className}`;
  item.innerHTML = shape.svg;
  item.style.setProperty("--x", `${Math.random() * 100}vw`);
  item.style.setProperty("--sway", `${Math.random() * 120 - 60}px`);
  item.style.setProperty("--size", `${18 + Math.random() * 22}px`);
  item.style.setProperty("--duration", `${12 + Math.random() * 10}s`);
  item.style.setProperty("--delay", `${Math.random() * -18}s`);
  floatingLayer.appendChild(item);
}

if (floatingLayer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  Array.from({ length: 11 }, (_, index) => createFloatingItem(index));
}

const releaseCovers = document.querySelectorAll(".release-card > img");

if (releaseCovers.length) {
  const coverDialog = document.createElement("dialog");
  coverDialog.className = "cover-dialog";
  coverDialog.setAttribute("aria-label", "Portada ampliada");
  coverDialog.innerHTML = `
    <button class="cover-dialog-close" type="button" aria-label="Cerrar portada">&times;</button>
    <img class="cover-dialog-image" src="" alt="">
  `;
  document.body.appendChild(coverDialog);

  const dialogImage = coverDialog.querySelector(".cover-dialog-image");
  const closeButton = coverDialog.querySelector(".cover-dialog-close");

  function openCover(image) {
    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    coverDialog.showModal();
  }

  releaseCovers.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Ampliar ${image.alt}`);

    image.addEventListener("click", () => openCover(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCover(image);
      }
    });
  });

  closeButton.addEventListener("click", () => coverDialog.close());
  coverDialog.addEventListener("click", (event) => {
    if (event.target === coverDialog) coverDialog.close();
  });
}
