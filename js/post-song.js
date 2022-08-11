$(document).ready(function() {
  'use strict';

  const player = document.getElementById('player');
  const audios = document.getElementsByClassName('audio');

  for(const audio of audios) {
    audio.addEventListener('click', (e) => {
      e.preventDefault();
      // $("audio").each(function(){
        // if(!$(this)[0].paused){
        //     $(this)[0].pause();
        // }
      // });
      var elm = e.target;
console.log("fxb")

      var musicBars = document.getElementsByClassName("bars");
      Array.from(musicBars).forEach(element => {
        element.classList.remove("now");
      });
      elm.classList.add("now");

      var source = document.getElementById('audioSource');
      source.src = "https://typora-1259024198.cos.ap-beijing.myqcloud.com/" + elm.getAttribute('data-value');
      player.load(); //call this to just preload the audio without playing
      player.play();
    });
  }

  const loopAll = document.getElementById('loop-all');
  const songs = document.getElementsByClassName('song');
  loopAll.addEventListener('click', (e) => {
    e.preventDefault();
    
  });

});