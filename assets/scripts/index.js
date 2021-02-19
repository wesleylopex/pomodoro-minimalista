function WorkApp () {
  const currentSettings = {
    time: {
      minutes: 25,
      seconds: 0
    },
    isPlaying: false
  }

  function resetTimer () {
    currentSettings.time = { minutes: 25, seconds: 0 }
    currentSettings.isPlaying = false

    updateButtons()
    updateDisplayTimer()
  }

  function updateButtons () {
    const playButton = document.querySelector('#play-button')
    const pauseButton = document.querySelector('#pause-button')
    const stopButton = document.querySelector('#stop-button')

    const actionsByPlayingStatus = {
      true () {
        playButton.style.display = 'none'
        pauseButton.style.display = 'block'
        stopButton.style.display = 'block'
      },
      false () {
        playButton.style.display = 'block'
        pauseButton.style.display = 'none'
        stopButton.style.display = 'none'
      }
    }

    const run = actionsByPlayingStatus[currentSettings.isPlaying]

    if (run) run()
  }

  function formatTime (time) {
    const numberTime = Number(time)
    return numberTime > 10 ? numberTime : `0${numberTime}`
  }

  function runTimerInterval () {
    setInterval(() => {
      if (!currentSettings.isPlaying) return false

      currentSettings.time.seconds -= 1

      if (currentSettings.time.seconds < 0) {
        currentSettings.time.seconds = 59
        currentSettings.time.minutes -= 1
      }

      updateDisplayTimer()
    }, 1000)
  }

  function updateDisplayTimer () {
    const timerDisplay = document.querySelector('#timer-display')
    const { minutes, seconds } = currentSettings.time

    timerDisplay.innerHTML = `${formatTime(minutes)}:${formatTime(seconds)}`

    updateCirclePercentage()
  }

  function timeToSeconds (time) {
    return (Number(time.minutes) * 60) + Number(time.seconds)
  }

  function updateCirclePercentage () {
    const percentageContainer = document.querySelector('#percentage-container')
    const circlePercentage = percentageContainer.querySelector('svg circle')

    const fullCircleLength = circlePercentage.getAttribute('stroke-dasharray')

    const percentage = Number(fullCircleLength) * timeToSeconds(currentSettings.time) / timeToSeconds({ minutes: 25, seconds: 0 })

    circlePercentage.setAttribute('stroke-dashoffset', percentage)
  }

  function handlePlayTimer () {
    const playButton = document.querySelector('#play-button')
    playButton.addEventListener('click', (event) => {
      currentSettings.isPlaying = true
      updateButtons()
    })
  }

  function handlePauseTimer () {
    const pauseButton = document.querySelector('#pause-button')
    pauseButton.addEventListener('click', () => {
      currentSettings.isPlaying = false
      updateButtons()
    })
  }

  function handleStopTimer () {
    const stopButton = document.querySelector('#stop-button')
    stopButton.addEventListener('click', () => {
      resetTimer()
      updateButtons()
    })
  }

  function init () {
    resetTimer()
    updateDisplayTimer()
    runTimerInterval()
    handlePlayTimer()
    handlePauseTimer()
    handleStopTimer()
  }

  return {
    init
  }
}

window.addEventListener('load', () => {
  feather.replace()

  const workApp = WorkApp()
  workApp.init()
})
