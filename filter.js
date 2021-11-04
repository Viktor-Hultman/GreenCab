const tillvalContainers = document.querySelectorAll(".tillval-container")

//Setup for the filter object
let tillvalObj = {
    djurvänligBil: false,
    handikappanpassad: false,
    stortBagage: false,
    bälteskudde: false,
    bilbarnstol: false
};
//Sets the default "object" to the local storage
localStorage.setItem("filter", JSON.stringify(tillvalObj))

//Adding evtListeners to all the 'tillval' options
tillvalContainers.forEach(item => {
    item.addEventListener('click', evt => {
        //Adds the 'checked' class to the clicked option
        item.lastElementChild.firstElementChild.classList.toggle("checked")
        //Placing the id of the option in a variable
        let itemId = item.id
        //Getting all the keys of the filter object
        let objKeys = Object.keys(tillvalObj)

        //Checks if the clicked option id is the same as one of the filter keys
        // and then "toggle" between true if it is checked or false otherwise
        if(itemId == objKeys[0]) {
            if(tillvalObj.djurvänligBil == false) {
                tillvalObj.djurvänligBil = true
            } else {
                tillvalObj.djurvänligBil = false
            }
        }

        if(itemId == objKeys[1]) {
            if(tillvalObj.handikappanpassad == false) {
                tillvalObj.handikappanpassad = true
            } else {
                tillvalObj.handikappanpassad = false
            }
        }

        if(itemId == objKeys[2]) {
            if(tillvalObj.stortBagage == false) {
                tillvalObj.stortBagage = true
            } else {
                tillvalObj.stortBagage = false
            }
        }

        if(itemId == objKeys[3]) {
            if(tillvalObj.bälteskudde == false) {
                tillvalObj.bälteskudde = true
            } else {
                tillvalObj.bälteskudde = false
            }
        }

        if(itemId == objKeys[4]) {
            if(tillvalObj.bilbarnstol == false) {
                tillvalObj.bilbarnstol = true
            } else {
                tillvalObj.bilbarnstol = false
            }
        }
        console.log(itemId);
    })
});

function toCars() {
    localStorage.setItem("filter", JSON.stringify(tillvalObj))
    location.href = 'cars.html'
}
