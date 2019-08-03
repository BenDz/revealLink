// Loader

document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'complete') {
      setTimeout(function(){
        $('#loader').fadeOut('slow');
      },1000);
  }
}

// Random Color loader
$(function () { 
  const items = ['#2529D8','#FAA916','#EF2D56', '#6BD425', '#A01A7D']
  const root = document.documentElement;
  let randomColor = items[Math.floor(Math.random()*items.length)];
  root.style.setProperty('--primary-color', `${randomColor}`)
});

// AJAX call
function getData(form){
  $('#error-container').css('display', 'none');
  event.preventDefault();
  event.stopPropagation();

  let url = form.elements.url.value.trim();
  let submitButton = form.elements.submit;
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const emailRegExp = new RegExp(expression);

  if (url.match(emailRegExp)) {
    // Disabling button
    form.elements.submit.setAttribute('disabled', 'true');
    form.elements.submit.value="Loading";

    // Validations

    // AJAX
    $.ajax({
      url: "https://check-user-api.herokuapp.com/api/v1/uncoverUrl/",
      async: true, 
      success: function(res){
      // Updating Link
      $('#convertedURL').text(res.url);
      $('#convertedURL').setAttribute('href',res.url);

      // Enabling submit button
      form.elements.submit.removeAttribute('disabled');
      form.elements.submit.value="reveal";

      // Show result block
      $('.converted-url').css('display','block');
    },
    error: function(err) {
      // Enabling submit button
      form.elements.submit.removeAttribute('disabled');
      form.elements.submit.value="reveal";
    }
  });
  } else {
    $('#error-container').css('display', 'block');
  }

}