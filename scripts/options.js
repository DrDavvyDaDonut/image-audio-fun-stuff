
var chords = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              [0, 2, 4, 5, 7, 9, 11],
              [0, 3, 5, 7, 10],
              [0, 4, 7],
              [0, 3, 7]]

var chord = chords[3]
var timeLength = 5


function updateChord(){
  div = document.getElementById("customChord");
  disclaimer = document.getElementById("disclaimer");
  x = document.getElementById("chordSelect").value
  intX = parseInt(x)

  console.log(intX)

  if (intX < 5){
    chord = chords[intX]
    div.style.visibility = "hidden"
    disclaimer.style.display = "none"
  } else {
    div.style.visibility = "visible"
    disclaimer.style.display = "block"
    updateCustom()
  }

  

  console.log(chord)
}

function updateTime(){
  x = document.getElementById("time").value
  timeLength = parseInt(x)
  console.log(timeLength)
}

function updateCustom(){
  ids = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",]

  values = []
  
  ids.forEach((id, index) => {
    values[index] = document.getElementById(id).checked
  })

  // console.log(values)

  chord = []
  
  values.forEach((bool, index) => {
    if (bool){
      chord.push(index)
    }
  })

  console.log(chord)

  
}

function niceToggle() {
  checkBox = document.getElementById("pretty");

  chordss = document.getElementById("chordss")

  nice = checkBox.checked 

  if (nice){
    chordss.style.display = "block"
  } else {
    chordss.style.display = "none"
  }

  console.log(nice)
}
