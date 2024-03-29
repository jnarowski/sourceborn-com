var header = document.querySelector('header');

if (header) {
  var openIcon = header.querySelector('.icon');
  var closeIcon = header.querySelector('.nav span');

  if (openIcon) {
    openIcon.addEventListener('click', function () {
      this.parentNode.parentNode.className = 'open-nav';
    });
  }

  if (closeIcon) {
    var mobileLinks = closeIcon.parentNode.querySelectorAll('div ul li a');
    var totalLinks = mobileLinks.length;

    if (totalLinks) {
      for (var x = 0; x < totalLinks; x++) {
        mobileLinks[x].addEventListener('click', function (e) {
          e.preventDefault();

          var divId = this.getAttribute('href');

          closeIcon.parentNode.parentNode.parentNode.removeAttribute('class');

          setTimeout(function () {
            var div = document.querySelector(divId);

            if (div) {
              scrollToAnimate(div, 30, 5);
            }
          }, 700)
        });
      }
    }

    closeIcon.addEventListener('click', function () {
      this.parentNode.parentNode.parentNode.removeAttribute('class');
    });
  }
}

//animate stats
var stats = document.querySelectorAll('.stats');
var totalStats = stats.length;
var animatedStats = false;

if (totalStats) {
  animateStats(stats);
}

//animate sections
var animate = document.querySelectorAll('.animate');
var totalAnimate = animate.length;

if (totalAnimate) {
  for (var x = 0; x < totalAnimate; x++) {
    initiateScroll(animate[x]);
  }
}

window.addEventListener('scroll', function (e) {
  if (totalAnimate) {
    for (var x = 0; x < totalAnimate; x++) {
      initiateScroll(animate[x]);
    }
  }
  if (stats && !animatedStats) {
    animateStats(stats);
  }
});

function scrollToAnimate(element, increment, intervalTime, scrollOverrideOffset) {
  var position = window.scrollY || window.scrollY >= 0 ? window.scrollY : window.screenTop;
  var parent = element;
  var parentLoop = true;
  var scrollPixels = scrollOverrideOffset ? -scrollOverrideOffset + 1 : 0;

  do {
    parentLoop = (parent !== null && parent.localName != 'body') ? true : false;

    if (parentLoop) {
      scrollPixels += parent.offsetTop;
      parent = parent.offsetParent;
    }
  } while (parentLoop);

  var scrollDown = position < scrollPixels ? true : false;

  var autoScroll = setInterval(function () {
    scrollDown ? position += increment : position -= increment;

    if (position + increment > scrollPixels && scrollDown || position - increment < scrollPixels && !scrollDown) {
      position = scrollPixels;
    }

    window.scrollTo(0, position);

    var windowScroll = window.scrollY || window.scrollY >= 0 ? Math.ceil(window.scrollY) : Math.ceil(window.screenTop);

    if (windowScroll >= scrollPixels && scrollDown || window.innerHeight + position >= document.documentElement.offsetHeight && scrollDown || windowScroll <= scrollPixels && !scrollDown) {
      window.scrollTo(0, scrollPixels + 10);
      clearInterval(autoScroll);
    }
  }, intervalTime);
}

function animateStats(_stats) {
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var totalStats = _stats.length;

  if (totalStats) {
    var divBounds = _stats[0].getBoundingClientRect();
    var divTopBreak = divBounds.top - (windowHeight * 0.9);

    if (divTopBreak < 0) {
      setTimeout(function () {
        for (var x = 0; x < totalStats; x++) {
          var percent = _stats[x].getAttribute('data-percent');

          _stats[x].lastElementChild.innerText = percent + '%';
          _stats[x].lastElementChild.style.width = percent + '%';
          _stats[x].lastElementChild.style.paddingLeft = '20px';
        }
      }, 500);

      animatedStats = true;
    }
  }
}

function initiateScroll(_node) {
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var animateDivs = _node.querySelectorAll('.row .col-12, .row .col-4');
  var totalAnimateDivs = animateDivs.length;

  if (totalAnimateDivs) {
    var setAnimations = 0;

    for (var x = 0; x < totalAnimateDivs; x++) {
      if (!animateDivs[x].animated && animateDivs[x].getAttribute('data-animation')) {
        var divBounds = animateDivs[x].getBoundingClientRect();
        var divTopBreak = divBounds.top - (windowHeight * 0.9);

        if (divTopBreak < 0) {
          var delayTime = setAnimations === 0 ? 0 : 75 * setAnimations;

          animateDivs[x].animated = true;
          setAnimations++;

          setTimeout(function (x) {
            animateDivs[x].className += ' ' + animateDivs[x].getAttribute('data-animation');
          }, delayTime, x);
        }
      }
    }
  }
}

function submitForm(_form) {
  var validForm = validateForm(_form);

  if (validForm) {
    var formData = new FormData(_form);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4) {
        if (xhttp.status === 200) {
          try {
            var response = JSON.parse(xhttp.response)
          } catch (e) {
            var response = xhttp.response;
          }

          if (response.success) {
            var formBtn = _form.querySelector('fieldset button');

            if (formBtn) {
              formBtn.disabled = true;
              formBtn.innerText = 'Thank you!';
            }
          } else {
            alert(response.error);
          }
        } else {
          throw 'invalid HTTP request: ' + xhttp.status + ' response';
        }
      }
    };

    xhttp.open(_form.getAttribute('method'), _form.getAttribute('action'), true);
    xhttp.send(formData);
  }

  return false;
}

function emailMe(event) {
  window.location.href = "mailto:mail@sourceborn.com";
}

function validateForm(_form) {
  var fields = _form.querySelectorAll('input[type="text"], input[type="email"], textarea');
  var totalFields = fields.length;
  var validForm = true;

  if (totalFields) {
    for (var x = 0; x < totalFields; x++) {
      var fieldType = fields[x].getAttribute('type');
      var required = fields[x].getAttribute('required');

      if (!fieldType) {
        fieldType = fields[x].nodeName.toLowerCase();
      }

      if (required !== null) {
        var fieldValue = fields[x].value;


        switch (fieldType) {
          case 'email':
            var emailRegex = /\S+@\S+\.\S+/;
            var validField = emailRegex.test(fieldValue);

            break;
          case 'select':
            var validField = fieldValue !== '' ? true : false;

            break
          default:
            var validField = fieldValue !== '' ? true : false;

        }

        fields[x].parentNode.className = !validField ? 'invalid' : '';

        if (!validField && validForm) {
          validForm = !validForm;
        }
      }
    }
  }

  return validForm
}
