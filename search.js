//Token for accessing/ using the api
mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9yaHVsdG1hbiIsImEiOiJja3RzZmIxcnkxZm84MnVtcHNlZm5oMnJvIn0.YoorBwfMIiBKtJ7kNaXn3Q';

//Setup of the map on the search page
const map = new mapboxgl.Map({
    container: 'map', //Selecting the div with the id of 'map' as the maps location
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [17.936536, 59.224263], // starting position
    zoom: 12
})

//The setup and functionality of the geocoders/ searchfields
let geocoderStart = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: true,
    placeholder: "From",
    flyTo: true,
    mapboxgl: mapboxgl
});

geocoderStart.on('result', ({ result }) => {
    if (posMarker != undefined) {
        posMarker.remove()
        posMarker = undefined
    }
    console.log(result.center);
});

let geocoderEnd = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: true,
    placeholder: "To",
    flyTo: true,
    mapboxgl: mapboxgl
});

//Here I append the geocoders above to my div elements in order to place the geocoders outside of the map/ in a custom location
document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));
document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));

const posbtn = document.getElementById('my-pos-icon');

//Eventlistener for the "my position" button
posbtn.addEventListener("click", function () {
    //The code ask the user if it can use their location, if yes then the "sucessLocation" func will run
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true
    });
})

let posMarker
let startCoords = []
let fromInput = document.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0];
let fromClearBtn = document.getElementsByClassName("mapboxgl-ctrl-geocoder--button")[0];

//Adding event for clear button
fromClearBtn.addEventListener('click', function () {
    if(posMarker != undefined)
    //Removes the "my position" marker
    posMarker.remove()
    posMarker = undefined
})

//If the user allow the program to use their location, this function runs
function successLocation(position) {
    //Checks if a starting position marker exist
    if (posMarker == undefined && geocoderStart.mapMarker == null) {
        //Saves the users position as the starting coordinates and adds them to a variable
        startCoords = [position.coords.longitude, position.coords.latitude]
        // checkboxStart.checked = true
        console.log(startCoords)
        //Creates a new marker and places it on the map with the users position
        posMarker = new mapboxgl.Marker()
            .setLngLat(startCoords)
            .addTo(map);
        //The map then centers on the users position
        map.flyTo({
            center: startCoords,
            zoom: 12,
            bearing: 0
        })
        //Sets the value of the "from inputfield" to the users coords to show it worked
        fromInput.value = `${startCoords[1]}, ${startCoords[0]}`
        //The "X" button in the field is displayed to able the user to remove the value of the field
        fromClearBtn.style = 'display: block;'

        //The else statement does the same as the above one, exept it also removes the previous "starting" marker from the map first
    } else if (posMarker != undefined) {
        posMarker.remove()
        posMarker = undefined

        startCoords = [position.coords.longitude, position.coords.latitude]
        // checkboxStart.checked = true
        console.log(startCoords)

        posMarker = new mapboxgl.Marker()
            .setLngLat(startCoords)
            .addTo(map);

        map.flyTo({
            center: startCoords,
            zoom: 12,
            bearing: 0
        })

        fromInput.value = `${startCoords[1]}, ${startCoords[0]}`
        fromClearBtn.style = 'display: block;'

        //Lastly, does the same as the above statements, exept removes the marker that the geocoder creates
    } else {
        //Targets and removes the marker that the "start" geocoder created
        geocoderStart.mapMarker.remove()

        startCoords = [position.coords.longitude, position.coords.latitude]
        // checkboxStart.checked = true
        console.log(startCoords)

        posMarker = new mapboxgl.Marker()
            .setLngLat(startCoords)
            .addTo(map);

        map.flyTo({
            center: startCoords,
            zoom: 12,
            bearing: 0
        })

        fromInput.value = `${startCoords[1]}, ${startCoords[0]}`
        fromClearBtn.style = 'display: block;'
    }
}

function errorLocation() {
    return
}

//Targeting some elements
const startGeo = document.getElementById('geocoder-start')
const endGeo = document.getElementById('geocoder-end')

//Specific targeting for the elements that the geocoders produce after loading the page
const startInput = startGeo.getElementsByTagName('input')[0];
const startSugg = startGeo.getElementsByTagName('ul')[0];

//Function for hiding the second geocoder/searchfield because it overlapped the "suggestions" from the first searchfield
startInput.addEventListener('input', function () {
    //A setTimeout for timing with the api "fetching" of the suggestions
    setTimeout(function () {
        if (startSugg.getAttribute("style") == 'display: block;') {
            endGeo.classList.add('hide')
            console.log("now the suggestions show")
        } else {
            endGeo.classList.remove('hide')
            console.log("now the suggestions are hidden")
        }
    }, 250)
})

//Function to "unhide" the second searchfield when a suggestion is picked
startInput.addEventListener("blur", function () {
    //SetTimeout for timing
    setTimeout(function () {
        endGeo.classList.remove('hide')
    }, 80)

})



//Targeting elements
const åkNuBtn = document.getElementById('åk-nu')
const avgångBtn = document.getElementById('avgång')
const ankomstBtn = document.getElementById('ankomst')

function toFilter() {
    location.href = 'filter.html'
}

//The following eventListeners are for toggeling a specific css style between 3 buttons (only 1 should be "active")
åkNuBtn.addEventListener("click", function () {
    if (avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if (åkNuBtn.classList.contains('btn-pressed')) {
        return
    }
})

avgångBtn.addEventListener("click", function () {
    if (åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        avgångBtn.classList.toggle('btn-pressed')

    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if (avgångBtn.classList.contains('btn-pressed')) {
        return
    }
})

ankomstBtn.addEventListener("click", function () {
    if (åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')

    } else if (avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')

    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        return
    }
})