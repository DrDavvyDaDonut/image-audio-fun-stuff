//  preset chords
var chords = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              [0, 2, 4, 5, 7, 9, 11],
              [0, 3, 5, 7, 10],
              [0, 4, 7],
              [0, 3, 7]]

var chord = chords[3]
//  the length in seconds of the audio
var timeLength = 3


//  updates the chord
function updateChord(){

  div = document.getElementById("customChord")            //  gets the div containing the custom chord keyboard
  disclaimer = document.getElementById("disclaimer")      //  gets the div containing the disclaimer

  x = document.getElementById("chordSelect").value        //  gets the value from the scale dropdown
  intX = parseInt(x)                                      //  parses the value from the dropdown as an int

  if (intX < 5){                                          //  if the chord is preset, hide the custom chord things
    chord = chords[intX]
    div.style.visibility = "hidden"
    disclaimer.style.display = "none"
  } else {                                                //  display the custom chord things
    div.style.visibility = "visible"
    disclaimer.style.display = "block"
    updateCustom()
  }
}


//  whenever the custom chord interface loads or is interacted with, update the chord
function updateCustom(){
  ids = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",]

  values = []
  
  ids.forEach((id, index) => {                                //  sets value to true if corresponding box is checked, false if not
    values[index] = document.getElementById(id).checked
  })

  chord = []
  
  values.forEach((bool, index) => {                           //  pushes the index of all the checked boxes
    if (bool){
      chord.push(index)
    }
  })  
}


//  updates the length of the audio
function updateTime(){
  x = document.getElementById("time").value
  timeLength = parseInt(x)
}


//  toggles between true division of sound and equal temperament
function niceToggle() {
  checkBox = document.getElementById("pretty")

  chordsDiv = document.getElementById("chordsDiv")

  nice = checkBox.checked                               //  sets nice to box checked state

  if (nice){                                            //  hides the chord selector if not nice sound
    chordsDiv.style.display = "block"
  } else {
    chordsDiv.style.display = "none"
  }
}


//  inverts the image
function invert(){
  ctx.globalCompositeOperation='difference'
  ctx.fillStyle='white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  updateInfo()
}


//  force nice if image is too big because sometimes it just doesn't work
function forceNice(){
  checkBox = document.getElementById("pretty")

  if (useColumns){
    bool = iHeight < 500
  } else {
    bool = iWidth < 500
  }

  if (bool){
    checkBox.disabled = false
  } else {
    
    checkBox.checked = true
    nice = true
  
    checkBox.disabled = true
  }
  
}
