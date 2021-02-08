import imageCompression from 'browser-image-compression';

import './styles.scss';

const body = document.querySelector(`body`) as HTMLBodyElement;
const form = document.querySelector(`.form`) as HTMLFormElement;
const button = document.querySelector(`.button`) as HTMLButtonElement;
const fileInput = document.querySelector(`.file`) as HTMLInputElement;
const mbSizeInput = document.querySelector(`.mb-size`) as HTMLInputElement;
const boxSizeInput = document.querySelector(`.box-size`) as HTMLInputElement;

function showError(error?: string) {
    const header = document.createElement(`h1`);
    header.textContent = error ?? `We're sorry, Minify Images is temporarily unavailable.  Please try again later.`;
    header.classList.add(`error`);
    body.classList.add(`error`);
    return body?.appendChild(header);
};

if (!form || !button || !fileInput) {
    const errors = [form, button, fileInput].filter(element => !!element);
    showError(`${errors.join(`, `)} was not found.`);
    window.stop();
};

function createDownload(name: string, src: string) {
    const a = document.createElement(`a`);
    [`aria-label`, `title`].forEach(attribute => a.setAttribute(attribute, `Download ${name}`));
    a.setAttribute(`download`, `true`);
    a.setAttribute(`href`, src);
    const img = document.createElement(`img`);
    [`alt`, `name`, `title`].forEach(attribute => img.setAttribute(attribute, name));
    a.classList.add(`download`);
    img.setAttribute(`src`, src);
    a.appendChild(img);
    return body.appendChild(a);
};

button.addEventListener(`click`, e => {
    e.preventDefault();
    return fileInput.click();
});

fileInput.addEventListener(`change`, () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    return button.textContent = file.name;
});

form.addEventListener(`submit`, e => {
    e.preventDefault();
    const file = fileInput.files?.[0];
    if (!file) return;
    const maxSizeMB = Number(mbSizeInput.value) ?? 0;
    const maxWidthOrHeight = Number(boxSizeInput.value) ?? 0;

    if (maxSizeMB === 0 || maxWidthOrHeight === 0) return;

    return imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
    })
        .then(blob => {
            const src = URL.createObjectURL(blob);
            return createDownload(blob.name, src)
        })
        .catch(err => {
            console.error(err);
            return showError(err.toString());
        });
});