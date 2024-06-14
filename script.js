function pausedChecker(){
document.getElementsByTagName("video")[0].addEventListener('pause', () => {
        console.log('The video has been paused.');
})
}

function playingChecker(){
document.getElementsByTagName("video")[0].addEventListener('play', () => {
        console.log('The video is playing.');
})
}
