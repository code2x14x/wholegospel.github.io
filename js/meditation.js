$(document).ready(function () {
  function showMeditation() {
    document.getElementById("meditation").style.display = "flex";
  }
  function hideMeditation() {
    document.getElementById("meditation").style.display = "none";
  }

  $("#meditation_img").click(function () {
    $("div#meditation").fadeIn("300");
    document.getElementById("meditation").style.display = "flex";
    $("body").css("overflow", "hidden"); //ADD THIS
  });

  $(document).on("click", "#meditation_card_closeBtn", function () {
    $("div#meditation").fadeOut("500");
    document.getElementById("meditation").style.display = "none";
    $("body").css("overflow", "auto"); //ADD THIS
  });

  function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('card_footer_left_clock').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  startTime();
});
