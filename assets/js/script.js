// Loader
document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'complete') {
    setTimeout(function () {
      $('#loader').fadeOut('slow');
    }, 1000);
  }
}

// Random Color loader
$(function () {
  const items = ['#2529D8', '#FAA916', '#EF2D56', '#6BD425', '#A01A7D', '#0767e8', '#07bae8', '#02c554', '#13c502', '#d32f2f', '#512da8']
  const root = document.documentElement;
  let randomColor = items[Math.floor(Math.random() * items.length)];
  root.style.setProperty('--primary-color', `${randomColor}`)
});

// Clipboard
function copyToClipboard(id) {
  var from = document.getElementById(id);
  var range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(from);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();

  $('#copied-status').fadeIn();
}

// AJAX call
function getData(form) {
  $('#error-container').fadeOut('fast');
  event.preventDefault();
  event.stopPropagation();

  let url = form.elements.url.value.trim();
  let submitButton = form.elements.submit;
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const emailRegExp = new RegExp(expression);

  if (url.match(emailRegExp)) {
    // Disabling button
    form.elements.submit.setAttribute('disabled', 'true');
    form.elements.submit.value = "Loading";

    // Resetting copied status
    $('#copied-status').fadeOut();

    // Validations

    // AJAX
    $.post({
      url: "https://check-user-api.herokuapp.com/api/v1/uncoverUrl/",
      async: true,
      contentType: "application/json",
      timeout: 3000,
      data: JSON.stringify({
        url: url
      }),
      success: function (res) {
        // Updating Data
        res.isShortUrl === "true" ? $('#convertedURL').text(res.url) : $('#convertedURL').text("😑 Thats not a short URL");
        $('#convertedURL').attr('href', res.url);

        if (res.spam === "true") {
          $('#spam-status').html(`👍 SAFE`)
        } else if (res.spam === "false") {
          $('#spam-status').html(`👹 SPAM`)
        } else {
          $('#spam-status').html(`🤔 No info`)
        }

        // Updating Extra details
        $('#title').html(res.pageTitle);
        $('#delay').html(`${res.delay}ms`);
        $('#status').html(res.statusCode);

        // Updating Stats
        $('.converted-stats').fadeIn('fast');
        $('#reveal-count').html(res.urlsShortenedTillNow);

        // Enabling submit button
        form.elements.submit.removeAttribute('disabled');
        form.elements.submit.value = "reveal";

        // Show result block
        $('.converted-url').fadeIn('fast');
      },
      error: function (err) {
        // Enabling submit button
        form.elements.submit.removeAttribute('disabled');
        form.elements.submit.value = "reveal";

        // Timeout
        if (err.statusText == "timeout") {
          $('#toast').html('😓 Timed out !! Try again later');
          $('#toast').fadeIn();
          setTimeout(() => { $('#toast').hide() }, 3000);
        } else {
          $('#toast').html('Uff!! An error on our end and we are notified ✌️');
          $('#toast').fadeIn();
          setTimeout(() => { $('#toast').hide() }, 3000);
        }
      }
    });
  } else {
    $('#error-container').fadeIn('fast');
  }

}