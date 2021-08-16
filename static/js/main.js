$(document).ready(function () {
  function preview_img(input) {
    $("#loader").show();
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $("#image_preview").attr("src", e.target.result).width(256).height(256);
      };
      reader.readAsDataURL(input.files[0]);

      $("#loader").hide();
      $("#container_preview").fadeIn((duration = 1000));
    } else {
      $("#loader").hide();
      $("#container_result").fadeOut((duration = 500));
      $("#container_preview").fadeOut((duration = 500));
    }
  }
  $("#select_image").change(function () {
    $("#container_result").fadeOut((duration = 500));
    $("#container_preview").fadeOut((duration = 500));
    preview_img(this);
  });

  $("#klasifikasi").click(function () {
    $("#container_result").hide();
    if ($("#select_image").val() != "") {
      var Data = new FormData($("#upload_image")[0]);
      $("#loader").show();
      $.ajax({
        url: "/predict",
        data: Data,
        type: "POST",
        processData: false,
        contentType: false,
        async: true,
        cache: false,
        success: function (data) {
          console.log(data);
          if (data === "1") {
            $("#predict").text("Hasil Klasifikasi : Pneumonia");
            $("#loader").hide();
            $("#container_result").fadeIn((duration = 1000));
          } else if (data === "0") {
            $("#predict").text("Hasil Klasifikasi : Normal");
            $("#loader").hide();
            $("#container_result").fadeIn((duration = 1000));
          } else {
            $("#predict").text("Terjadi Error");
            $("#loader").hide();
            $("#container_result").fadeIn((duration = 1000));
          }
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Maaf",
        text: "Mohon pilih citra terlebih dahulu!",
      });
    }
  });
});
