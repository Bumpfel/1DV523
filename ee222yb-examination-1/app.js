const { Scraper } = require('./lib/data-collector')
const { CrossChecker } = require('./lib/data-combiner')

function formatRecommendations (scraper, recommendations) {
  const recommendationsStringArr = []
  for (const recommendation of recommendations) {
    recommendationsStringArr.push(
      'On ' + scraper.cinema.days.get(recommendation.showtime.day) +
      ' the movie "' + scraper.cinema.movies.get(recommendation.showtime.movie) + '" starts at ' + recommendation.showtime.time +
      ' and there is a free table between ' + recommendation.dinnerRes.from + ':00-' + recommendation.dinnerRes.to + ':00.'
    )
  }
  return recommendationsStringArr
}

async function analyze () {
  let scraper

  if (process.argv.length === 3) {
    scraper = new Scraper(process.argv[2])
  } else if (process.argv.length === 2) {
    scraper = new Scraper('http://vhost3.lnu.se:20080/weekend')
  } else {
    console.log('invalid arguments given')
    process.exit()
  }
  await scraper.collect()

  const combiner = new CrossChecker(scraper)
  const recommendations = combiner.getRecommendations()
  const formattedRecommendations = formatRecommendations(scraper, recommendations)

  console.log()
  console.log('Recommendations')
  console.log('===============')
  if (recommendations.length > 0) {
    for (const recommendation of formattedRecommendations) {
      console.log('* ' + recommendation)
    }
  } else {
    console.log('Unfortunately there are no combinations that fit this weekend')
  }
}

analyze()
