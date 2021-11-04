let cars = [
    standard = {
        title: "Standard",
        price: "200 kr",
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
        price: "300 kr",
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
        price: "400 kr",
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
        price: "250 kr",
        description: "För dig som har allergi för pälsdjur, 100% pälsfritt fordon. Max 4 passagerare.",
        img: "imgs/allergyCar.png",
        djurvänligBil: false,
        handikappanpassad: false,
        stortBagage: false,
        bälteskudde: true,
        bilbarnstol: true
    },
    // festlig = {
    //     title: "Festlig",
    //     price: "200 kr",
    //     description: "Vårt standardalternativ med 100% garanti att få en elbil för din resa.",
    //     img: null
    // }
];

let userTillval = JSON.parse(localStorage.getItem("filter"));

// let listCars = ["Standard", "XL", "Guld", "Allergi"]

let removedCars

function filterCars() {
    // userTillval.forEach(item => {
    //     console.log(item)
    // })
    let tillval = []
    for (const [key, value] of Object.entries(userTillval)) {
        tillval.push(`${key}: ${value}`)
    }

    // djurvänligBil: true,
    //     handikappanpassad: false,
    //     stortBagage: false,
    //     bälteskudde: true,
    //     bilbarnstol: true

    if (tillval.includes('djurvänligBil: true')) {
        //Removes the "Guld" and "Allegi" cars
        removedCars = cars.splice(2, 2)
    }

    if (tillval.includes('handikappanpassad: true')) {
        if(cars.length == 2) {
            //If only the "standard" and "XL" cars remain, only remove the first car which is the "standard"
            removedCars = cars.splice(0, 1);
        } else {
            //If all cars remain, remove the first car which is the "standard", then the 2 other at the end
            removedCars = cars.splice(0, 1)
            removedCars = cars.splice(1, 2)
        }
    }

    if (tillval.includes('stortBagage: true')) {
        if(cars.length > 1) {
            //If all cars remain, remove the first car which is the "standard", then the 2 other at the end
            removedCars = cars.splice(0, 1)
            removedCars = cars.splice(1, 2)
        } else {
            //Nothing needs to be done if only the xl car remains
            return
        }
    }

    if (tillval.includes('bilbarnstol: true')) {
        if(cars.includes(guld)) {
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
        carPrice.innerText = `${val.price}`;
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

let choosenCar = null

createFilteredCarsList()

let carOptions = document.querySelectorAll(".car-list-item")

let bookingButton = document.getElementById("booking-btn");

carOptions.forEach(item => {
    item.addEventListener('click', evt => {
        if (item.classList.contains("clicked-car")) {
            item.classList.toggle("clicked-car");
            choosenCar = null
            bookingButton.classList.add("greyOut-btn")
        } else {
            carOptions.forEach(item => {
                if (item.classList.contains("clicked-car")) {
                    item.classList.toggle("clicked-car")
                }
            })
            item.classList.add("clicked-car")
            bookingButton.classList.remove("greyOut-btn")
            choosenCar = item.id
        }
    })
})

function toBooking() {
    if (choosenCar != null) {
        localStorage.setItem("choosenCar", choosenCar)
    } else {
        alert("Please choose a car to continue.")
    }
}