function TimerApp (timerType = 'work') {
  const DOM = {
    timerDisplay: document.querySelector('#timer-display'),
    playButton: document.querySelector('#play-button'),
    pauseButton: document.querySelector('#pause-button'),
    stopButton: document.querySelector('#stop-button')
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

  const currentSettings = { ...defaultSettings[timerType] }

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
    currentSettings.time = { ...defaultSettings[timerType].time }
    currentSettings.isPlaying = defaultSettings[timerType].isPlaying

    updateButtons()
    updateDisplayTimer()
    clearInterval(interval)
    console.log('clear interval')
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

    const percentage = Number(fullCircleLength) * timeToSeconds(currentSettings.time) / timeToSeconds({ ...defaultSettings[timerType].time })
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

  function init () {
    resetTimer()
    updateDisplayTimer()
    interval()
    handlePlayTimer()
    handlePauseTimer()
    handleStopTimer()
  }

  return {
    init,
    reset: resetTimer
  }
}

function TabsApp (workApp, breakApp) {
  const DOM = {
    workTab: document.querySelector('#work-tab'),
    breakTab: document.querySelector('#break-tab')
  }

  function clearAllTabs () {
    DOM.workTab.classList.remove('active')
    DOM.breakTab.classList.remove('active')

    workApp.reset()
    breakApp.reset()
  }

  function handleClickWorkTab () {
    DOM.workTab.addEventListener('click', () => {
      clearAllTabs()
      DOM.workTab.classList.add('active')
    })
  }

  function handleClickBreakTab () {
    DOM.breakTab.addEventListener('click', () => {
      clearAllTabs()
      DOM.breakTab.classList.add('active')
    })
  }

  function init () {
    handleClickWorkTab()
    handleClickBreakTab()
  }

  return {
    init
  }
}

window.addEventListener('load', () => {
  const workApp = TimerApp()
  workApp.init()

  const breakApp = TimerApp('break')

  const tabsApp = TabsApp(workApp, breakApp)
  tabsApp.init()
})
