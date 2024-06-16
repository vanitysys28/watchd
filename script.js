var videoData = []

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

function storeVideoPlaytime(){
    var videoid = getVideoID()
    var time = getVideoCurrentTime()
    var videoPlaytime = {id: videoid, playtime: time}
    return videoPlaytime
}

function aggregateVideoData(){
    videoData.push(storeVideoPlaytime())
}

function setLocalStorage(data){
   localStorage.setItem('watchd', data);
}
