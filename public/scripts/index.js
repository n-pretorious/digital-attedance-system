window.onload = function geoFindMe () {

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById("lat").value = latitude;
        document.getElementById("long").value = longitude;
    
    }
    
    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…'
        navigator.geolocation.getCurrentPosition(success, error);
        
    }
    
}

let handlers = {
    startTime: function() {
        newDate = document.getElementById("time").value = new Date()
    },
    stopTime: function() {
        finalDate = document.getElementById("time").value = new Date()
    }
}

document.querySelector('#find-me').addEventListener('click', geoFindMe);