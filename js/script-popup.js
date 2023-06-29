const section = document.querySelector('section'),
  overlay = document.querySelector('.overlay'),
  showBtns = document.querySelectorAll('.show-modal'),
  closeBtn = document.querySelector('.close-btn'),
  copyBtn = document.querySelector('.copy-btn');

showBtns.forEach((showBtn) => {
  showBtn.addEventListener('click', () => {
    section.classList.add('active');
    document
      .querySelectorAll('.note')
      .forEach((note) => note.classList.remove('active'));
    const id_selector = '#n' + showBtn.innerText;
    const div_note = document.querySelector(id_selector);
    div_note.classList.add('active');
  });
});
overlay && overlay.addEventListener('click', () => section.classList.remove('active'));
closeBtn && closeBtn.addEventListener('click', () => {
  section.classList.remove('active');
  copyBtn.innerHTML = '复&nbsp;&nbsp;制';
});
copyBtn && copyBtn.addEventListener('click', () => {
  const activeNoteInnerText = document.querySelector('.note.active').innerText;
  const textAreaC = document.createElement('textarea');
  textAreaC.setAttribute('readonly', 'readonly');
  textAreaC.value = activeNoteInnerText;
  document.body.appendChild(textAreaC);
  textAreaC.select();
  document.execCommand('copy');
  document.body.removeChild(textAreaC);
  copyBtn.innerText = '去粘贴吧';
});
