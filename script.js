var videoDataCollection = []

function videoActivityChecker() {
    var elementCheck = setInterval(function() {
	var video =  document.querySelector("video")
	if (video) {
	    video.addEventListener('timeupdate', () => {
		storeVideoData()
		fetchVideoPlaytimePercentage()
		fetchVideoEndedStatus()
		backupVideoData(JSON.stringify(videoDataCollection))
	    })
	    clearInterval(elementCheck);
	}}, 500);
}

function videoEndedChecker() {
    document.querySelector("video").addEventListener('ended', () => {
        storeVideoData()
	fetchVideoPlaytimePercentage()
	setVideoEndedStatus()
	fetchVideoEndedStatus()
        backupVideoData(JSON.stringify(videoDataCollection))
    })
}

function getVideoID() {
    return new URL(document.URL).searchParams.get('v')
}

function getVideoDuration() {
    var video = document.querySelector("video");
    return video ? video.duration : 0;
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
    var playtimeDuration = 0;
    segments.forEach((segment) => playtimeDuration += segment.end - segment.start);
    var videoDuration = getVideoDuration();
    return videoDuration ? (playtimeDuration / videoDuration * 100).toFixed(2) : "0";
}

function fetchVideoPlaytimePercentage() {
    var videoIndex = getVideoDataIndex()
    if (document.getElementById("playtime")) {
	if (videoIndex == -1) {
	    document.getElementById("playtime").innerHTML = "0%"
	} else {
	    document.getElementById("playtime").innerHTML = videoDataCollection[videoIndex].viewed + "%"
	}
    }
}

function setVideoEndedStatus() {
    var videoIndex = getVideoDataIndex();
    videoDataCollection[videoIndex].ended = true
}

function fetchVideoEndedStatus() {
    var videoIndex = getVideoDataIndex()
    if (videoIndex !== -1 && videoDataCollection[videoIndex].ended == true) {
	document.getElementById("playtime").innerHTML += " ✓"
    }
}

function storeVideoData() {
    if (!checkDuplicateVideoData()) {
	var videoData = {
	    id: getVideoID(),
	    segments: getSegmentsPlayed()
	}
	videoData.viewed = calculateVideoPlaytimePercentage(videoData.segments)
	videoDataCollection.push(videoData)
    }

    if (checkDuplicateVideoData()) {
	var videoIndex = getVideoDataIndex();
	var segmentsPlayed = getSegmentsPlayed();

	for (var i = 0; i < segmentsPlayed.length; i++) {
	    var isOverlapping = false;
	    for (var j = 0; j < videoDataCollection[videoIndex].segments.length; j++) {
		if (checkOverlap(segmentsPlayed[i], videoDataCollection[videoIndex].segments[j])) {
		    videoDataCollection[videoIndex].segments[j] = {
			"start": Math.min(segmentsPlayed[i].start, videoDataCollection[videoIndex].segments[j].start),
			"end": Math.max(segmentsPlayed[i].end, videoDataCollection[videoIndex].segments[j].end)
		    };
		    isOverlapping = true;
		    break;
		}
	    }
	    if (!isOverlapping) {
		videoDataCollection[videoIndex].segments.push(segmentsPlayed[i]);
	    }
	}

	videoDataCollection[videoIndex].segments.sort((a, b) => a.start - b.start);

	var mergedSegments = [];
	if (videoDataCollection[videoIndex].segments.length > 0) {
	    var currentSegment = videoDataCollection[videoIndex].segments[0];

	    for (var k = 1; k < videoDataCollection[videoIndex].segments.length; k++) {
		var nextSegment = videoDataCollection[videoIndex].segments[k];
		if (currentSegment.end >= nextSegment.start) {
		    currentSegment.end = Math.max(currentSegment.end, nextSegment.end);
		} else {
		    mergedSegments.push(currentSegment);
		    currentSegment = nextSegment;
		}
	    }
	    mergedSegments.push(currentSegment);
	}

	videoDataCollection[videoIndex].segments = mergedSegments;
	videoDataCollection[videoIndex].viewed = calculateVideoPlaytimePercentage(videoDataCollection[videoIndex].segments);
    }
}


function checkOverlap(segment,range) {
    if (segment.start <= range.start && segment.end >= range.start || 
	segment.start <= range.end && segment.end >= range.end || 
	segment.start >= range.start && segment.end <= range.end ||
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
	    injectedButton.style = "margin-left: 10px; padding: 0 10px; width: fit-content"

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
    endedChecker()
}

main()
