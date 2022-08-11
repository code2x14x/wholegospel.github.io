$(document).ready(function() {
  'use strict';

  console.log('fxb fxb');
  console.log(document.title);

  const player = document.getElementById('song-player');
  const songTitles = document.getElementsByClassName('song-title');

  for(const songTitle of songTitles) {
    songTitle.addEventListener('click', (e) => {
      e.preventDefault();
      $("audio").each(function(){
        if(!$(this)[0].paused){
            $(this)[0].pause();
        }
      });
      var elm = e.target;
      var source = document.getElementById('audioSource');
      source.src = "https://typora-1259024198.cos.ap-beijing.myqcloud.com/" + elm.getAttribute('data-value');
      player.load(); //call this to just preload the audio without playing
      player.play();
    });

  }
});