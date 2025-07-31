let video = document.querySelector("video");
let constraints = {
    video: true,
    audio: true
};

let timer = document.querySelector(".timer");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let recorder;
let chunks = [];
let transparentColor = "transparent";
let timerID;
let counter = 0;

// Access user's camera
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", () => {
        chunks = [];
        startTimer();
    });

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    });

    recorder.addEventListener("stop", () => {
        stopTimer();
        let blob = new Blob(chunks, { type: "video/mp4" });
        let videoURL = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    });

    recordBtnCont.addEventListener("click", () => {
        if (!recorder) return;

        recordFlag = !recordFlag;

        if (recordFlag) {
            recorder.start();
            recordBtn.classList.add("scale-recorder");
        } else {
            recorder.stop();
            recordBtn.classList.remove("scale-recorder");
        }
    });
})
.catch((err) => {
    console.error("Error accessing media devices:", err);
});

// capture logic
captureBtnCont.addEventListener("click", () => {
    captureBtnCont.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    // convert to image AFTER drawing
    let imageURL = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    setTimeout(() => {
        captureBtnCont.classList.remove("scale-capture");
    }, 500);
});

let filter = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", () => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    });
});

// Timer logic
function startTimer() {
    counter = 0;
    timer.style.display = "block";

    function displayTimer() {
        let hours = String(Math.floor(counter / 3600)).padStart(2, '0');
        let minutes = String(Math.floor((counter % 3600) / 60)).padStart(2, '0');
        let seconds = String(counter % 60).padStart(2, '0');
        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }

    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}
