const SerialPort = require('serialport')
const MyParser = require('./lib/myParser')
const express = require('express')

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

http.listen('3000', () => console.log('listening on port 3000'))




const port = new SerialPort('COM5', {
    baudRate: 9600, 
    dataBits: 8,
    stopBits: 1 
});


port.on('open', () => {
    port.flush()
    io.on('connection', (socket) => {
        socket.on('sendinput', (msg) => {
            console.log('Sent ' + parseInt(msg) + ' to the serial port')
            port.write([parseInt(msg)])
        })  
    })
})



const parser = port.pipe(new MyParser({length: 2, start: 0xAE}))


let status = {dist: {}};


parser.on('data', (data) => {
    for(let i = 0; i < data.length; i++){
        
        switch(data[i]){
            case 0xAE:{
                console.log(status)
                io.sockets.emit('status', status)

                status = {dist: {}}
                


                console.log('sequenza iniziata');
                

                
            }
            break;

            //campo magnetico
            case 0x72:{
                i++;
                
                status.magnfld = data[i];
            }
            break;
            // sensore fiamma
            case 0x82:{
                i++;
                
                status.flame = data[i];
            }
            break;

            // sensore temperatura
            case 0xBE:{
                i++;
                
                status.temp = data[i];

            }
            break;

            // sensore umidità
            case 0x6E:{
                i++;
                
                status.humidity = data[i];

            }
            break;
            // forte vibrazione
            case 0xAA:{
                i++;
                
                status.vibration = data[i];

            }
            break;

            
            //presenza oggetti in movimento
            case 0x96:{
                i++;
                
                status.objects = data[i];

            }
            break;

            //luminosità
            case 0xB5:{
                i++;
                
                status.light = data[i];

            }
            break;


            //presenza gas
            case 0x6F:{
                i++;
                
                status.gas = data[i];

            }
            break;


            //distanza avanti
            case 0xA1:{
                i++;
                
                status.dist.up = data[i];

            }
            break;

            //distanza destra
            case 0xA3:{
                i++;

                status.dist.right = data[i];

                

            }
            break;


            //distanza sinistra
            case 0xA2:{
                i++;
                
                status.dist.left = data[i];

            }
            break;

            //livello acqua
            case 0xB4:{
                i++;
                
                status.water = data[i];

            }
            break;
        }
    }






   















});


