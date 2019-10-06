
function sleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }

const SerialPort = require('serialport')


const port = new SerialPort('COM4', {
    baudRate: 9600, 
    dataBits: 8,
    stopBits: 1 
});



setInterval(() => {
    
    port.write([0xAE])

    
    
    port.write([0x82, 0xF0]) //fiamma
    sleep(500); 

    port.write([0x72, 0xF1]) //campo magnetico
    sleep(300);

    port.write([0xBE, 0xF2, 0x6E, 0xF3]); //temperatura e umidità
    sleep(300);

    port.write([0xAA, 0xF4])//vibrazione
    sleep(300);

    port.write([0x96, 0xF5]) //oggetti in movimento
    sleep(300);

    port.write([0xB5, 0xF6]) //Luminosità
    sleep(300);

    port.write([0x6F, 0xF7]) //gas
    sleep(300);

    port.write([0xA1, 0xF8]) //distanza avanti
    sleep(300);

    port.write([0xA3, 0xF9]) //distanza DX
    sleep(300);

    port.write([0xA2, 0xFA]) //distanza SX
    sleep(300);

    port.write([0xB4, 0xFB]) //livello acqua
    

}, 1000);