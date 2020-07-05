const fetch = require('node-fetch')
const request = require('request')
const { JSDOM } = require('jsdom')

const restaurantUsername = 'zeke'
const restaurantPassword = 'coys'

class Scraper {
  constructor (url) {
    this._url = url
  }

  async collect () {
    // Collect links from initial url
    const websiteLinks = await this._scrapeLinks(this._url)
    console.log('Scraping links....OK')
    for (const link of websiteLinks) {
      if (this._isLinkTo(link, 'calendar')) {
        var calendarUrl = link.href
      } else if (this._isLinkTo(link, 'cinema')) {
        var cinemaUrl = link.href
      }
      if (this._isLinkTo(link, 'restaurant')) {
        var restaurantUrl = link.href
      }
    }
    // Start collecting all data
    const calendars = await this._scrapeCalendars(calendarUrl)
    const availableShowtimes = await this._scrapeAvailableShowtimes(cinemaUrl)
    const availableDinnerReservations = await this._scrapeRestaurant(restaurantUrl)

    this.data = {
      get calendars () {
        return calendars
      },
      get availableShowtimes () {
        return availableShowtimes
      },
      get availableDinnerReservations () {
        return availableDinnerReservations
      }
    }

    // await Promise.all([this.calendars, this.availableShowtimes, this.availableDinnerReservations])
  }

  _isLinkTo (link, searchPhrase) {
    return link.text.search(new RegExp(searchPhrase, 'i')) > -1
  }

  /**
   * Returns traversable document
   * @param {string} url
   */
  async _parseDOM (url) {
    const response = await fetch(url)
    const doc = new JSDOM(await response.text()).window.document
    return doc
  }

  async _scrapeLinks (url) {
    const siteDOM = await this._parseDOM(url)
    return siteDOM.querySelectorAll('a')
  }

  /**
   * Scrapes all calendars found at url
   * @param {string} url to main calendar page
   */
  async _scrapeCalendars (url) {
    const calendars = []

    const personalCalendarLinks = await this._scrapeLinks(url)
    for (const personalCalendarLink of personalCalendarLinks) {
      const calendar = await this._scrapePersonalCalendar(url + personalCalendarLink.href)
      calendars.push(calendar)
    }
    console.log('Scraping calendars...OK')
    return calendars
  }

  /**
   * Scrapes one persons calendar
   * Returns as an array of objects
   * @param {string} url to persons calendar
   */
  async _scrapePersonalCalendar (url) {
    const personalCalendar = []
    const calendarDOM = await this._parseDOM(url)

    const headers = calendarDOM.querySelectorAll('th')
    const data = calendarDOM.querySelectorAll('td')

    const headerContent = headers.values()
    const dataContent = data.values()

    for (let i = 0; i < headers.length; i++) {
      const obj = { day: headerContent.next().value.textContent, status: dataContent.next().value.textContent }
      personalCalendar.push(obj)
    }
    return personalCalendar
  }

  /**
   * Scrapes showtimes from cinema that still has tickets left
   * Maps cinema movies and days with an id
   * @param {string} url
   */
  async _scrapeAvailableShowtimes (url) {
    const cinemaDOM = await this._parseDOM(url)

    // map cinema format for days and movies and make it globally available through property
    const movies = this._mapDropdownContent(cinemaDOM.querySelector('select#movie'))
    const cinemaDays = this._mapDropdownContent(cinemaDOM.querySelector('select#day'))
    this.cinema = {
      get movies () {
        return movies
      },
      get days () {
        return cinemaDays
      }
    }

    const availableShowtimes = []
    for (const day of cinemaDays.keys()) {
      // get all showtimes during the available days
      for (const movie of movies.keys()) {
        const response = await fetch(url + `/check?day=${day}&movie=${movie}`)
        const showtimes = await response.json()
        const filteredShowtimes = showtimes.filter(showtime => showtime.status === 1) // filter out the ones that still has tickets available
        filteredShowtimes.forEach(showtime => availableShowtimes.push(showtime))
      }
    }
    console.log('Scraping showtimes...OK')
    return availableShowtimes
  }

  /**
   * Used by _scrapeShowtimes (cinema)
   * @param {HTMLSelectElement} dropdown
   */
  _mapDropdownContent (dropdown) {
    const map = new Map()
    const options = dropdown.querySelectorAll('option')
    for (let i = 1; i < options.length; i++) {
      map.set(options[i].value, options[i].text)
    }
    return map
  }

  /**
   * Collects data from the restaurant
   * @param {string} url
   */
  async _scrapeRestaurant (url) {
    const data = await this._loginToRestaurant(url)

    const response = await fetch(data.url, {
      headers: { Cookie: data.cookie } // TODO some code duplication. passing cookie header to parseDOM just WON'T work arrrrgh
    })
    const restaurantDOM = new JSDOM(await response.text()).window.document

    const availableDinnerReservations = []
    const radios = restaurantDOM.querySelectorAll('input[type=radio]')
    radios.forEach(radio => availableDinnerReservations.push(radio.value))
    console.log('Scraping available dinner reservations...OK')
    return availableDinnerReservations
  }

  /**
   * Logs in using supplied username and password
   * Returns an object containing the redirect url to use when getting the page, and the session cookie that needs to be used to get the redirect page
   * @param {string} url to the restaurant
   * @returns {object} object containing url and cookie
   */
  async _loginToRestaurant (url) {
    // using request in this method because node-fetch didn't seem to work
    // get form action from login page
    const restDOM = await this._parseDOM(url)
    const formAction = restDOM.querySelector('form').action

    // post login info
    const hostnameCutOff = url.lastIndexOf('/')
    const postUrl = url.substring(0, hostnameCutOff) + formAction
    return new Promise(resolve => {
      request({
        method: 'POST',
        url: postUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          username: restaurantUsername,
          password: restaurantPassword,
          submit: 'login'
        }
      }, (error, response, body) => {
        if (error || response.statusCode !== 302) {
          throw new Error(error || 'bad request')
        }
        const restaurantCookie = response.headers['set-cookie']
        resolve({ url: url + '/' + response.headers.location, cookie: restaurantCookie })
      })
    })
  }
}

module.exports = {
  Scraper
}
