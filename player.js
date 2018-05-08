    
    var songs = ["songs/song1.mp3","songs/song2.mp3","songs/song3.mp3","songs/song4.mp3","songs/song5.mp3","songs/song6.mp3","songs/song7.mp3","songs/song8.mp3","songs/song9.mp3","songs/song10.mp3","songs/song11.mp3","songs/song12.mp3"];
    var poster = ["images/hero1.jpg","images/hero2.jpg","images/hero3.jpg","images/hero4.jpg","images/hero5.jpg","images/m1.jpg","images/m2.png","images/m3.jpg"];

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

      fillBar.style.width = position * 90 +'%';
    });

    function seek(){
      song.currentTime = Math.random()*song.duration;
    }

    function next(){

      currentSong++;
      if(currentSong > 12){
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

