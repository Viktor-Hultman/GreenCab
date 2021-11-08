

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
    marker: {
        color: "#4D8C2D"
    },
    placeholder: "From",
    flyTo: true,
    mapboxgl: mapboxgl
});

let geocoderEnd = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
        color: "red"
    },
    placeholder: "To",
    flyTo: true,
    mapboxgl: mapboxgl
});

geocoderStart.on('result', ({ result }) => {
    if (posMarker != undefined) {
        posMarker.remove()
        posMarker = undefined
    }
    console.log(result.center);
    startCoords = result.center
    localStorage.setItem("start", JSON.stringify(startCoords))
    //If the endcoords already have been set then the 'getTrip' func can run with both coords
    if(endCoords != null) {
        getTrip();
    }
});

geocoderEnd.on('result', ({ result }) => {
    console.log(result.center);
    endCoords = result.center
    localStorage.setItem("end", JSON.stringify(endCoords))
    //If the startcoords already have been set then the 'getTrip' func can run with both coords
    if(startCoords != null) {
        getTrip();
    }
});

//Here I append the geocoders above to my div elements in order to place the geocoders outside of the map/ in a custom location
document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));
document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));

//Targeting the "my position" button/icon
const posbtn = document.getElementById('my-pos-icon');

//Eventlistener for the "my position" button
posbtn.addEventListener("click", function () {
    //The code ask the user if it can use their location, if yes then the "sucessLocation" func will run
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true
    });
})

let posMarker
let startCoords = null
let endCoords = null
let centerOfTrip = []
let tripDuration
let tripDistance
let mapZoom = 11
const fromInput = document.querySelectorAll(".mapboxgl-ctrl-geocoder--input")[0];
const toInput = document.querySelectorAll(".mapboxgl-ctrl-geocoder--input")[1];
const fromClearBtn = document.querySelectorAll(".mapboxgl-ctrl-geocoder--button")[0];
const toClearBtn = document.querySelectorAll(".mapboxgl-ctrl-geocoder--button")[1];

//Adding event for clear button
fromClearBtn.addEventListener('click', function () {
    if (posMarker != undefined)
        //Removes the "my position" marker
        posMarker.remove()
    posMarker = undefined
    //Removes the start location from local storage
    localStorage.removeItem("start")
    startCoords = null
})

//Adding event for clear button
toClearBtn.addEventListener('click', function () {
    //Removes the end location from local storage
    localStorage.removeItem("end")
    endCoords = null
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
        posMarker = new mapboxgl.Marker({
            color: "#4D8C2D"
        })
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

        posMarker = new mapboxgl.Marker({
            color: "#4D8C2D"
        })
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

        posMarker = new mapboxgl.Marker({
            color: "#4D8C2D"
        })
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
    localStorage.setItem("start", JSON.stringify(startCoords))

    //If the endcoords already have been set then the 'getTrip' func can run with both coords
    if(endCoords != null) {
        getTrip();
    }
}

//If the user does not allow the program to use their location. The button does nothing
function errorLocation() {
    return
}

//Targeting the 'from' and 'to' input field divs
const startGeo = document.getElementById('geocoder-start')
const endGeo = document.getElementById('geocoder-end')

//Specific targeting for the elements that the geocoders produce after loading the page
const startInput = startGeo.getElementsByTagName('input')[0];
const endInput = endGeo.getElementsByTagName('input')[0];
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
    }, 300)
})

//Function to "unhide" the second searchfield when a suggestion is picked
startInput.addEventListener("blur", function () {
    //SetTimeout for timing
    setTimeout(function () {
        endGeo.classList.remove('hide')
    }, 80)

})

//Function for calculating amount of zoom on the map that is needed depending on the trip duration
function calcMapZoom(dist) {
    if (dist < 5) {
        mapZoom = 11
    } else if (dist < 10) {
        mapZoom = 10
    } else if (dist < 15) {
        mapZoom = 9
    } else if (dist < 30) {
        mapZoom = 8.7
    } else if (dist < 50) {
        mapZoom = 8.5
    } else if (dist < 60) {
        mapZoom = 8.3
    }else if (dist < 70) {
        mapZoom = 8.1
    } else if (dist < 90) {
        mapZoom = 8
    } else if (dist < 150) {
        mapZoom = 7
    } else {
        mapZoom = 6
    }
    localStorage.setItem("tripDistance", tripDistance);
    localStorage.setItem("mapZoom", mapZoom)
    console.log(tripDistance)
    console.log(mapZoom)
}

//This async function is for getting the route for the trip and then find the distance
async function getTrip() {
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];

    // tripDuration = Math.round(data.duration / 60)
    tripDistance = Number((data.distance / 1000).toFixed(1))
    calcMapZoom(tripDistance)
}

//Date and time picker code below

//Functions for adding the selected departure/ arrival time to the local storage, to use later
function åkNu() {
    let nowTime = new Date();
    let hours = nowTime.getHours()
    let mins = nowTime.getMinutes()
    if (hours < 10) {
        hours = "0" + hours
    }
    if (mins < 10) {
        mins = "0" + mins
    }
    let åkNuTime = {
        type: "Åk nu",
        date: `${today.day}, ${today.dayOfMonth} ${today.month}`,
        time: hours + ":" + mins
    }
    localStorage.setItem("tripTime-Date", JSON.stringify(åkNuTime))
}

function avgång() {
    let hours = localStorage.getItem("hour")
    let mins = localStorage.getItem("min")

    let avgångTime = {
        type: "Avgång",
        date: localStorage.getItem("date"),
        time: hours + ":" + mins
    }
    localStorage.setItem("tripTime-Date", JSON.stringify(avgångTime))
}

function ankomst() {
    let hours = localStorage.getItem("hour")
    let mins = localStorage.getItem("min")

    let ankomstTime = {
        type: "Ankomst",
        date: localStorage.getItem("date"),
        time: hours + ":" + mins
    }
    localStorage.setItem("tripTime-Date", JSON.stringify(ankomstTime))
}


//The full date of when this line of code runs
let fullDate = new Date();
//Creates new objects with using some of the dates
let today = {
    day: fullDate.getDay(),
    dayOfMonth: fullDate.getDate(),
    month: fullDate.getMonth(),
    time: null
}

let tomorrow = new Date()
//For dates later than the current one I set a new date that is one day later then the previous one
tomorrow.setDate(fullDate.getDate() + 1)
oneDayFromNow = {
    day: tomorrow.getDay(),
    dayOfMonth: tomorrow.getDate(),
    month: tomorrow.getMonth()
}

let twoDays = new Date()
twoDays.setDate(tomorrow.getDate() + 1)
twoDaysFromNow = {
    day: twoDays.getDay(),
    dayOfMonth: twoDays.getDate(),
    month: twoDays.getMonth()
}

let threeDays = new Date()
threeDays.setDate(twoDays.getDate() + 1)
threeDaysFromNow = {
    day: threeDays.getDay(),
    dayOfMonth: threeDays.getDate(),
    month: threeDays.getMonth()
}

let fourDays = new Date()
fourDays.setDate(threeDays.getDate() + 1)
fourDaysFromNow = {
    day: fourDays.getDay(),
    dayOfMonth: fourDays.getDate(),
    month: fourDays.getMonth()
}

//This function loops through the days of the week and the months of the year
// and places them in the object that get passed as a value.
// For example, "sön" is represented as the num 0 in the .getDay() above in the objects,
// that meens that the for loop for the days will not run and in turn the "i" will be 0
function dateConverter(dateObj) {
    let days = ["sön", "mån", "tis", "ons", "tors", "fre", "lör"];
    let months = ["jan", "feb", "mars", "april", "maj", "juni", "juli", "aug", "sept", "okt", "nov", "dec"];
    let i
    let j
    for (i = 0; i < dateObj.day; i++) { }
    for (j = 0; j < dateObj.month; j++) { }
    dateObj.day = days[i]
    dateObj.month = months[j]
}

//The dateConverter converts all the date objects
dateConverter(today)
dateConverter(oneDayFromNow)
dateConverter(twoDaysFromNow)
dateConverter(threeDaysFromNow)
dateConverter(fourDaysFromNow)

function createDatePicker() {
    //Placing all the options for the datePicker in an array
    let dateSelectOptions = [today, oneDayFromNow, twoDaysFromNow, threeDaysFromNow, fourDaysFromNow];

    //Creating a select element and giving it a name and date attribute
    let dateSelect = document.createElement("select");
    dateSelect.name = "dates";
    dateSelect.id = "dates";

    //Creating a default option so the user needs to choose
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.text = "Välj datum"
    dateSelect.appendChild(defaultOption);

    //The for loop loops through the array and executes the code below for each value of the array (every object)
    for (const val of dateSelectOptions) {
        //Creating an option element
        let option = document.createElement("option");
        //Asssigning a value and text attribute to each option that is formated the same ex(tors, 28 okt)
        option.classList.add("date-options")
        option.value = `${val.day}, ${val.dayOfMonth} ${val.month}`;
        option.text = `${val.day}, ${val.dayOfMonth} ${val.month}`;
        //Lastly, appends the option to the select element as an option
        dateSelect.appendChild(option);
    }
    //And finaly appends the select to the "date-select" div/container 
    document.getElementById("date-select").appendChild(dateSelect);
}

function createTimePickers() {
    //Empty arrays to fill with several values
    let hourSelectOptions = []
    let minSelectOptions = []
    //Pushes the numbers 1-23 to the hours arr
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            let j = "0" + i.toString()
            hourSelectOptions.push([j])
        } else {
            hourSelectOptions.push([i]);
        }

    }
    //Pushes the numbers 1-59 to the mins arr
    for (let i = 0; i < 60; i++) {
        if (i < 10) {
            let j = "0" + i.toString()
            minSelectOptions.push([j])
        } else {
            minSelectOptions.push([i]);
        }
    }

    //Creating a select element and giving it a name and date attribute
    let hourSelect = document.createElement("select");
    hourSelect.name = "hours";
    hourSelect.id = "hours";

    //Creating a select element and giving it a name and date attribute
    let minSelect = document.createElement("select");
    minSelect.name = "mins";
    minSelect.id = "mins";

    //Creating default-options so the user needs to choose
    let defaultOptionH = document.createElement("option");
    defaultOptionH.value = "";
    defaultOptionH.disabled = true;
    defaultOptionH.selected = true;
    defaultOptionH.hidden = true;
    defaultOptionH.text = "Tim"
    hourSelect.appendChild(defaultOptionH);

    let defaultOptionM = document.createElement("option");
    defaultOptionM.value = "";
    defaultOptionM.disabled = true;
    defaultOptionM.selected = true;
    defaultOptionM.hidden = true;
    defaultOptionM.text = "Min"
    minSelect.appendChild(defaultOptionM);

    //The for loop loops through the array and executes the code below for each value of the array (every object)
    for (const val of hourSelectOptions) {
        //Creating an option element
        let option = document.createElement("option");
        //Asssigning a value and text attribute to each option that is formated the same ex(tors, 28 okt)
        option.classList.add("hour-options")
        option.value = val;
        option.text = val;
        //Lastly, appends the option to the select element as an option
        hourSelect.appendChild(option);
    }

    //The for loop loops through the array and executes the code below for each value of the array (every object)
    for (const val of minSelectOptions) {
        //Creating an option element
        let option = document.createElement("option");
        //Asssigning a value and text attribute to each option that is formated the same ex(tors, 28 okt)
        option.classList.add("min-options")
        option.value = val;
        option.text = val;
        //Lastly, appends the option to the select element as an option
        minSelect.appendChild(option);
    }
    let pointH3 = document.createElement("h3");
    pointH3.innerText = ":"
    //And finaly appends the select to the "date-select" div/container 
    document.getElementById("time-select").appendChild(hourSelect);
    document.getElementById("time-select").appendChild(pointH3);
    document.getElementById("time-select").appendChild(minSelect);
}

//Creates the datePicker and timePickers
createDatePicker()
createTimePickers()

// Targeting the date, hour and min select dropdowns
const dateSelection = document.getElementById("dates");
const hourSelection = document.getElementById("hours");
const minSelection = document.getElementById("mins");

// Global variables
let dateSelected = false
let hourSelected = false
let minSelected = false

dateSelection.addEventListener('change', function () {
    localStorage.setItem("date", this.value);
    dateSelected = true
})

hourSelection.addEventListener('change', function () {
    localStorage.setItem("hour", this.value);
    hourSelected = true
})

minSelection.addEventListener('change', function () {
    localStorage.setItem("min", this.value);
    minSelected = true
})

//Targeting elements
const åkNuBtn = document.getElementById('åk-nu')
const avgångBtn = document.getElementById('avgång')
const ankomstBtn = document.getElementById('ankomst')
const dateTimeSection = document.getElementById("date-time-picker")

//The following eventListeners are for toggeling a specific css style between 3 buttons (only 1 should be "active")
åkNuBtn.addEventListener("click", function () {
    if (avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.add("greyOut")
        dateTimeSection.setAttribute("disabled", "")
    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        åkNuBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.add("greyOut")
        dateTimeSection.setAttribute("disabled", "")
    } else if (åkNuBtn.classList.contains('btn-pressed')) {
        return
    }
})

avgångBtn.addEventListener("click", function () {
    if (åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        avgångBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.remove("greyOut")
        dateTimeSection.removeAttribute("disabled")
    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        ankomstBtn.classList.toggle('btn-pressed')
        avgångBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.remove("greyOut")
        dateTimeSection.removeAttribute("disabled")
    } else if (avgångBtn.classList.contains('btn-pressed')) {
        return
    }
})

ankomstBtn.addEventListener("click", function () {
    if (åkNuBtn.classList.contains('btn-pressed')) {
        åkNuBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.remove("greyOut")
        dateTimeSection.removeAttribute("disabled")
    } else if (avgångBtn.classList.contains('btn-pressed')) {
        avgångBtn.classList.toggle('btn-pressed')
        ankomstBtn.classList.toggle('btn-pressed')
        dateTimeSection.classList.remove("greyOut")
        dateTimeSection.removeAttribute("disabled")
    } else if (ankomstBtn.classList.contains('btn-pressed')) {
        return
    }
})

function clearAllFields() {
    startInput.value = ''
    endInput.value = ''
    dateSelection.value = ""
    hourSelection.value = ""
    minSelection.value = ""
}

//The function that runs when pressing the "tillval" button
function toFilter() {
    if (startCoords != null && endCoords != null && åkNuBtn.classList.contains('btn-pressed')) {
        åkNu()
        location.href = 'filter.html'
        clearAllFields()
    } else if (startCoords != null && endCoords != null && avgångBtn.classList.contains('btn-pressed') && dateSelected && hourSelected && minSelected) {
        avgång()
        location.href = 'filter.html'
        clearAllFields()
    } else if (startCoords != null && endCoords != null && ankomstBtn.classList.contains('btn-pressed') && dateSelected && hourSelected && minSelected) {
        ankomst()
        location.href = 'filter.html'
        clearAllFields()
    } else {
        alert("Pls fill all fields")
    }
}
