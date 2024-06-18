var videoData = []

function pausedChecker(){
document.getElementsByTagName("video")[0].addEventListener('pause', () => {
    if (!checkDuplicateVideoData()){
	storeVideoData()
    };
})
}

function playingChecker(){
document.getElementsByTagName("video")[0].addEventListener('play', () => {
 if (!checkDuplicateVideoData()){
	storeVideoData()
    };
})
}

function getVideoID(){
   return new URL(document.URL).searchParams.get('v')
}

function getVideoDuration(){
    return document.getElementsByTagName("video")[0].duration
}  

function getVideoPlaytime(){
    var videoPlaytime = []
    
    for(var i = 0; i < document.getElementsByTagName("video")[0].played.length; i++) { 
	var intervalStart = document.getElementsByTagName("video")[0].played.start(i)
	var intervalEnd = document.getElementsByTagName("video")[0].played.end(i)
	videoPlaytime.push(intervalStart + ":" + intervalEnd)
    }
    
    var videoData = {id: getVideoID(), playtime: videoPlaytime}
    return videoData
}

function checkDuplicateVideoData(){
    var index = videoData.findIndex(video => videoid = getVideoID())
    if (index !== -1) {
	return true
    }
    return false
}

function storeVideoData(){
    videoData.push(getVideoPlaytime())
}

function backupVideoData(data){
   localStorage.setItem('watchd', data);
}
