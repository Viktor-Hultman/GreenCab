//Token for accessing/ using the api
mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9yaHVsdG1hbiIsImEiOiJja3RzZmIxcnkxZm84MnVtcHNlZm5oMnJvIn0.YoorBwfMIiBKtJ7kNaXn3Q';

let tripDistance = localStorage.getItem("tripDistance")

//All the cars that are offered
let cars = [
    standard = {
        title: "Standard",
        price: Math.round(120 + (8.5 * tripDistance)) ,
        description: "Vårt standardalternativ med 100% garanti att få en elbil för din resa. Max 4 passagerere.",
        img: "imgs/standardCar.png",
        djurvänligBil: true,
        handikappanpassad: false,
        stortBagage: false,
        bälteskudde: true,
        bilbarnstol: true
    },
    XL = {
        title: "XL",
        price: Math.round(160 + (13 * tripDistance)),
        description: "En större miljövänlig bil med plats för max 7 passagerare.",
        img: "imgs/xlCar.png",
        djurvänligBil: true,
        handikappanpassad: true,
        stortBagage: true,
        bälteskudde: true,
        bilbarnstol: true
    },
    guld = {
        title: "Guld",
        price: Math.round(230 + (18 * tripDistance)),
        description: "Ett lite lyxigare alternativ för den som vill resa med stil. Max 4 passagerare.",
        img: "imgs/goldCar.png",
        djurvänligBil: false,
        handikappanpassad: false,
        stortBagage: false,
        bälteskudde: true,
        bilbarnstol: false
    },
    allergi = {
        title: "Allergi",
        price: Math.round(170 + (8.5 * tripDistance)),
        description: "För dig som har allergi för pälsdjur, 100% pälsfritt fordon. Max 4 passagerare.",
        img: "imgs/allergyCar.png",
        djurvänligBil: false,
        handikappanpassad: false,
        stortBagage: false,
        bälteskudde: true,
        bilbarnstol: true
    }

];

let userTillval = JSON.parse(localStorage.getItem("filter"));

let removedCars

function filterCars() {
    let tillval = []
    for (const [key, value] of Object.entries(userTillval)) {
        tillval.push(`${key}: ${value}`)
    }

    if (tillval.includes('djurvänligBil: true')) {
        //Removes the "Guld" and "Allegi" cars
        removedCars = cars.splice(2, 2)
    }

    if (tillval.includes('handikappanpassad: true')) {
        if (cars.length == 2) {
            //If only the "standard" and "XL" cars remain, only remove the first car which is the "standard"
            removedCars = cars.splice(0, 1);
        } else {
            //If all cars remain, remove the first car which is the "standard", then the 2 other at the end
            removedCars = cars.splice(0, 1)
            removedCars = cars.splice(1, 2)
        }
    }

    if (tillval.includes('stortBagage: true')) {
        if (cars.length > 1) {
            //If all cars remain, remove the first car which is the "standard", then the 2 other at the end
            removedCars = cars.splice(0, 1)
            removedCars = cars.splice(1, 2)
        } else {
            //Nothing needs to be done if only the xl car remains
            return
        }
    }

    if (tillval.includes('bilbarnstol: true')) {
        if (cars.includes(guld)) {
            removedCars = cars.splice(2, 1)
        } else {
            //Nothing needs to be done if the Guld car does not remain
            return
        }
    }

    //Any car should be able to have bälteskudde, so no code if to remove it from the list
}

//Runs the filterCars code to filter out the cars that do not fit with the users "tillval"/options
filterCars()

function createFilteredCarsList() {

    let carList = document.createElement("ul");
    carList.id = "car-list";

    for (const val of cars) {

        let carItem = document.createElement("li");
        let carTitle = document.createElement("h2")
        let carDesc = document.createElement("p")
        let carIconDiv = document.createElement("div")
        let carIcon = document.createElement("img")
        let textDiv = document.createElement("div")
        let priceDiv = document.createElement("div")
        let carPrice = document.createElement("h2")

        carItem.classList.add("car-list-item")
        carIconDiv.classList.add("car-list-item-img-div")
        carIcon.classList.add("car-list-item-img")
        textDiv.classList.add("car-list-item-text")
        priceDiv.classList.add("car-list-item-price")

        carItem.id = `${val.title}`;
        carTitle.innerText = `${val.title}`;
        carDesc.innerText = `${val.description}`;
        carPrice.innerText = `${val.price} kr`;
        carIcon.src = `${val.img}`;

        carIconDiv.appendChild(carIcon)
        priceDiv.appendChild(carPrice);
        textDiv.appendChild(carTitle);
        textDiv.appendChild(carDesc);
        carItem.appendChild(carIconDiv);
        carItem.appendChild(textDiv);
        carItem.appendChild(priceDiv);
        carList.appendChild(carItem);
    }
    //And finaly appends the select to the "date-select" div/container 
    document.getElementById("filtered-cars").appendChild(carList);
}

let chosenCar = null

createFilteredCarsList()

let carOptions = document.querySelectorAll(".car-list-item")

let bookingButton = document.getElementById("to-cart-btn");

carOptions.forEach(item => {
    item.addEventListener('click', evt => {
        if (item.classList.contains("clicked-car")) {
            item.classList.toggle("clicked-car");
            chosenCar = null
            bookingButton.classList.add("greyOut-btn")
        } else {
            carOptions.forEach(item => {
                if (item.classList.contains("clicked-car")) {
                    item.classList.toggle("clicked-car")
                }
            })
            item.classList.add("clicked-car")
            bookingButton.classList.remove("greyOut-btn")
            chosenCar = item.id
        }
    })
})


let startCoords = JSON.parse(localStorage.getItem("start"));
let endCoords = JSON.parse(localStorage.getItem("end"));
let centerOfTrip
let tripDuration
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
    container: 'carMap', //Selecting the div with the id of 'map' as the maps location
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

//The html element with the id of 'instructions' is allready targeted by the mapbox program
instructions.classList.remove("invisible");

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

    //Setting the duration and distanse of the trip to global variables
    tripDuration = Math.round(data.duration / 60)
    if (tripDuration > 60) {
        let totalMins = tripDuration
        let hours
        let mins

        hours = Math.floor(tripDuration / 60)
        mins = totalMins - (hours * 60)
        console.log(totalMins)
        console.log(hours)
        console.log(mins)

        //Adding the trip duration to the instructions div
        instructions.innerHTML = `<h4>${hours} tim ${mins} min</h4>`;
    } else {
        //Adding the trip duration to the instructions div
        instructions.innerHTML = `<h4>${Math.round(
            tripDuration
        )} min</h4>`;
    }
}


function toCart() {
    if (chosenCar != null) {
        if (chosenCar == "Standard") {
            localStorage.setItem("chosenCar", JSON.stringify(standard))
            
        } else if (chosenCar == "XL") {
            localStorage.setItem("chosenCar", JSON.stringify(XL))
            
        } else if (chosenCar == "Guld") {
            localStorage.setItem("chosenCar", JSON.stringify(guld))
            
        } else if (chosenCar == "Allergi") {
            localStorage.setItem("chosenCar", JSON.stringify(allergi))  
        }
        location.href = 'cart.html'
    } else {
        alert("Please choose a car to continue.")
    }
}