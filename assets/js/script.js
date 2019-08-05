"use strict";

// Loader
document.onreadystatechange = function () {
  let state = document.readyState
  if (state == 'complete') {
    setTimeout(function () {
      $('#loader').fadeOut('slow');

      // checking for link on load
      if (window.location.search) {

        let search = window.location.search.split('&');
        let finder = new RegExp('.*url=', 'gi');
        let url = search.filter((each) => each.match(finder));

        // EDGE CASE - if query params has multiple url params, consider only first
        url = url[0].replace(finder, '')

        if (url.trim().length > 0) {
          $('.input')[0].value = url;
          $('#submit').click();
        }
      }
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
  let from = document.getElementById(id);
  let range = document.createRange();
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


    // AJAX
    $.post({
      url: "https://check-user-api.herokuapp.com/api/v1/uncoverUrl/",
      async: true,
      contentType: "application/json",
      timeout: 5000,
      data: JSON.stringify({
        url: url
      }),
      success: function (res) {
        // Updating Data
        
        res.isShortUrl === true ? $('#convertedURL').text(res.url) : $('#convertedURL').text("😑 Thats not a short URL");
        res.url ? $('#convertedURL').attr('href', res.url) : $('#convertedURL').attr('href', url)

        // Number(0.987.toFixed(2))

        if (res.spamDetails) {

          let safetyProbability = (1 - (res.spamDetails.servicesReportSpam / res.spamDetails.servicesChecked)).toFixed(2) * 100;

          if (safetyProbability < 0.25) {
            $('#spam-status').html(`👹 SPAM`);
          } else if (safetyProbability > 0.25 && safetyProbability <= 0.5) {
            $('#spam-status').html(`⚠️ BE CAREFUL`);
          } else if (safetyProbability > 0.5 && safetyProbability <= 0.75) {
            $('#spam-status').html(`🤞 ALMOST SAFE`);
          } else {
            $('#spam-status').html(`👍 SAFE`);
          }

          $('#spam-status').attr('data-tooltip', `${safetyProbability}% Sure`);

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
