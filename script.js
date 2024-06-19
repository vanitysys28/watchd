var videoData = []

function playingChecker(){
document.getElementsByTagName("video")[0].addEventListener('play', () => {
 if (!checkDuplicateVideoData()){
	storeVideoData()
    };
})
}

function pausedChecker(){
document.getElementsByTagName("video")[0].addEventListener('pause', () => {
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
    
    for(var i = 0; i < document.querySelector("video").played.length; i++) { 
	var intervalStart = document.querySelector("video").played.start(i)
	var intervalEnd = document.querySelector("video").played.end(i)
	videoPlaytime.push(intervalStart + ":" + intervalEnd)
    }
    
    var videoData = {id: getVideoID(), playtime: videoPlaytime}
    return videoData
}

function checkDuplicateVideoData(){
    var index = videoData.findIndex(video => video.id == getVideoID())
    if (index !== -1) {
	return true
    }
}

function storeVideoData(){
    videoData.push(getVideoPlaytime())
}

function backupVideoData(data){
   localStorage.setItem('watchd', data);
}

setInterval (function main(){
  if (!checkDuplicateVideoData()){
	storeVideoData()
  }
}, 5000);
