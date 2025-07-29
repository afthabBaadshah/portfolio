const fileInput = document.getElementById('audioFile');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let audioCtx, analyser, source, dataArray, bufferLength;

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    document.body.appendChild(audio);
    audio.play();
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        visualize();
    }
});

function visualize() {
    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 2;
    }
}
