$(function () {
  // 播放器
  const audioTrackElem = document.getElementById('audio-track'); 
  // 按钮
  const repeatButton = document.getElementById('repeat'); // 按钮 循环播放
  const playButton = $('#play');              // 按钮 播放
  const pauseButton = $('#pause');            // 按钮 暂停
  const prev_15 = $('#prev-15');              // 按钮 快退 15 秒
  const next_15 = $('#next-15');              // 按钮 快进 15 秒
  const stepBackward = $('#step-backward');   // 按钮 上一曲
  const stepForkward = $('#step-forward');    // 按钮 下一曲
  const fillBar = $('.fill-bar');             // 进度条 填充条
  const countDown = document.getElementById("count-down"); // 按钮 倒计时
  // 数据
  const osUrl = "https://typora-1259024198.cos.ap-beijing.myqcloud.com/";
  const teachingAudioElem = document.getElementById('teachingAudioElem');   // 证道音频 DOM
  const allAudioElems = document.getElementsByClassName('audio');           // 全部音频
  const allSongElems = document.getElementsByClassName('song');             // 全部歌曲
  let allSongsSources = [];   // 全部歌曲的 source

  // 初始化 全部音频 DOM
  for(let i = 0; i < allAudioElems.length; i++) {
    const audio = allAudioElems[i]; 
    audio.dataset.index = i;
    if(i == 0) {
      audio.classList.add('current-audio');
      audioTrackElem.src = osUrl + audio.dataset.file;
      audioTrackElem.load();
    }
  }

  // 初始化 全部歌曲 DOM
  for(let i = 0; i < allSongElems.length; i++) {
    allSongElems[i].dataset.index = i;
  }

  // 兼容之前没有歌曲的 post：如果没有歌曲 DOM，则仍显示老版本的播放器（html 原生 audio 播放器）
  if(allSongElems.length == 0) {
    document.getElementById('old-player').style.display = 'block';
    document.getElementById('v-player').style.display = 'none';
    return;
  }

  // 初始化 全部歌曲的 source
  Array.from(allSongElems).forEach((ele) => {
    allSongsSources.push(osUrl + ele.getAttribute('data-file'));
  });

  // 给 证道、歌曲名称 和 歌词按钮 添加点击事件
  for (const audio of allAudioElems) {
    audio.addEventListener('click', (e) => {
      // 如果点击的是歌词按钮，则跳转到当前歌曲的歌词页面
      if(e.target.nodeName === 'A') {
        e.preventDefault();
        e.stopPropagation();
        window.open(e.target.href);
        return;
      }
      console.log(audio.firstElementChild.classList);
      const isPlaying = document.getElementById("play").style.display;
      // 如果点击的是当前正在播放的音频，则什么也不做 
      if (isPlaying && audio.classList.contains('current-audio'))  return; 
      if (audio.classList.contains('teaching')) singleLoop();
      // audio.firstElementChild.classList.add('fa-spin');
      changeSourceAndPlay(audio);
    });
  }


  // 点击循环按钮时
  repeatButton.addEventListener('click', (e) => {
    const isPlaying = document.getElementById("play").style.display;
    if (!isPlaying){
      changeSourceAndPlay(allSongElems[0]); // 播放
    }
    // 根据按钮当前样式，切换循环模式
    if(repeatButton.classList.contains('all-loop')) singleLoop(); 
    else allLoop();
  });

  // 上一首
  stepBackward.click(function(){
    const current = document.getElementsByClassName('current-audio')[0];
    let idx = parseInt(current.getAttribute('data-index')) - 1;
    idx = idx < 0 ? 0 : idx;
    changeSourceAndPlay(allSongElems[idx]);
  });

  // 下一首
  stepForkward.click(playEndedHandler);

  playButton.click(function () {
    if (!repeatButton.classList.contains('all-loop')){
      singleLoop();
    };
    const current = document.getElementsByClassName("current-audio")[0];
    play(current);
  });

  pauseButton.click(function () {
    playButton.fadeIn();
    pauseButton.hide();
    audioTrackElem.pause();
    Array.from(allAudioElems).forEach((element) => {
      element.classList.remove('dancing');
      element.firstElementChild.classList.remove('fa-spin');
    });
  });

  prev_15.click(function () {
    audioTrackElem.currentTime = audioTrackElem.currentTime - 10;
    if (audioTrackElem.currentTime < 0) audioTrackElem.currentTime = 0;
  });

  next_15.click(function () {
    audioTrackElem.currentTime = audioTrackElem.currentTime + 10;
  });

  $('#seek').on('change', function () {
    audioTrackElem.currentTime = $(this).val();
  });

  audioTrackElem.addEventListener('loadedmetadata', function () {
    var timeStamps = parseTime();
    $('.time.current').html(timeStamps[0]);
    $('.time.till-end').html(timeStamps[2]);
  });

  audioTrackElem.addEventListener('timeupdate', function () {
    var position = (100 / audioTrackElem.duration) * audioTrackElem.currentTime;
    fillBar.css('width', position + '%');

    var timeStamps = parseTime();
    $('.time.current').html(timeStamps[0]);

    $('#seek').attr('max', audioTrackElem.duration);
    $('#seek').val(audioTrackElem.currentTime);
  });

  // 给倒计时按钮添加点击事件
  let countDownDate = 0;
  let timer = 0;
  let volumeTimer = 0;
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
      duration = 10;
    } else if (durationClickCnt % 5 == 2) {
      duration = 15;
    } else if (durationClickCnt % 5 == 3) {
      duration = 20;
    } else if (durationClickCnt % 5 == 4) {
      duration = 30;
    }
    // console.log(duration);
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
        let curVolume = audioTrackElem.volume;
        volumeTimer = setInterval(()=>{
          console.log(curVolume);
          if(curVolume < 0.1) {
            clearInterval(volumeTimer);
            audioTrackElem.pause();
            playButton.fadeIn();
            pauseButton.hide();
            Array.from(allAudioElems).forEach((element) => {
              element.classList.remove('dancing');
            });
            audioTrackElem.volume = 1;
          } else {
            curVolume *= 0.7;
            audioTrackElem.volume = curVolume;
          }
        },500);
      }
    }, 1000);
  });

  function changeSourceAndPlay(audioElem){
    if(document.getElementById('track-title')) 
      $('#track-title').html(audioElem.dataset.title);
    for(let e of allAudioElems) e.classList.remove('current-audio');
    audioElem.classList.add('current-audio');
    audioTrackElem.src = osUrl + audioElem.getAttribute('data-file');
    audioTrackElem.load();
    play(audioElem);
  }

  function play(audioElem){
    barsDancing(audioElem);
    playButton.hide();
    pauseButton.fadeIn();
    audioTrackElem.play();
  }

  function allLoop() {
    document.getElementById('loop-indicator').innerText = '全部循环';
    repeatButton.classList.add('all-loop');
    audioTrackElem.loop = false; //禁止单曲循环，否则无法触发ended事件
    audioTrackElem.addEventListener('ended', playEndedHandler, false);
  }

  function singleLoop() {
    document.getElementById('loop-indicator').innerText = '单曲循环';
    repeatButton.classList.remove('all-loop');
    audioTrackElem.loop = true; //开启单曲循环
    audioTrackElem.removeEventListener('ended', playEndedHandler, false);
  }

  function playEndedHandler() {
    const current = document.getElementsByClassName('current-audio')[0];
    let idx = parseInt(current.getAttribute('data-index')) + 1;
    idx = idx < allSongsSources.length ? idx : 0;
    changeSourceAndPlay(allSongElems[idx]);
  }

  // 音乐播放动画
  function barsDancing(target) {
    Array.from(allAudioElems).forEach((element) => {
      element.classList.remove('dancing');
      element.firstElementChild.classList.remove('fa-spin');
    });
    target.classList.add('dancing');
    target.firstElementChild.classList.add('fa-spin');
  }

  function parseTime() {
    var current = audioTrackElem.currentTime;
    var duration = audioTrackElem.duration;
    // var tillend = audioTrackElem.duration - audioTrackElem.currentTime;
    var tillend = audioTrackElem.duration;
    var durationMinute = Math.floor(duration / 60);
    var durationSecond = Math.floor(duration - durationMinute * 60);
    var durationLabel = durationMinute + ':' + durationSecond;
    if(durationSecond < 10) {
      durationLabel = durationMinute + ':0' + durationSecond;
    }
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

});
