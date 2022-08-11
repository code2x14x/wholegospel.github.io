$(document).ready(function() {
  'use strict';

  console.log('fxb fxb');
  console.log(document.title);

  const player = document.getElementById('song-player');
  const playBtn = document.getElementById('play-btn');

  playBtn.addEventListener('click', () => {
    if (player.paused) {
      $("audio").each(function(){
        if(!$(this)[0].paused){
            $(this)[0].pause();
        }
      });
      player.play();
      // btn.textContent = 'Play';
    } else {
      player.pause();
      // btn.textContent = 'Pause';
    }
  });

});