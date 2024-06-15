function pausedChecker(){
document.getElementsByTagName("video")[0].addEventListener('pause', () => {
        console.log('The video has been paused at ' + getVideoCurrentTime());
})
}

function playingChecker(){
document.getElementsByTagName("video")[0].addEventListener('play', () => {
        console.log('The video started playing at ' + getVideoCurrentTime());
})
}

function getVideoID(){
   return new URL(document.URL).searchParams.get('v')
}

function getVideoCurrentTime(){
   return document.getElementsByTagName("video")[0].currentTime
}
