    
    var songs = ["song1.mp3","song2.mp3","song3.mp3"];
    var poster = ["images/hero1.jpg","images/hero2.jpg","images/hero3.jpg"];

    var songTitle = document.getElementById("songTitle");
    var fillBar = document.getElementById("fill");


    var song = new Audio(); 
    var currentSong = 0; //it points to the Current Song

    window.onload = playSong(); // Call Function Play Song when window is loaded

    function playSong() {
      
      song.src = songs[currentSong]; //set the source of the 0th song

      songTitle.textContent = songs[currentSong]; //set the title of the song

      song.play();
    }

    function playOrPauseSong(){

      if(song.paused){
        song.play();
        $("#play img").attr("src","images/pause.png");
      }
      else{
        song.pause();
        $("#play img").attr("src","images/play.png");
      }
    }

    song.addEventListener('timeupdate',function(){  

      var position = song.currentTime / song.duration;

      fillBar.style.width = position * 100 +'%';
    });

    function seek(){
      song.currentTime = Math.random()*song.duration;
    }

    function next(){

      currentSong++;
      if(currentSong > 2){
          currentSong = 0;
      }
      playSong();
      $("#play img").attr("src","images/pause.png");
      $("#image img").attr("src",poster[currentSong]);
      $("#bg img").attr("src",poster[currentSong]);
    }

    function pre(){

      currentSong--;
      if(currentSong < 0){
          currentSong = 2;
      }
      playSong();
      $("#play img").attr("src","images/pause.png");
      $("#image img").attr("src",poster[currentSong]);
      $("#bg img").attr("src",poster[currentSong]);
    }

    function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

// borrowed from https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
function updateUrlParameter (uri, key, value) {
  // remove the hash part before operating on the uri
  var
    i = uri.indexOf('#'),
    hash = i === -1 ? '' : uri.substr(i)
    ;

  uri = i === -1 ? uri : uri.substr(0, i);

  var
    re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
    separator = uri.indexOf('?') !== -1 ? "&" : "?"
    ;

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');

    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    // replace first occurrence of & by ? if no ? is present

    if (uri.indexOf('?') === -1) {
      uri = uri.replace(/&/, '?');
    }

  } else if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    uri = uri + separator + key + "=" + value;
  }
  return uri + hash;
}

var
  lang = getQueryStringValue('lang') || 'en',
  stretching = getQueryStringValue('stretching') || 'auto',
  languageSelector = document.querySelector('select[name=lang]'),
  stretchingSelector = document.querySelector('select[name=stretching]'),
  sourcesSelector = document.querySelectorAll('select[name=sources]'),
  sourcesTotal = sourcesSelector.length
;

languageSelector.value = lang;
languageSelector.addEventListener('change', function () {
  window.location.href = updateUrlParameter(window.location.href, 'lang', languageSelector.value);
});
stretchingSelector.value = stretching;
stretchingSelector.addEventListener('change', function () {
  window.location.href = updateUrlParameter(window.location.href, 'stretching', stretchingSelector.value);
});

for (var i = 0; i < sourcesTotal; i++) {
  sourcesSelector[i].addEventListener('change', function () {

    var
      media = this.closest('.players').querySelector('.mejs__container').id,
      player = mejs.players[media]
    ;

    player.setSrc(this.value.replace('&amp;', '&'));
    player.load();
    if (!mejs.Features.isiOS && !mejs.Features.isAndroid) {
      player.play();
    }

    var renderer = document.getElementById(player.media.id + '-rendername');
    renderer.querySelector('.src').innerHTML = '<a href="' + this.value + '" target="_blank">' + this.value + '</a>';
    renderer.querySelector('.renderer').innerHTML = player.media.rendererName;
    renderer.querySelector('.error').innerHTML = '';

  });

  // These media types cannot play at all on iOS, so disabling them
  if (mejs.Features.isiOS) {
    sourcesSelector[i].querySelector('option[value^="rtmp"]').disabled = true;
    if (sourcesSelector[i].querySelector('option[value$="webm"]')) {
      sourcesSelector[i].querySelector('option[value$="webm"]').disabled = true;
    }
    if (sourcesSelector[i].querySelector('option[value$=".mpd"]')) {
      sourcesSelector[i].querySelector('option[value$=".mpd"]').disabled = true;
    }
    if (sourcesSelector[i].querySelector('option[value$=".ogg"]')) {
      sourcesSelector[i].querySelector('option[value$=".ogg"]').disabled = true;
    }
    if (sourcesSelector[i].querySelector('option[value$=".flv"]')) {
      sourcesSelector[i].querySelector('option[value*=".flv"]').disabled = true;
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {

  mejs.i18n.language(lang);

  var mediaElements = document.querySelectorAll('video, audio'), i, total = mediaElements.length;

  for (i = 0; i < total; i++) {
    new MediaElementPlayer(mediaElements[i], {
      stretching: stretching,
      pluginPath: '../build/',
      success: function (media) {
        var renderer = document.getElementById(media.id + '-rendername');

        media.addEventListener('loadedmetadata', function () {
          var src = media.originalNode.getAttribute('src').replace('&amp;', '&');
          if (src !== null && src !== undefined) {
            renderer.querySelector('.src').innerHTML = '<a href="' + src + '" target="_blank">' + src + '</a>';
            renderer.querySelector('.renderer').innerHTML = media.rendererName;
            renderer.querySelector('.error').innerHTML = '';
          }
        });

        media.addEventListener('error', function (e) {
          renderer.querySelector('.error').innerHTML = '<strong>Error</strong>: ' + e.message;
        });
      }
    });
  }
});
