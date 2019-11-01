#!/usr/bin/env node
/**
 * Module dependencies.
 */

import app from '../app'
import Debug from 'debug'
import * as http from 'http'
import config from '../config'

const debug = Debug('demo:server')
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || config.serve.port + '' || '3000')
// app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback())

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, (): void => {
  console.log(`server listen at localhost:${port}`)
})
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | boolean {
  const res = parseInt(val, 10)

  if (isNaN(res)) {
    // named pipe
    return false
  }

  if (res >= 0) {
    // port number
    return res
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
