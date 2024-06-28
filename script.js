var videoDataCollection = []

function playingChecker() {
    document.querySelector("video").addEventListener('play', () => {
        checkDuplicateVideoData()
        storeVideoData()
        backupVideoData(JSON.stringify(videoDataCollection))
    })
}

function pausedChecker() {
    document.querySelector("video").addEventListener('pause', () => {
        checkDuplicateVideoData()
        storeVideoData()
        backupVideoData(JSON.stringify(videoDataCollection))
    })
}

function getVideoID() {
    return new URL(document.URL).searchParams.get('v')
}

function getVideoDuration() {
    return document.querySelector("video").duration
}

function getSegmentsPlayed() {
    var segmentsPlayed = []

    for (var i = 0; i < document.querySelector("video").played.length; i++) {
        var intervalStart = document.querySelector("video").played.start(i)
        var intervalEnd = document.querySelector("video").played.end(i)
        segmentsPlayed.push({start: intervalStart, end: intervalEnd})
    }

    return segmentsPlayed
}

function checkDuplicateVideoData() {
    var videoIndex = getVideoDataIndex()
    if (videoIndex !== -1) {
	return true
    }
}

function getVideoDataIndex() {
    return videoDataCollection.findIndex(video => video.id == getVideoID())
}

function calculateVideoPlaytimePercentage(segments) {
    var playtimeDuration = 0
    segments.forEach((segment) => playtimeDuration += segment.end - segment.start);
    return (playtimeDuration / getVideoDuration() * 100).toFixed(2)
}

function fetchVideoPlaytimePercentage() {
    if (getVideoDataIndex() == -1){
	document.getElementById("playtime").innerHTML = 0%
    }

    if (getVideoDataIndex() !== -1) {
	var videoIndex = getVideoDataIndex()
	document.getElementById("playtime").innerHTML = videoDataCollection[videoIndex].viewed + "%"
    }
}

function storeVideoData() {
    if (!checkDuplicateVideoData) {
	var videoData = {
            id: getVideoID(),
            segments: getSegmentsPlayed()
	}
	videoData.viewed = calculateVideoPlaytimePercentage(videoData.segments)
	videoDataCollection.push(videoData)
    }

    if (checkDuplicateVideoData) {
	var videoIndex = getVideoDataIndex()
	videoDataCollection[videoIndex].segments = getSegmentsPlayed()
	videoDataCollection[videoIndex].viewed = calculateVideoPlaytimePercentage(videoDataCollection[videoIndex].segments)
    }
}

function checkOverlap(range) {
     if (segment.start < range.start && segment.end > range.start || 
  segment.start < range.end && segment.end > range.end || 
  segment.start > range.start && segment.end < range.end ||
	 segment.start <= range.start && segment.end >= range.end) {
	 return true
      }
}

function backupVideoData(data) {
    localStorage.setItem('watchd', data);
}

function fetchLocalStorage() {
    if (JSON.parse(localStorage.getItem("watchd"))) {
        videoDataCollection = JSON.parse(localStorage.getItem("watchd"))
    }
}

function injectButton() {

    var elementCheck = setInterval(function() {
        if (document.getElementById("owner")) {
            var injectedButton = document.createElement("button")
            injectedButton.id = "playtime"
            injectedButton.classList.add("yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-button")
            injectedButton.style = "margin-left: 10px;"

            document.getElementById("owner").appendChild(injectedButton)
            clearInterval(elementCheck);
        }
    }, 500);
}


function main() {
    injectButton()
    fetchLocalStorage()
    playingChecker()
    pausedChecker()
}

main()
