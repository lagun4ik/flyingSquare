var
  io = require('socket.io'),
  debug = require('debug')('gameManager');

module.exports = function (http, game) {
  io = io(http);

  io.on('connection', function (socket) {
    debug('connection');

    debug('res.playerConnected');
    socket.emit('playerConnected', game.addPlayer(socket.id));
    debug('res.getAllPlayers');
    io.emit('getAllPlayers', game.players);

    socket.on('playerStart', function (id) {
      debug('req.playerStart');
      if (game.start(id)) {
        game.createEventLoop(
          function () {
            debug('res.getPosition');
            io.emit('getCondition');
          }
        );
        debug('res.start');
        io.emit('start', 'start');
      }
    });

    socket.on('condition', function (condition) {
      debug('req.condition');
      debug('res.condition %o', condition);
      io.emit('condition',condition);
    });

    socket.on('started', function () {
      debug('req.started');
      game.started();
      debug('res.getAllPlayers');
      io.emit('getAllPlayers', game.players);
    });

    socket.on('playerEnd', function (id) {
      game.playerEnd(id);
    });

    socket.on('die', function (player) {
      debug('res.die');
      debug('req.die');
      io.emit('die', player);
    });

    socket.on('getMap', function (height) {
      debug('res.getMap');
      debug('req.getMap');
      io.emit('getMap', game.getMap(height));
    });


    socket.on('disconnect', function () {
      debug('res.disconnect');
      game.delPlayer(socket.id);
      debug('req.getAllPlayers');
      io.emit('getAllPlayers', game.players);
    });
  });
};