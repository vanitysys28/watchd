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

function getSegmentsPlayed(){
    var segmentsPlayed = []
    
    for(var i = 0; i < document.querySelector("video").played.length; i++) { 
	var intervalStart = document.querySelector("video").played.start(i)
	var intervalEnd = document.querySelector("video").played.end(i)
	segmentsPlayed.push(intervalStart + ":" + intervalEnd)
    }
    
    return segmentsPlayed
}

function checkDuplicateVideoData(){
    var index = videoDataCollection.findIndex(video => video.id == getVideoID())
    if (index !== -1) {
	videoDataCollection.splice(index, 1);
    } 
}

function calculateVideoPlaytimePercentage(){
    var index = videoDataCollection.findIndex(video => video.id == getVideoID())
    var playtimeDuration = 0

    for(var i = 0; i < videoDataCollection.length ; i++) { 
	if (i == index) { 
	     videoDataCollection[index].playtime.forEach((element) => playtimeDuration += element.split(':')[1] - element.split(':')[0]);
	    return (playtimeDuration / getVideoDuration() * 100).toFixed(2)
    }
    }
}

function storeVideoData(){
    var videoData = {id: getVideoID(), segments: getSegmentsPlayed()}
    videoDataCollection.push(videoData)
}

function backupVideoData(data){
   localStorage.setItem('watchd', data);
}

function main(){
    playingChecker()
    pausedChecker()
}

main()
