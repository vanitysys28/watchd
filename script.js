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
    var videoIndex = getDuplicateVideoDataIndex()
    if (videoIndex !== -1) {
	return true
    }
}

function getDuplicateVideoDataIndex() {
    return videoDataCollection.findIndex(video => video.id == getVideoID())
}

function calculateVideoPlaytimePercentage(segments) {
    var playtimeDuration = 0
    segments.forEach((segment) => playtimeDuration += segment.end - segment.start);
    return (playtimeDuration / getVideoDuration() * 100).toFixed(2)
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
	var videoIndex = getDuplicateVideoDataIndex()
	videoDataCollection[videoIndex].segments = getSegmentsPlayed()
	videoDataCollection[videoIndex].viewed = calculateVideoPlaytimePercentage(videoDataCollection[videoIndex].segments)
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
var injectedButton = document.createElement("button")
injectedButton.id = "playtime"
injectedButton.classList.add("yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-button")
    injectedButton.style ="margin-left: 10px;"

document.getElementById("owner").appendChild(injectedButton)
}

function main() {
    injectButton()
    fetchLocalStorage()
    playingChecker()
    pausedChecker()
}

main()
