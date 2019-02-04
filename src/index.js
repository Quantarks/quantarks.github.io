"use strict";

document.onreadystatechange = () => {
    document.querySelector("body").innerHTML +=
        '<a href="#to-top" class="to-top"></a>';

    document.querySelector("body").setAttribute("id", "to-top");

    document.querySelector(".js-back").addEventListener("click", function(e) {
        document
            .querySelector(".elements-details.shown")
            .classList.remove("shown");
    });

    document.querySelector(".modal").addEventListener("click", function(e) {
        if (e.target.matches(".modal__inner")) {
            scrollInto.call(this, e.target);
            return;
        }

        document.querySelector(".modal").removeAttribute("open");
    });

    fetchData();
};

function fetchData() {
    fetch("/data/elements.json")
        .then(raw => raw.json())
        .then(json => (window.elements = json));

    fetch("/data/elements-old.json")
        .then(raw => raw.json())
        .then(json => (window.elementsOld = json))
        .then(data => executeInitialization());
}

function executeInitialization() {
    fetchImageData();
    generateElementCards();
    attachEvents();
}

function fetchImageData() {
    fetch("/data/element_images.json")
        .then(raw => raw.json())
        .then(json => (window.elementImages = json));
}

function generateElementCards() {
    const templates = window.elementsOld.map(e => {
      const element = window.elements.find(i => i.atomic_number === e.number);
      console.log(element.symbol)
      return `
      <button class="element">
        <span class="symbol"></span>
      </button>
    `;
    });

    console.log( templates )
    document.querySelector(".elements-grid").innerHTML = templates.join("\n");
}

function attachEvents() {
    document
        .querySelector(".elements-grid")
        .addEventListener("click", handleElementClick);
}

function handleElementClick(event) {
    if (event.target.matches(".element")) {
        showElement(event.target.dataset["id"]);
        updateImageModal(event.target.dataset["id"]);
    }
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $0 = document.getElementById.bind(document);

function showElement(atomic_number) {
    const element = window.elements.find(
        item => item.atomic_number === parseInt(atomic_number, 10)
    );

    $0("element-name").innerHTML = element.name;
    $0("element-symbol").innerHTML = `<p>
            <span class="vis-hid">Element Symbol: </span>${element.symbol}
          </p>`;
    $0("electron-conf").innerHTML = element.electron_conf
        .replace(/{/g, "<sup>")
        .replace(/}/g, "</sup>");
    $0("atomic-number").innerHTML = element.atomic_number;
    $0("type").innerHTML = element.type;
    $0("group").innerHTML = element.category;
    $0("atomic-radius").innerHTML = element.atomic_radius;
    $0("boiling-point").innerHTML = element.boiling + "&deg; C";
    $0("melting-point").innerHTML = element.melting + "&deg; C";
    $0("appearance").innerHTML = element.appearance
        .split(/\\n\\n|\\n/g)
        .map(
            item =>
                `<p>${item
                    .replace(/\^/g, "<sup>")
                    .replace(/\$/g, "</sup>")}</p>`
        )
        .join("\n");

    $0("history").innerHTML = (element.history || "No data yet")
        .split(/\\n\\n/g)
        .map(
            item =>
                `<p>${item
                    .replace(/\^/g, "<sup>")
                    .replace(/\$/g, "</sup>")}</p>`
        )
        .join("\n");
    $0("discoverer").innerHTML = element.discoverer
        .split("|")
        .map(item => item.trim())
        .join(", ");

    const uses = element.uses.includes("|")
        ? "<ul>" +
          element.uses
              .split("|")
              .map(item => `<li>${item}</li>`)
              .join("\n") +
          "<ul>"
        : (element.uses || "No data yet")
              .split(/\\n\\n|\\n/g)
              .map(
                  item =>
                      `<p>${item
                          .replace(/\^/g, "<sup>")
                          .replace(/\$/g, "</sup>")}</p>`
              )
              .join("\n");
    $0("uses").innerHTML = uses;

    const dangers = element.dangers.includes("|")
        ? "<ul>" +
          element.dangers
              .split("|")
              .map(item => `<li>${item}</li>`)
              .join("\n") +
          "<ul>"
        : (element.dangers || "No data yet")
              .split(/\\n\\n|\\n/g)
              .map(
                  item =>
                      `<p>${item
                          .replace(/\^/g, "<sup>")
                          .replace(/\$/g, "</sup>")}</p>`
              )
              .join("\n");
    $0("dangers").innerHTML = dangers;

    $0(
        "marker"
    ).src = `/assets/markers/${element.name.toLocaleLowerCase()}.jpg`;
    $(".images").innerHTML = generateImages(element.atomic_number).join("\n");

    document.querySelector(".elements-details").scrollTo(0, 0);
    document.querySelector(".elements-details").classList.toggle("shown");
}

function updateImageModal(atomic_number) {
    $(".modal").innerHTML = generateModalImages(atomic_number).join("\n");
}

function generateImages(atomic_number) {
    return (
        window.elementImages.find(
            item => item.atomic_number === parseInt(atomic_number, 10)
        ) || { images: [] }
    ).images.map(
        item => `
    <li tabindex="1" onclick="showImage('${item.id}')">
      <img src="/assets/element-images/${item.id}.jpg" alt="${item.comments}">
    </li>`
    );
}

function scrollInto(view) {
    const viewportWidth = this.getClientRects()[0].width;
    const viewWidth = view.getClientRects()[0].width;
    this.scrollTo({
        top: 0,
        left: view.offsetLeft - (viewportWidth - viewWidth) / 2,
        behavior: "smooth"
    });
}

function generateModalImages(atomic_number) {
    return (
        window.elementImages.find(
            item => item.atomic_number === parseInt(atomic_number, 10)
        ) || { images: [] }
    ).images.map(
        item => `
    <figure class="modal__inner" tabindex="1" data-id="${item.id}">
        <img src="/assets/element-images/${item.id}.jpg" alt="${
            item.id ? item.id + " in real life" : ""
        }">
        <figcaption>${item.comments}</figcaption>
      </figure>`
    );
}

function showImage(id) {
    console.log(id);
    $(".modal").setAttribute("open", "");
    scrollInto.call($(".modal"), $(`.modal__inner[data-id=${id}]`));
}
