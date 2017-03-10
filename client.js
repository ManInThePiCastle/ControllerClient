var os = require('os');
var ifaces = os.networkInterfaces();

var iface = getInterfaces();

var socket = require('socket.io-client')('https://maninthepicastle.iwa.ecovate.com');
socket.on('connect', function(){
  console.log('Connected to Controller Service');
  socket.emit('arm_connected', iface);
  socket.on('command', function(data){
    console.log('Command Recieved: ' + data);
  });
});

socket.on('disconnect', function(){
  socket.emit('arm_disconnected');
});

function getInterfaces() {

  var result = "";

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        result = result + ifname + ' ' + iface.address + '\n'
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });

  return result;
}