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
        segmentsPlayed.push(intervalStart + ":" + intervalEnd)
    }

    return segmentsPlayed
}

function checkDuplicateVideoData() {
    var index = videoDataCollection.findIndex(video => video.id == getVideoID())
    if (index !== -1) {
        videoDataCollection.splice(index, 1);
    }
}

function calculateVideoPlaytimePercentage(segments) {
    var playtimeDuration = 0
    segments.forEach((segment) => playtimeDuration += segment.split(':')[1] - segment.split(':')[0]);
    return (playtimeDuration / getVideoDuration() * 100).toFixed(2)
}

function storeVideoData() {
    var videoData = {
        id: getVideoID(),
        segments: getSegmentsPlayed()
    }
    videoData.viewed = calculateVideoPlaytimePercentage(videoData.segments)
    videoDataCollection.push(videoData)
}

function backupVideoData(data) {
    localStorage.setItem('watchd', data);
}

function fetchLocalStorage() {
    if (JSON.parse(localStorage.getItem("watchd"))) {
        videoDataCollection = JSON.parse(localStorage.getItem("watchd"))
    }

}

function main() {
    fetchLocalStorage()
    playingChecker()
    pausedChecker()
}

main()
