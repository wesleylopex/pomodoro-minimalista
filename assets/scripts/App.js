const vue = new Vue({
  el: '#app',
  data: {
    tasks: [],
    allowedTimers: [
      {
        slug: 'work',
        title: 'Trabalho',
        minutes: 25,
        seconds: 0
      },
      {
        slug: 'break',
        title: 'Descanso',
        minutes: 5,
        seconds: 0
      }
    ],
    activeTimer: 'work',
    timer: {
      work: {
        isPlaying: false,
        minutes: 25,
        seconds: 0,
        interval: (callback) => setInterval(callback, 1000)
      },
      break: {
        isPlaying: false,
        minutes: 25,
        seconds: 0,
        interval: (callback) => setInterval(callback, 1000)
      }
    },
    circle: {
      strokeDashArray: 741
    },
    defaultPageTitle: 'Pomodoro Timer Online - Técnica / Método Pomodoro - Pomodoro Minimalista'
  },
  created () {
    this.runIntervals()
    this.askForNotification()
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
  },
  watch: {
    tasks: {
      deep: true,
      handler (tasks) {
        this.$nextTick(() => {
          localStorage.setItem('tasks', JSON.stringify(tasks))
        })
      }
    },
    currentTime (currentTime) {
      this.setPageTitle(currentTime)
    }
  },
  methods: {
    setPageTitle (currentTime) {
      const timer = this.timer[this.activeTimer]
      const message = this.activeTimer === 'work' ? 'Hora de trabalhar' : 'Tempo para descanso'

      if (timer.isPlaying) {
        document.title = `${currentTime} - ${message}`
      } else {
        document.title = this.defaultPageTitle
      }
    },
    createTask () {
      this.tasks.push({ title: '', isDone: false })
      this.setFocusOnLastTask()
    },
    deleteTaskIfEmpty (index, event) {
      const task = this.tasks[index]

      if (!task) return

      if (!task.title) {
        if (event) event.preventDefault()
        this.deleteTask(index)
        this.setFocusOnLastTask()
      }
    },
    deleteTask (index) {
      this.tasks.splice(index, 1)
    },
    setFocusOnLastTask () {
      if (!this.tasks.length) return

      const ref = this.tasks.length - 1

      this.$nextTick(() => {
        const [input] = this.$refs[`index-${ref}`]
        input.focus()
      })
    },
    runIntervals () {
      for (const allowedTimer of this.allowedTimers) {
        const timer = this.timer[allowedTimer.slug]

        timer.interval(() => {
          if (!timer.isPlaying) return false

          timer.seconds -= 1

          if (timer.seconds < 0) {
            timer.seconds = 59
            timer.minutes -= 1
          }

          if (timer.minutes < 0) {
            this.stop()
            this.toggleActiveTimer()
            this.notify()
          }
        })
      }
    },
    play () {
      this.timer[this.activeTimer].isPlaying = true
    },
    pause () {
      this.timer[this.activeTimer].isPlaying = false
    },
    stop () {
      clearInterval(this.timer[this.activeTimer].interval)

      const timer = this.allowedTimers.find(t => t.slug === this.activeTimer)

      this.timer[this.activeTimer].isPlaying = false,
      this.timer[this.activeTimer].minutes = timer.minutes
      this.timer[this.activeTimer].seconds = timer.seconds
    },
    toggleActiveTimer () {
      this.activeTimer = this.activeTimer === 'work' ? 'break' : 'work'
    },
    timeToSeconds (time) {
      return (Number(time.minutes) * 60) + Number(time.seconds)
    },
    askForNotification () {
      if (!('Notification' in window)) {
        return false
      }

      if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    },
    notify () {
      if (!('Notification' in window)) {
        return false
      }

      const notificationMessage = this.activeTimer === 'work' ? 'Hora de voltar ao trabalho' : 'Tempo para descansar'

      if (Notification.permission === 'granted') {
        const notification = new Notification(notificationMessage)
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            const notification = new Notification(notificationMessage)
          }
        })
      }
    }
  },
  computed: {
    currentTime () {
      const timerSeconds = this.timer[this.activeTimer].seconds
      const timerMinutes = this.timer[this.activeTimer].minutes

      const seconds = timerSeconds >= 10 ? timerSeconds : `0${timerSeconds}`
      const minutes = timerMinutes >= 10 ? timerMinutes : `0${timerMinutes}`

      return `${minutes}:${seconds}`
    },
    strokeDashOffset () {
      const currentTime = {
        minutes: this.timer[this.activeTimer].minutes,
        seconds: this.timer[this.activeTimer].seconds
      }

      const currentTimer = this.allowedTimers.find(t => t.slug === this.activeTimer)

      const defaultTime = {
        minutes: currentTimer.minutes,
        seconds: currentTimer.seconds
      }

      const percentage = Number(this.circle.strokeDashArray) * this.timeToSeconds(currentTime) / this.timeToSeconds(defaultTime)

      return percentage
    }
  }
})
