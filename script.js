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

function getVideoPlaytime(){
    var videoPlaytime = []
    for(var i = 0; i < document.getElementsByTagName("video")[0].played.length; i++) { 
	var intervalStart = document.getElementsByTagName("video")[0].played.start(i)
	var intervalEnd = document.getElementsByTagName("video")[0].played.end(i)
	videoPlaytime.push(intervalStart + ":" + intervalEnd)
    }
    return videoPlaytime
}

function storeVideoPlaytime(){
    var videoid = getVideoID()
    var time = getVideoCurrentTime()
    var videoPlaytime = {id: videoid, playtime: time}
    return videoPlaytime
}

function checkDuplicateVideoData(){
    var index = videoData.findIndex(video => videoid = getVideoID())
    if (index !== -1) {
	return true
    }
}

function aggregateVideoData(){
    videoData.push(storeVideoPlaytime())
}

function setLocalStorage(data){
   localStorage.setItem('watchd', data);
}
