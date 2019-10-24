//made by Riccardo Bracciale


const config = require('./config');

const SerialPort = require('serialport')
const MyParser = require('./lib/myParser')
const express = require('express')

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));



http.listen(config.port, () => console.log('listening on port ' + config.port))




const serialPort = new SerialPort(config.serialPort, {
    baudRate: 9600, 
    dataBits: 8,
    stopBits: 1 
});

let authenticatedSockets = {}

serialPort.on('open', () => {
    serialPort.flush()
    io.on('connection', (socket) => {
        //TODO: fare sistema autenticazione

        console.log('utente connesso')
        authenticatedSockets[socket.id] = socket


        socket.on('sendinput', (msg) => {
            let nmb = parseInt(msg);
            console.log('Sent ' + nmb + ' to the serial port')
            serialPort.write([nmb])
        }) 

        socket.on('disconnect', () => {
            console.log('utente disconnesso')
            delete authenticatedSockets[socket.id]
        })
    })


   
})



const parser = serialPort.pipe(new MyParser({length: 2, start: 0xAE}))


let status = {dist: {}};


parser.on('data', (data) => {
    console.log(data);
    for(let i = 0; i < data.length; i++){
        
        switch(data[i]){
            case 0xAE:{
                for(let socketid in authenticatedSockets){
                    authenticatedSockets[socketid].emit('status', status)
                }

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
                
                status.shock = data[i];

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


