declare const btn: HTMLButtonElement;
declare const canvas: HTMLDivElement;
declare const tmp: HTMLTemplateElement;
btn.addEventListener('click', () => {
  btn.disabled = true;
  canvas.append(tmp.content.cloneNode(true));

  setTimeout(() => {
    canvas.querySelectorAll('.showing').forEach((elem) => {
      elem.classList.remove('showing');
    });

    setTimeout(() => {
      canvas.innerHTML = '';
      btn.disabled = false;
    }, 3000);
  }, 3000);
});
