function TimerApp () {
  const DOM = {
    timerDisplay: document.querySelector('#timer-display'),
    playButton: document.querySelector('#play-button'),
    pauseButton: document.querySelector('#pause-button'),
    stopButton: document.querySelector('#stop-button'),
    tabs: {
      work: document.querySelector('#work-tab'),
      break: document.querySelector('#break-tab')
    }
  }

  const defaultSettings = {
    work: {
      time: {
        minutes: 25,
        seconds: 0
      },
      isPlaying: false
    },
    break: {
      time: {
        minutes: 5,
        seconds: 0
      },
      isPlaying: false
    }
  }

  let activeTab = 'work'

  let currentSettings = { ...defaultSettings[activeTab] }

  const interval = () => setInterval(() => {
    if (currentSettings.time.minutes <= 0 && currentSettings.time.seconds <= 0) {
      resetTimer()
    }

    if (!currentSettings.isPlaying) return false

    currentSettings.time.seconds -= 1

    if (currentSettings.time.seconds < 0) {
      currentSettings.time.seconds = 59
      currentSettings.time.minutes -= 1
    }

    updateDisplayTimer()
  }, 1000)

  function resetTimer () {
    currentSettings.time = { ...defaultSettings[activeTab].time }
    currentSettings.isPlaying = defaultSettings[activeTab].isPlaying

    updateButtons()
    updateDisplayTimer()
    clearInterval(interval)
  }

  function updateButtons () {
    const { playButton, pauseButton, stopButton } = DOM

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
    return numberTime >= 10 ? numberTime : `0${numberTime}`
  }

  function runTimerInterval () {
    interval()
  }

  function updateDisplayTimer () {
    const { timerDisplay } = DOM
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

    const percentage = Number(fullCircleLength) * timeToSeconds(currentSettings.time) / timeToSeconds({ ...defaultSettings[activeTab].time })
    circlePercentage.setAttribute('stroke-dashoffset', percentage)
  }

  function handlePlayTimer () {
    DOM.playButton.addEventListener('click', (event) => {
      currentSettings.isPlaying = true
      updateButtons()
    })
  }

  function handlePauseTimer () {
    DOM.pauseButton.addEventListener('click', () => {
      currentSettings.isPlaying = false
      updateButtons()
    })
  }

  function handleStopTimer () {
    DOM.stopButton.addEventListener('click', () => {
      resetTimer()
      updateButtons()
    })
  }

  function clearAllTabs () {
    for (const index in DOM.tabs) {
      const tab = DOM.tabs[index]
      tab.classList.remove('active')
    }
  }

  function handleClickTabs () {
    for (const index in DOM.tabs) {
      const tab = DOM.tabs[index]
      tab.addEventListener('click', () => {
        activeTab = `${index}`
        clearAllTabs()
        updateByActiveTab()
        tab.classList.add('active')
      })
    }
  }

  function updateByActiveTab () {
    currentSettings = { ...defaultSettings[activeTab] }
    resetTimer()
    updateDisplayTimer()
  }

  function init () {
    resetTimer()
    updateDisplayTimer()
    runTimerInterval()
    handlePlayTimer()
    handlePauseTimer()
    handleStopTimer()
    handleClickTabs()
  }

  return {
    init
  }
}

window.addEventListener('load', () => {
  const workApp = TimerApp()
  workApp.init()
})
