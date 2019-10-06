
JustGage.prototype.destroy = function () {
    document.getElementById(this.config.id).innerHTML = "";     
}
const socket = io('localhost:3000')
var gauges = {}    
var state ={};
loadGauges();




socket.on('status', (status) => {
    
    this.gauges.temp.refresh(status.temp);
    state = status;
    console.log(state)
})

window.onresize = () => {
    destroyGauges()
    loadGauges()
};


function destroyGauges(){
    gauges.temp.destroy()
    gauges.humidity.destroy()
    gauges.magnfl.destroy()
}

function loadGauges(){
    gauges.temp = new JustGage({
        id: "tempGage",
        value: state.temp || 50,
        min: 0,
        max: 255,
        title: "Temperatura",
        label: "°C"
      });
    
    
    gauges.humidity = new JustGage({
        id: "humidityGage",
        value: state.humidity || 50,
        min: 0,
        max: 255,
        title: "Umidità"
    });
    
    gauges.magnfl = new JustGage({
        id: "magnflGage",
        value: state.magnfld || 50,
        min: 0,
        max: 255,
        title: "Campo magnetico"
    });
}

    