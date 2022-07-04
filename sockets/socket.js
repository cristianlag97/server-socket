const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand(new Band( 'Breaking Benjamin' ))
bands.addBand(new Band( 'Bon Jovi' ))
bands.addBand(new Band( 'Héroes del Silencio' ))
bands.addBand(new Band( 'Metallica' ))

console.log(bands)


// Mensaje de Sockets
io.on('connection', client => {
  console.log('Cliente conectado')

  client.emit('active-bands', bands.getBands());

  client.on('disconnect', () => {
    console.log('Cliente desconectado')
  });
  client.on('mensaje', ( payload ) => {
    console.log('Mensaje!!!', payload)
    io.emit('mensaje', {payload, admin: 'Nuevo mensaje'})
  });

  // client.on('emitir-mensaje', ( payload ) => {
  //   console.log(payload);
  //   // io.emit('nuevo-mensaje', payload)//esto emite a todos los clientes conectados
  //   client.broadcast.emit('nuevo-mensaje', payload)//esto emite a todos, menos al cliente que lo está emitiendo
  // });

  client.on('vote-band', (payload) => {
    bands.voteband(payload.id);
    io.emit('active-bands', bands.getBands());
  });

  client.on('add-band', (payload) => {
    const newBand = new Band(payload.name)
    console.log(newBand)
    bands.addBand(newBand)
    io.emit('active-bands', bands.getBands());
  });

  client.on('delete-band', (payload) => {
    console.log(payload);
    bands.deleteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  })

});