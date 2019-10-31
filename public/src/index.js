



JustGage.prototype.destroy = function () {
    document.getElementById(this.config.id).innerHTML = "";     
}


const socket = io()
var gauges = {}    
var state = {}; 
loadGauges();

if(localStorage.getItem('jwt') != null){
    authenticate(localStorage.getItem('jwt'))
}
else{
    document.getElementById('id01').style.display = "block"
}

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




function authenticate(jwt){
    socket.emit('authenticate', {token: jwt})
    .on('unauthorized', (msg) => {
        console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
        throw new Error(msg.data.type);
      })
      .on("authenticated", () => {
        document.getElementById('id01').style.display = 'none'
        console.log("authenticated")
      })
}



var modal = document.getElementById('id01');


document.getElementById("login-form").addEventListener('submit', login)

function login(e){
    e.preventDefault
    let userField = document.getElementById('username')
    let pswField = document.getElementById('password')
    
    let body = {
        user: userField.value,
        password: pswField.value
    }

    fetch('/auth', {
        method: 'post',
        headers: {
        "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then((response) => {
        response.json()
        .then((res) => {
            if(res.authenticated == true){
                
                localStorage.setItem('jwt', res.jwt)
                authenticate(res.jwt)

                document.getElementById('id01').style.display = 'none'
            }
        })

    })
    .catch((err) => {
        console.error(err)  
    })
    

}
