$(document).ready(function () {
  'use strict';

  const player = document.getElementById('player');
  const audios = document.getElementsByClassName('audio');

  // 点击歌曲名称时切换音乐
  for (const audio of audios) {
    audio.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loop-all-indicator').innerText = '';
      player.removeEventListener('ended', playEndedHandler, false);
      player.loop = true;
      var elm = e.target;

      // 音乐播放动画
      var musicBars = document.getElementsByClassName('bars');
      Array.from(musicBars).forEach((element) => {
        element.classList.remove('now');
      });
      elm.classList.add('now');

      // 更换源
      player.src =
        'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' +
        elm.getAttribute('data-value');
      player.load(); //call this to just preload the audio without playing
      player.play();
    });
  }

  // 顺序播放一遍全部音乐
  const loopAll = document.getElementById('loop-all');
  const songs = document.getElementsByClassName('song');
  const allSongsSources = [];
  Array.from(songs).forEach((ele) => {
    allSongsSources.push(
      'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' +
        ele.getAttribute('data-value')
    );
  });
  const totalSongs = allSongsSources.length;
  let accumulator = totalSongs;
  let loopAllClickCnt = 2;
  loopAll.addEventListener('click', (e) => {
    e.preventDefault();
    if (++loopAllClickCnt % 2 == 0) {
      document.getElementById('loop-all-indicator').innerText = '';
      player.loop = true; //禁止循环，否则无法触发ended事件
      player.removeEventListener('ended', playEndedHandler, false);
      return;
    }
    document.getElementById('loop-all-indicator').innerText = '全部循环...';

    barsDancing(0);

    player.loop = false; //禁止循环，否则无法触发ended事件
    player.src = allSongsSources[0]; //每次读数组最后一个元素
    player.addEventListener('ended', playEndedHandler, false);
    player.play();
  });

  function playEndedHandler() {
    const index = ++accumulator % totalSongs;
    barsDancing(index);
    player.src = allSongsSources[index];
    player.load();
    player.play();
    !allSongsSources.length &&
      player.removeEventListener('ended', playEndedHandler, false); //只有一个元素时解除绑定
  }

  // 音乐播放动画
  function barsDancing(index) {
    var audio = document.getElementsByClassName('audio');
    Array.from(audio).forEach((element) => {
      element.classList.remove('now');
    });
    songs[index].classList.add('now');
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
        countDownTimer.innerText = '';
        player.pause();
      }
    }, 1000);
  });
});