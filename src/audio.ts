const audioSection = <HTMLElement>document.createElement("section");
const audioButton = <HTMLButtonElement>document.createElement("button");

//section
audioSection.id = "audio-player";
audioSection.classList.add("audio__player");
//set audio element
const audioElement = new Audio("assets/mixkit-beautiful-dream-493.mp3");
audioElement.id = "media-audio";
audioElement.autoplay = false;
audioElement.setAttribute("crossorigin", "anonymous");
// set audio button element
audioButton.type = "button";
audioButton.id = "audio-button";
audioButton.role = "switch";
audioButton.setAttribute("data-playing", "false");
audioButton.textContent = "Play";
let audioCtx: AudioContext | undefined;
let offset = 0;

async function getfile(filePath: string | URL) {
  const response = await fetch(filePath);
  const buffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx!.decodeAudioData(buffer);
  return audioBuffer;
}

async function loadFile(filePath: string | URL) {
  if (!audioCtx) {
    console.log("audio context undefined");
    return;
  }
  const file = await getfile(filePath);

  return file;
}

function playAudio(audioBuffer: AudioBuffer) {
  const track = new AudioBufferSourceNode(audioCtx!, {
    buffer: audioBuffer,
  });
  track.connect(audioCtx!.destination);
  if (offset == 0) {
    track.start();
    offset = audioCtx!.currentTime;
  } else {
    track.start(0, audioCtx!.currentTime - offset);
  }
  return track;
}

audioButton.addEventListener(
  "click",
  async () => {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    const audioFile = await loadFile(audioElement.src)
      .then((file) => {
        return file;
      })
      .catch((err) => {
        console.error(err);
      });

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    playAudio(audioFile!);
    audioButton.dataset.playing = "true";
  },
  false,
);

audioSection.append(audioElement, audioButton);
export default audioSection;
