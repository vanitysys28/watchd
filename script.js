let videoDataCollection = []

function videoActivityChecker() {
    let elementCheck = setInterval(function() {
        const video = document.querySelector("video");
        if (video) {
            video.addEventListener('timeupdate', () => {
                storeVideoData();
                fetchVideoPlaytimePercentage();
                fetchVideoEndedStatus();
                backupVideoData(JSON.stringify(videoDataCollection));
            });
            clearInterval(elementCheck);
        } else {
            console.log("Video element not found. Retrying...");
        }
    }, 500);
}

function videoEndedChecker() {
    let videoCheck = setInterval(function() {
        const video = document.querySelector("video");
        if (video) {
            video.addEventListener('ended', () => {
                storeVideoData();
                fetchVideoPlaytimePercentage();
                setVideoEndedStatus();
                fetchVideoEndedStatus();
                backupVideoData(JSON.stringify(videoDataCollection));
            });
            clearInterval(videoCheck);
        }
    }, 500);
}

function getVideoID() {
    return new URL(document.URL).searchParams.get('v')
}

function getVideoDuration() {
    const video = document.querySelector("video");
    return video ? video.duration : 0;
}

function getSegmentsPlayed() {
    let segmentsPlayed = []

    for (let i = 0; i < document.querySelector("video").played.length; i++) {
        const intervalStart = document.querySelector("video").played.start(i)
        const intervalEnd = document.querySelector("video").played.end(i)
        segmentsPlayed.push({start: intervalStart, end: intervalEnd})
    }

    return segmentsPlayed
}

function checkDuplicateVideoData() {
    const videoIndex = getVideoDataIndex()
    if (videoIndex !== -1) {
	return true
    }
}

function getVideoDataIndex() {
    return videoDataCollection.findIndex(video => video.id == getVideoID())
}

function calculateVideoPlaytimePercentage(segments) {
    let playtimeDuration = 0;
    segments.forEach((segment) => playtimeDuration += segment.end - segment.start);
    const videoDuration = getVideoDuration();
    return videoDuration ? (playtimeDuration / videoDuration * 100).toFixed(2) : "0";
}

function fetchVideoPlaytimePercentage() {
    const videoIndex = getVideoDataIndex()
    if (document.getElementById("playtime")) {
	if (videoIndex == -1) {
	    document.getElementById("playtime").innerText = "0%"
	} else {
	    document.getElementById("playtime").innerText = videoDataCollection[videoIndex].viewed + "%"
	}
    }
}

function setVideoEndedStatus() {
    const videoIndex = getVideoDataIndex();
    videoDataCollection[videoIndex].ended = true
}

function fetchVideoEndedStatus() {
    const videoIndex = getVideoDataIndex()
    if (videoIndex !== -1 && videoDataCollection[videoIndex].ended == true) {
	document.getElementById("playtime").innerText += " ✓"
    }
}

function storeVideoData() {
    if (!checkDuplicateVideoData()) {
	const videoData = {
	    id: getVideoID(),
	    segments: getSegmentsPlayed()
	}
	videoData.viewed = calculateVideoPlaytimePercentage(videoData.segments)
	videoDataCollection.push(videoData)
    }

    if (checkDuplicateVideoData()) {
	const videoIndex = getVideoDataIndex();
	const segmentsPlayed = getSegmentsPlayed();

	for (let i = 0; i < segmentsPlayed.length; i++) {
	    let isOverlapping = false;
	    for (let j = 0; j < videoDataCollection[videoIndex].segments.length; j++) {
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

	let mergedSegments = [];
	if (videoDataCollection[videoIndex].segments.length > 0) {
	    let currentSegment = videoDataCollection[videoIndex].segments[0];

	    for (let k = 1; k < videoDataCollection[videoIndex].segments.length; k++) {
		let nextSegment = videoDataCollection[videoIndex].segments[k];
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
    let elementCheck = setInterval(function() {
        if (document.getElementById("owner")) {
            if (!document.getElementById("playtime")) {
                let injectedButton = document.createElement("button");
                injectedButton.id = "playtime";
                injectedButton.classList.add("yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-button");
                injectedButton.style = "margin-left: 10px; padding: 0 10px; width: fit-content";
                document.getElementById("owner").appendChild(injectedButton);
                fetchVideoPlaytimePercentage(); 
            }
            clearInterval(elementCheck);
        }
    }, 500);
}


function main() {
    injectButton()
    fetchLocalStorage()
    videoActivityChecker()
    videoEndedChecker()
}

main()
