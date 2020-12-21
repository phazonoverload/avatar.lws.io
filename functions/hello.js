exports.handler = async event => {
  try {
    return res({ message: 'ok' })
  } catch (error) {
    return res({ error }, 500)
  }
}

function res(o, statusCode = 200) {
  return { statusCode, body: JSON.stringify(o) }
}
