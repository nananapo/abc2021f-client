let labelList = [];
let isSensingEnabled = false;

function startSensing() {
    if (isSensingEnabled) return;
    isSensingEnabled = true;
    labelList = [];
    classifyVideo();
};
function stopSensing() {
    if (!isSensingEnabled) return;
    isSensingEnabled = false;
};

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/JnGMy66fo/';
// Video
let video;
let flippedVideo;



navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia    ||
    navigator.msGetUserMedia );

if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        
    })
    .catch(function(err) {
        alert("カメラを使用できません");
    });
}



function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    let canvas = createCanvas(320, 260);
    canvas.parent(document.getElementById("p5js"));
    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    flippedVideo = ml5.flipImage(video);
}

function draw() {
    background(0);

    // Draw the video
    /*
    image(flippedVideo, 0, 0);
    */

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(labelList[labelList.length - 1], width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    let label = results[0].label;

    console.log(label);

    labelList.push(label);
    if (labelList.length > 45) {
        labelList.shift();
    }

    // Classifiy again!
    if (isSensingEnabled) {
        classifyVideo();
    }
}

function getLabels() {
    return labelList;
}