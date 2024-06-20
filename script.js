var videoDataCollection = []

function playingChecker(){
    document.querySelector("video").addEventListener('play', () => {
 checkDuplicateVideoData()
	storeVideoData()
})
}

function pausedChecker(){
    document.querySelector("video").addEventListener('pause', () => {
    checkDuplicateVideoData()
	storeVideoData()
})
}

function getVideoID(){
   return new URL(document.URL).searchParams.get('v')
}

function getVideoDuration(){
    return document.querySelector("video").duration
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
    var index = videoDataCollection.findIndex(video => video.id == getVideoID())
    if (index !== -1) {
	videoDataCollection.splice(index, 1);
    } 
}

function storeVideoData(){
    videoDataCollection.push(getVideoPlaytime())
}

function backupVideoData(data){
   localStorage.setItem('watchd', data);
}

function main(){
    playingChecker()
    pausedChecker()
}

main()
