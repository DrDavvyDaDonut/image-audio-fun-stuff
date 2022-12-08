
var totalRange = [27.5, 3520]                   //  range of frequencies
var oscType = ["sine","square","triangle"]      //  wave for red, green, and blue channel

actx = new AudioContext                         //  creates a new audio context

out = actx.destination

panning = new StereoPannerNode(actx)

var nice = true
var gridWidth = 0
var gridHeight = 0
var maxGain = 0
var oscs = [[],[],[]]
var gains = [[],[],[]]


//` runs when button is pushed
function produceSound() {

  panning.connect(out)

  gridWidth = grids[0].length         //  sets grid width to the width of the grid
  gridHeight = grids[0][0].length     //  sets grid height to the height of the grid

  maxGain = 1 / (gridHeight * 3)      //  max gain per column per channel, so the speakers don't explode

  oscs = [[],[],[]]                   //  will carry all the oscillators created for each channel

  if (nice){                          //  nice setup or not
    niceSetup()
  } else {
    totalSetup()
  }
}


//  sets up sound with equal temperament
function niceSetup(){
  
  octaves = log(2, totalRange[1]/totalRange[0])     //  gets the number of octaves
  maxHeight = octaves * chord.length + 1            //  calculates the total number of avaliable notes with nunmber of octabes and notes in chord per octave
  
  musicHeight = maxHeight                           //  the number of notes is set to the max
  if (gridHeight < maxHeight){                      //  if the number of notes is greater than the height of the grid, the number of notes becomes the height
    musicHeight = gridHeight  
  } 
  
  interval = 2 ** (1/12)                            //  sets interval to equal temperament tuning interval

  start = (maxHeight - musicHeight)/2               //  centers the notes in the total range of notes
  start = Math.floor(start)

  base = totalRange[0]

  //  for each channel in oscs, populate with oscillators and gain nodes
  oscs.forEach(function(channelArray, channelIndex){            

    for (var index = 0; index < musicHeight; index++){                //  number of oscillators equal to the number of notes required
      
      channelArray[index] = actx.createOscillator()                                   //  creates an oscillator
      channelArray[index].type = oscType[channelIndex]                                //  sets the oscillator type

      gains[channelIndex][index] = actx.createGain()                                  //  creates gain node
      gains[channelIndex][index].gain.value = getPixelVolume(channelIndex, 0, index)  //  gets the volume of the first pixel

      noteIndex = index + start

      octave = (noteIndex - noteIndex % chord.length) / chord.length                  //  how many octaves up a certain note is
      chordValue = chord[noteIndex % chord.length]                                    //  how many semitones about the first note of the octave a note is

      note = (octave * 12 + chordValue)                                               //  how many semitones above the base note a note is
      
      channelArray[index].frequency.value = base * (interval ** note)                 //  sets the frequency of the corresponding note

      channelArray[index].connect(gains[channelIndex][index])                         //  connects the oscillator to the corresponding gain node
      gains[channelIndex][index].connect(panning)                                     //  connects the gain node to the panner node
    }
  })

  gainAndPan()
  
}


//  setup the notes with a true separation of the notes. pretty much the same thing but with simpler math
function totalSetup(){
  
  quotient = totalRange[1] / totalRange[0]
  interval = quotient ** (1 / gridHeight)

  oscs.forEach(function(channelArray, channelIndex){

    for (var index = 0; index < gridHeight; index++){

      channelArray[index] = actx.createOscillator()
      channelArray[index].type = oscType[channelIndex]

      gains[channelIndex][index] = actx.createGain()
      gains[channelIndex][index].gain.value = getPixelVolume(channelIndex, 0, index)
      
      channelArray[index].frequency.value = totalRange[0] * (interval ** index)
      
      channelArray[index].connect(gains[channelIndex][index])
      gains[channelIndex][index].connect(panning)
    }
    
  })

  gainAndPan()
}


//  sets all the volume changes and pans the image
function gainAndPan(){
  resolution = oscs[0].length

  multiple = resolution / gridHeight

  groups = []

  for (var i = 0; i < resolution + 1; i++){                         //  finds the number of pixels that each note has
    many = i / multiple
    many = Math.floor(many)
    groups[i] = many
  }

  time = actx.currentTime                                           //  sets up time for timing

  for (var channels = 0; channels < 3; channels++){

    for (var columns = 0; columns < gridWidth; columns++){
      
      for (var poxels = 0; poxels < resolution; poxels++){          //  i'm calling a group of pixels a poxel. don't ask me why
        
        pixelStart = groups[poxels]
        pixelEnd = groups[poxels + 1]
        poxelVolume = 0
        
        for (var pixs = pixelStart; pixs < pixelEnd; pixs++){
          poxelVolume += getPixelVolume(channels, columns, pixs)
        }
        
        gains[channels][poxels].gain.setValueAtTime(poxelVolume, time + columns * timeLength / gridWidth)

      }
    }
  }

  panning.pan.setValueAtTime(-1, time)
  
  panning.pan.linearRampToValueAtTime(1, time + timeLength)
  
  oscs.forEach((channel) => {
    channel.forEach((osc) => {
      osc.start(time)
      osc.stop(time + timeLength)
    })
  })
  
}


//  gets volume based on value and alpha 
function getPixelVolume(channel, column, row){
  pixelVolume = maxGain * grids[channel][column][row] * grids[3][column][row]
  pixelVolume /= 65025
  return pixelVolume
}


//  log base x of y
function log(x,y){
  return Math.log(y) / Math.log(x)
}
