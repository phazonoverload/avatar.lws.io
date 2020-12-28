const fetch  = require('node-fetch')
const Twitter = require('twitter')
const twitter = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

exports.handler = async event => {
  try {
    if (event.httpMethod == 'OPTIONS') return res({ error }, 204, {'Allow': 'POST'})
    if(event.queryStringParameters.key == process.env.KEY) {
        let gradients = await fetch('https://gitcdn.link/repo/ghosh/uiGradients/master/gradients.json').then(r => r.json())
        let gradient = gradients[Math.floor(Math.random() * gradients.length)].name.toLowerCase().split(' ').join('-').split('&').join('-').split("'").join('')

        const url = `${process.env.URL}/avatars/${gradient}.png`;
        const b64 = await fetch(url).then(r => r.buffer()).then(buf => buf.toString('base64'));
        twitter.post("account/update_profile_image", { image: b64 })
        return res({ message: `Gradient changed to ${gradient}` })
    }
        return res({ message: 'invalid key' }, 401)
  } catch (error) {
    return res({ error }, 500)
  }
}

function res(o, statusCode = 200, extraHeaders) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
  return { statusCode, headers: { ...headers, ...extraHeaders }, body: JSON.stringify(o) }
}
