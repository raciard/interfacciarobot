



JustGage.prototype.destroy = function () {
    document.getElementById(this.config.id).innerHTML = "";     
}


const socket = io()
var gauges = {}    
var state = {}; 
loadGauges();

socket.on('error', (error) => {
    document.getElementById('error').innerText = "Errore: " + error 
})


socket.on('status', (state) => {
    this.state = state;



    this.gauges.temp.refresh(state.temp);
    this.gauges.humidity.refresh(state.humidity);
    this.gauges.magnfld.refresh(state.magnfld);
    this.gauges.temp.refresh(state.temp);
    this.gauges.light.refresh(state.light);
    
    document.getElementById('up-dist').innerText = state.dist.up
    document.getElementById('left-dist').innerText = state.dist.left
    document.getElementById('right-dist').innerText = state.dist.right

    if(state.flame == 0xFF){
        activateLed('led-flame')
    }
    if(state.gas == 0xFF){
        activateLed('led-gas')
    }
    if(state.shock == 0xFF){
        activateLed('led-shock')
    }

    if(state.flame == 0){
        deactivateLed('led-flame')
    }
    if(state.gas == 0){
        deactivateLed('led-gas')
    }
    if(state.shock == 0){
        deactivateLed('led-shock')
    }

})

window.onresize = () => {
    destroyGauges()
    loadGauges()
};


function destroyGauges(){
    gauges.temp.destroy()
    gauges.humidity.destroy()
    gauges.magnfld.destroy()
    gauges.light.destroy()
}

function loadGauges(){
    gauges.temp = new JustGage({
        id: "tempGage",
        value: state.temp || 0,
        min: 0,
        max: 255,
        title: "Temperatura",
        label: "°C"
      });
    
    
    gauges.humidity = new JustGage({
        id: "humidityGage",
        value: state.humidity || 0,
        min: 0,
        max: 255,
        title: "Umidità"
    });
    
    gauges.magnfld = new JustGage({
        id: "magnfldGage",
        value: state.magnfld || 0,
        min: 0,
        max: 255,
        title: "Campo magnetico"
    });

    gauges.light = new JustGage({
        id: "lightGage",
        value: state.light || 0,
        min: 0,
        max: 255,
        title: "Luminosità"
    });


    
}
    
function activateLed(id){
    document.getElementById(id).classList.add('led-active')
}

function deactivateLed(id){
    document.getElementById(id).classList.remove('led-active')
}




document.getElementById('sendButton').addEventListener('click', () => {
    socket.emit('sendinput', document.getElementById('serialOutput').value)
})