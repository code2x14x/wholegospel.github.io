$(function () {
  var audioTrack = document.getElementById('audio-track');
  var repeatButton = document.getElementById('repeat');
  var playButton = $('#play');
  var pauseButton = $('#pause');
  var prev_15 = $('#prev-15');
  var next_15 = $('#next-15');
  var fillBar = $('.fill-bar');
  var waving = $('.wave svg path');
  const countDown = document.getElementById("count-down");

  const audios = document.getElementsByClassName('audio');
  const songs = document.getElementsByClassName('song');
  if(songs.length == 0) {
    document.getElementById('old-player').style.display = 'block';
    document.getElementById('v-player').style.display = 'none';
    return;
  }
  const allSongsSources = [];
  Array.from(songs).forEach((ele) => {
    allSongsSources.push(
      'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' +
        ele.getAttribute('data-value')
    );
  });

  const teachingAudio = document.getElementById('teachingAudio');
  let currentPlayingAudio;
  if(teachingAudio) {
    audioTrack.src = 'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' + teachingAudio.getAttribute('data-value');
    currentPlayingAudio = teachingAudio;
  } else {
    audioTrack.src = 'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' + audios[0].getAttribute('data-value');
    currentPlayingAudio = audios[0];
  }
  audioTrack.load();


  function playTeaching(teachingAudio){
      // 如果点击的是证道录音
      audioTrack.loop = true;
      audioTrack.removeEventListener('ended', playEndedHandler, false);
      audioTrack.src =
        'https://typora-1259024198.cos.ap-beijing.myqcloud.com/' +
        teachingAudio.getAttribute('data-value');
      audioTrack.load();
      barsDancing(currentPlayingAudio);
      parseTime();
      audioTrack.play();
      repeatButton.classList.remove('looping');
  }

  // 点击歌曲名称时切换音乐
  for (const audio of audios) {
    audio.addEventListener('click', (e) => {
      e.preventDefault();

      // 如果点击的是当前正在播放的音频，则什么也不做
      if (audio.classList.contains('dancing')) {
        return;
      }

      pauseButton.fadeIn();
      playButton.hide();

      currentPlayingAudio = audio;

      // 如果点击的是证道录音
      if (audio.classList.contains('teaching')) {
        playTeaching(audio);
        return;
      }

      // 如果点击的是歌曲
      // 如果是刚打开页面，尚无正在播放的音频
      const looping = document.getElementsByClassName('looping');
      if (looping.length == 0) {
        audioTrack.loop = true;
      }
      const idx = parseInt(audio.getAttribute('data-index'));
      barsDancing(songs[idx]); // 音乐播放动画
      audioTrack.src = allSongsSources[idx];
      audioTrack.load(); //call this to just preload the audio without playing
      audioTrack.play();
    });
  }

  // 顺序播放一遍全部音乐
  repeatButton.addEventListener('click', (e) => {

    console.log('loop all')

    e.preventDefault();


    if(document.getElementsByClassName('looping').length == 0) {
      pauseButton.fadeIn();
      playButton.hide();
    }
    repeatButton.classList.toggle('looping');

    if(!repeatButton.classList.contains('looping')){
      // 改为单曲循环状态
      singleLoop();
      return;
    } 

    // 改为全部(证道录音除外)循环状态
    allLoop();

    // 判断当前是否有正在播放的音乐
    const dancing = document.getElementsByClassName('dancing');
    if(dancing.length == 0 || dancing.length == 1 && !dancing[0].classList.contains('song')){
      barsDancing(songs[0]);
      allLoop();
      audioTrack.src = allSongsSources[0]; //每次读数组最后一个元素
      audioTrack.load();
      audioTrack.play();
    }
  });

  function allLoop() {
    // document.getElementById('loop-all-indicator').innerText = '全部循环...';
    audioTrack.loop = false; //禁止单曲循环，否则无法触发ended事件
    audioTrack.addEventListener('ended', playEndedHandler, false);
  }

  function singleLoop() {
    // document.getElementById('loop-all-indicator').innerText = '单曲循环...';
    audioTrack.loop = true;
    audioTrack.removeEventListener('ended', playEndedHandler, false);
  }

  function playEndedHandler() {
    const current = document.getElementsByClassName('dancing')[0];
    let idx = parseInt(current.getAttribute('data-index')) + 1;
    idx = idx < allSongsSources.length ? idx : 0;
    currentPlayingAudio = songs[idx];
    barsDancing(currentPlayingAudio);
    audioTrack.src = allSongsSources[idx];
    audioTrack.load();
    audioTrack.play();
  }

  // 音乐播放动画
  function barsDancing(target) {
    // audioTitle.innerText = songs[idx].getAttribute("data-title");
    Array.from(audios).forEach((element) => {
      element.classList.remove('dancing');
    });
    target.classList.add('dancing');
  }

  playButton.click(function () {
    pauseButton.fadeIn();
    playButton.hide();
    audioTrack.play();
    barsDancing(currentPlayingAudio);
  });

  pauseButton.click(function () {
    playButton.fadeIn();
    pauseButton.hide();
    audioTrack.pause();
    Array.from(audios).forEach((element) => {
      element.classList.remove('dancing');
    });
  });

  prev_15.click(function () {
    audioTrack.currentTime = audioTrack.currentTime - 10;
    if (audioTrack.currentTime < 0) audioTrack.currentTime = 0;
  });

  next_15.click(function () {
    audioTrack.currentTime = audioTrack.currentTime + 10;
  });

  $('#seek').on('change', function () {
    audioTrack.currentTime = $(this).val();
  });

  audioTrack.addEventListener('loadedmetadata', function () {
    var timeStamps = parseTime();
    $('.time.current').html(timeStamps[0]);
    $('.time.till-end').html(timeStamps[2]);
  });

  audioTrack.addEventListener('timeupdate', function () {
    var position = (100 / audioTrack.duration) * audioTrack.currentTime;
    fillBar.css('width', position + '%');

    var timeStamps = parseTime();
    $('.time.current').html(timeStamps[0]);
    // $('.time.till-end').html(audioTrack.duration);
    // $('.time.till-end').html(timeStamps[1]);

    $('#seek').attr('max', audioTrack.duration);
    $('#seek').val(audioTrack.currentTime);
  });

  function parseTime() {
    var current = audioTrack.currentTime;
    var duration = audioTrack.duration;
    // var tillend = audioTrack.duration - audioTrack.currentTime;
    var tillend = audioTrack.duration;
    var durationMinute = Math.floor(duration / 60);
    var durationSecond = Math.floor(duration - durationMinute * 60);
    var durationLabel = durationMinute + ':' + durationSecond;
    var tillendMinute = Math.floor(tillend / 60);
    var tillendSecond = Math.floor(tillend - tillendMinute * 60);
    if (tillendSecond < 10) {
      tillendSecond = '0' + tillendSecond;
    }
    var tillendLabel = '-' + tillendMinute + ':' + tillendSecond;
    currentSecond = Math.floor(current);
    currentMinute = Math.floor(currentSecond / 60);
    currentSecond = currentSecond - currentMinute * 60;
    if (currentSecond < 10) {
      currentSecond = '0' + currentSecond;
    }
    var currentLabel = currentMinute + ':' + currentSecond;
    return [currentLabel, tillendLabel, durationLabel];
  }

  // 倒计时
  let countDownDate = 0;
  let timer = 0;
  // const countDown = document.getElementById('count-down');
  let durationClickCnt = 5;
  countDown.addEventListener('click', (event) => {
    event.preventDefault();
    durationClickCnt++;
    clearInterval(timer);
    let duration = 0;
    if (durationClickCnt % 5 == 0) {
      document.getElementById('count-down-timer').innerText = '';
      return;
    } else if (durationClickCnt % 5 == 1) {
      duration = 1;
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
          let curVolume = audioTrack.volume;
          console.log(curVolume);
          document.getElementById('volume').innerText=curVolume;
          if(curVolume < 0.1) {
            document.getElementById('volume').innerText="小于 0.1";
            clearInterval(volumeTimer);
            audioTrack.pause();
            playButton.fadeIn();
            pauseButton.hide();
            audioTrack.volume = 1;
          } else {
            audioTrack.volume = curVolume * 0.8;
          }
        },500);
      }
    }, 1000);
  });
});
