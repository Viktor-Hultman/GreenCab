//Token for accessing/ using the api
mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9yaHVsdG1hbiIsImEiOiJja3RzZmIxcnkxZm84MnVtcHNlZm5oMnJvIn0.YoorBwfMIiBKtJ7kNaXn3Q';

let startCoords = JSON.parse(localStorage.getItem("start"));
let endCoords = JSON.parse(localStorage.getItem("end"));
let centerOfTrip
let tripDuration
// let tripDistance = Number(localStorage.getItem("tripDistance"))
let mapZoom = Number(localStorage.getItem("mapZoom"))

//Function for calculating the center point of start and end coords
function centerMap(startLong, startLat, endLong, endLat) {
    let long = (startLong + endLong) / 2;
    let lat = (startLat + endLat) / 2;
    centerOfTrip = [long, lat]
}

centerMap(startCoords[0], startCoords[1], endCoords[0], endCoords[1])

//Setup of the map on the cars page
const map = new mapboxgl.Map({
    container: 'cart-window', //Selecting the div with the id of 'map' as the maps location
    style: 'mapbox://styles/mapbox/streets-v11',
    center: centerOfTrip, // starting position
    zoom: mapZoom
})

let startMarker = new mapboxgl.Marker({
    color: "#4D8C2D"
})
    .setLngLat(startCoords)
    .addTo(map);

let endMarker = new mapboxgl.Marker({
    color: "red"
})
    .setLngLat(endCoords)
    .addTo(map);

setTimeout(() => {
    getRoute();
}, 100)

map.scrollZoom.disable();

//This async function is for getting the route for the trip and then placing it as a layer on the map
async function getRoute() {
    //Using a fetch-request for the directions for the start and end coordinates 
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );

    const json = await query.json();
    const data = json.routes[0];
    //The 2 consts below are used for being able to "draw" the route on the map
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }
}

let chosenCar = JSON.parse(localStorage.getItem("chosenCar"));

let carImg = document.getElementById("selectedCarImg");
carImg.src = chosenCar.img

let carTitle = document.getElementById("chosenCarTitle");
carTitle.innerText = chosenCar.title;

let userFilter = JSON.parse(localStorage.getItem("filter"));
let chosenFilterUl = document.getElementById("chosenFilter");

for (const key in userFilter) {
    if(userFilter[key] == true) {

        let filterItem = document.createElement("li");
        filterItem.classList.add("chosenFilterItem")
        let para = document.createElement("p")
        let filterText = key.charAt(0).toUpperCase() + key.slice(1);

        if(key == "djurvänligBil") {
            para.innerText = "Djurvänlig bil"
        } else if (key == "stortBagage") {
            para.innerText = "Stort bagage"
        } else {
            para.innerText = filterText
        }
        
        filterItem.appendChild(para)
        chosenFilterUl.appendChild(filterItem)
    }
}

let discount = Math.round(chosenCar.price * 0.1)

let costCalcDiv = document.getElementById("cost-calc");
let travelCost = document.createElement("p");
travelCost.innerText = `Resa: ${chosenCar.price} kr` 

let discountPrice = document.createElement("p");
discountPrice.innerText = `-${discount} kr` 

let totalPrice = document.createElement("p");
totalPrice.innerText = `Total kostnad: ${chosenCar.price - discount} kr`


costCalcDiv.appendChild(travelCost)
costCalcDiv.appendChild(discountPrice)
costCalcDiv.appendChild(totalPrice)

function toReservation() {
    location.href = 'reservation.html'
}
