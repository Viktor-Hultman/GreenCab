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
    marker: false,
    placeholder: "From",
    flyTo: false,
    mapboxgl: mapboxgl
});

let geocoderEnd = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    placeholder: "To",
    flyTo: false,
    mapboxgl: mapboxgl
});

//Here I append the geocoders above to my div elements in order to place the geocoders outside of the map/ in a custom location
document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));
document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));

//Targeting some elements
const startGeo = document.getElementById('geocoder-start')
const endGeo = document.getElementById('geocoder-end')

//Specific targeting for the elements that the geocoders produce after loading the page
const startInput = startGeo.getElementsByTagName('input')[0];
const startSugg = startGeo.getElementsByTagName('ul')[0];

//Function for hiding the second geocoder/searchfield because it overlapped the "suggestions" from the first searchfield
startInput.addEventListener('input', function () {
    //A setTimeout for timing with the api "fetching" of the suggestions
    setTimeout(function() {
        if(startSugg.getAttribute("style") == 'display: block;') {
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
    setTimeout(function() {
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
    if(avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if(åkNuBtn.classList.contains('btn-pressed')) {
        return
    } 
})

avgångBtn.addEventListener("click", function () {
    if(åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        avgångBtn.classList.toggle('btn-pressed')

    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')

    } else if(avgångBtn.classList.contains('btn-pressed')) {
        return
    }
})

ankomstBtn.addEventListener("click", function () {
    if(åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')

    } else if (avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')

    } else if(ankomstBtn.classList.contains('btn-pressed')) {
        return
    }
})