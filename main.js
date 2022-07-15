const audioChunks = []

function play() {
  const audioBlob = new Blob(audioChunks);
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}

let mediaRecorder

function initMediaRecorder() {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data)
    })
    mediaRecorder.addEventListener("stop", () => {
      play()
    })
  })
}

initMediaRecorder()

const uttr = new SpeechSynthesisUtterance()
uttr.lang='ja-JP'
speechSynthesis.addEventListener("voiceschanged", () => {
  const googleJapanese = speechSynthesis.getVoices().filter(voice => voice.name === "Google 日本語")[0]
  if (googleJapanese) uttr.voice = googleJapanese
})

const RECORDING_CLASS = 'recording'

function recordPlay(e, el) {
  e.stopPropagation()

  if (el.classList.contains(RECORDING_CLASS)) {
    stop()
    el.classList.remove(RECORDING_CLASS)
  } else {
    el.classList.add(RECORDING_CLASS)
    start()
  }
}

function start() {
  if (mediaRecorder.state === 'recording') return
  audioChunks.length = 0
  // console.log('start')
  try {
    mediaRecorder.start()
  } catch (e) {
    initMediaRecorder()
    mediaRecorder.start()
  }
}

function stop() {
  if(mediaRecorder.state === 'inactive') return

  // console.log('stop')
  mediaRecorder.stop();
}


document.onkeydown = e => {
  // console.log(e)
  if (e.key == 'Shift') {
    start()
  } else if (e.key == 'Control') {
    if (audioChunks.length == 0) return
    play()
  } else if (e.key == 'a') {
    if (speechSynthesis.speaking) return
    const selectedText = window.getSelection().toString()
    if (!selectedText) return
    uttr.text = selectedText
    speechSynthesis.speak(uttr)
  }
}

document.onkeyup = e => {
  if (e.key != 'Shift') return
  stop() 
}

function playAudio(fille) {
  console.log(fille)
  const audio = new Audio(fille)
  audio.play()
}
