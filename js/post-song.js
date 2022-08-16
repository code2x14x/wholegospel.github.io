$(document).ready(function () {
  'use strict';

  const player = document.getElementById('player');
  const audios = document.getElementsByClassName('audio');

  const loopAll = document.getElementById('loop-all');
  const songs = document.getElementsByClassName('song');
  const allSongsSources = [];
  Array.from(songs).forEach((ele) => {
    allSongsSources.push(
      'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' +
        ele.getAttribute('data-value')
    );
  });

  // 点击歌曲名称时切换音乐
  for (const audio of audios) {
    audio.addEventListener('click', (e) => {
      e.preventDefault();

      // 如果点击的是当前正在播放的音频，则什么也不做
      if(audio.classList.contains('dancing')){
        return; 
      }

      // 如果点击的是证道录音
      if(audio.classList.contains('teaching')) {
        document.getElementById('loop-all-indicator').innerText = '主日证道...';
        player.loop = true;
        player.removeEventListener('ended', playEndedHandler, false);
        player.src ='https://typora-1259024198.cos.ap-beijing.myqcloud.com/' + audio.getAttribute('data-value');
        player.load();
        player.play();
        Array.from(audios).forEach((element) => {
          element.classList.remove('dancing');
        });
        audio.classList.add('dancing');
        loopAll.classList.remove('looping');
        return;
      }

      // 如果点击的是歌曲
      // 如果是刚打开页面，尚无正在播放的音频
      const looping = document.getElementsByClassName('looping');
      if(looping.length == 0){
        player.loop = true;
        document.getElementById('loop-all-indicator').innerText = '单曲循环...';
      } 
      const idx = parseInt(audio.getAttribute("data-index"));
      barsDancing(idx); // 音乐播放动画
      player.src = allSongsSources[idx]; 
      player.load(); //call this to just preload the audio without playing
      player.play();
      
    });
  }

  // 顺序播放一遍全部音乐
  loopAll.addEventListener('click', (e) => {

    console.log('loop all')

    e.preventDefault();

    loopAll.classList.toggle('looping');

    if(!loopAll.classList.contains('looping')){
      // 改为单曲循环状态
      singleLoop();
      return;
    } 

    // 改为全部(证道录音除外)循环状态
    allLoop();

    // 判断当前是否有正在播放的音乐
    const dancing = document.getElementsByClassName('dancing');
    if(dancing.length == 0 || dancing.length == 1 && !dancing[0].classList.contains('song')){
      barsDancing(0);
      allLoop();
      player.src = allSongsSources[0]; //每次读数组最后一个元素
      player.load();
      player.play();
    }
  });

  function allLoop(){
      document.getElementById('loop-all-indicator').innerText = '全部循环...';
      player.loop = false; //禁止单曲循环，否则无法触发ended事件
      player.addEventListener('ended', playEndedHandler, false);
  }

  function singleLoop(){
      document.getElementById('loop-all-indicator').innerText = '单曲循环...';
      player.loop = true; 
      player.removeEventListener('ended', playEndedHandler, false);
  }

  function playEndedHandler() {
    console.log('next song')
    const current = document.getElementsByClassName('dancing')[0];
    let idx = parseInt(current.getAttribute('data-index')) + 1;
    idx = idx < allSongsSources.length ? idx : 0;
    barsDancing(idx);
    player.src = allSongsSources[idx];
    player.load();
    player.play();
  }

  // 音乐播放动画
  function barsDancing(index) {
    Array.from(audios).forEach((element) => {
      element.classList.remove('dancing');
    });
    songs[index].classList.add('dancing');
  }

  // 倒计时
  let countDownDate = 0;
  let timer = 0;
  const countDown = document.getElementById('count-down');
  const cancleCountDown = document.getElementById('cancle-count-down');
  let durationClickCnt = 5;
  cancleCountDown.addEventListener('click', (event) => {
    event.preventDefault();
    clearInterval(timer);
    document.getElementById('count-down-timer').innerText = '';
  })
  countDown.addEventListener('click', (event) => {
    event.preventDefault();
    durationClickCnt++;
    clearInterval(timer);
    let duration = 0;
    if (durationClickCnt % 5 == 0) {
      document.getElementById('count-down-timer').innerText = '';
      return;
    } else if (durationClickCnt % 5 == 1) {
      duration = 10;
    } else if (durationClickCnt % 5 == 2) {
      duration = 15;
    } else if (durationClickCnt % 5 == 3) {
      duration = 20;
    } else if (durationClickCnt % 5 == 4) {
      duration = 30;
    }
    console.log(duration);
    countDownDate = new Date().getTime() + duration * 60 * 1000;
    // find the interval between now and the countdown time
    let timeLeft = duration * 60 * 1000;
    // time calculations for days, hours, minutes and seconds
    const countDownTimer = document.getElementById('count-down-timer');
    countDownTimer.innerText = duration + ':00';
    // countdown timer
    timer = setInterval(function () {
      // get today's date and time in milliseconds
      let now = new Date().getTime();

      // find the interval between now and the countdown time
      timeLeft = countDownDate - now;

      // time calculations for days, hours, minutes and seconds
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      // const countDownTimer = document.getElementById('count-down-timer');
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      const secondsStr = seconds < 10 ? '0' + seconds : seconds;
      countDownTimer.innerText = minutesStr + ':' + secondsStr;
      // clearing countdown when complete
      if (timeLeft < 0) {
        clearInterval(timer);
        durationClickCnt = 5;
        countDownTimer.innerText = '';
        let volumeTimer = setInterval(()=>{
          let curVolume = player.volume;
          console.log(curVolume);
          if(curVolume < 0.1) {
            clearInterval(volumeTimer);
            player.pause();
            player.volume = 1;
          } else {
            player.volume = curVolume * 0.8;
          }
        },500);
      }
    }, 1000);
  });
});