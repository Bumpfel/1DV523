const calendarOkStatus = 'ok'

const calendarDays = new Map()
calendarDays.set('Friday', '05')
calendarDays.set('Saturday', '06')
calendarDays.set('Sunday', '07')

const restaurantDays = new Map()
restaurantDays.set('fri', '05')
restaurantDays.set('sat', '06')
restaurantDays.set('sun', '07')

class CrossChecker {
  /**
   * @param {Scraper} scraper
   */
  constructor (scraper) {
    this._scraper = scraper
  }

  /**
   * The main method.
   * @returns an array of objects containing data from the cinema and from the restaurant
  */
  getRecommendations () {
    const availableDays = this._getAvailableDays()
    this._checkAvailability(availableDays) // check that the friends have at least one common day they can meet

    const possibleShowtimes = this._getPossibleShowtimes(availableDays)
    this._checkAvailability(possibleShowtimes)

    return this._getRecommendations(possibleShowtimes)
  }

  /**
   * @returns {Set<string>} days when all are available
   */
  _getAvailableDays () {
    const availableDays = new Set(calendarDays.keys())

    // remove days when anyone is unavailable
    for (let i = 0; i < this._scraper.data.calendars.length; i++) {
      for (const dataObj of this._scraper.data.calendars[i]) {
        if (dataObj.status.toLowerCase() !== calendarOkStatus) {
          availableDays.delete(dataObj.day)
        }
      }
    }
    return availableDays
  }

  /**
   * @param {Set<string>} availableDays
   */
  _getPossibleShowtimes (availableDays) {
    // converts available days to the numeric format the cinema uses
    this._availableDaysNumeric = new Set()
    for (const day of availableDays) {
      this._availableDaysNumeric.add(calendarDays.get(day))
    }

    // adds all showtimes during the available days
    const possibleShowtimes = this._scraper.data.availableShowtimes.filter(showtime => {
      return this._availableDaysNumeric.has(showtime.day)
    })
    return possibleShowtimes
  }

  /**
   * @param {Arary} possibleShowtimes
   */
  _getRecommendations (possibleShowtimes) {
    let possibleDinnerReservations = this._parseDinnerReservationData()
    possibleDinnerReservations = possibleDinnerReservations.filter(dinnerRes => this._availableDaysNumeric.has(restaurantDays.get(dinnerRes.day)))

    const recommendations = []
    for (const showtime of possibleShowtimes) {
      for (const dinnerRes of possibleDinnerReservations) {
        if (restaurantDays.get(dinnerRes.day) !== showtime.day) {
          continue
        }
        const showtimeInt = (parseInt(showtime.time.substring(0, 2)) + parseInt(showtime.time.substring(3)) * 0.0167).toFixed(2)
        if (showtimeInt + 2 <= dinnerRes.from) {
          recommendations.push({ showtime, dinnerRes })
        }
      }
    }

    return recommendations
  }

  _parseDinnerReservationData () {
    const possibleReservations = []
    for (const dinnerRes of this._scraper.data.availableDinnerReservations) {
      possibleReservations.push({
        day: dinnerRes.substring(0, 3),
        from: parseInt(dinnerRes.substring(3, 5)),
        to: parseInt(dinnerRes.substring(5))
      })
    }
    return possibleReservations
  }

  /**
   * Kills the process when combined data is empty
   * @param {Array} dataArr
   */
  _checkAvailability (dataArr) {
    if (dataArr.length === 0) {
      console.log('There are no available opportunities for the friends to meet this week')
      process.exit()
    }
  }
}

module.exports = {
  CrossChecker
}
