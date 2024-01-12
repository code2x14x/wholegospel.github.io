$(document).ready(function () {
  function showMeditation() {
    document.getElementById("meditation").style.display = "flex";
  }
  function hideMeditation() {
    document.getElementById("meditation").style.display = "none";
  }

  $("#meditation_img").click(function () {
    $("div#meditation").fadeIn("500");
    document.getElementById("meditation").style.display = "flex";
    $("body").css("overflow", "hidden"); //ADD THIS
  });

  $(document).on("click", "#meditation_card_closeBtn", function () {
    $("div#meditation").fadeOut("500");
    document.getElementById("meditation").style.display = "none";
    $("body").css("overflow", "auto"); //ADD THIS
  });
});
