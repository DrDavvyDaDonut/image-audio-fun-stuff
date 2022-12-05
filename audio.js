
var totalRange = [27.5, 3520]
var oscType = ["sine","square","triangle"]

actx = new AudioContext

out = actx.destination

panning = new StereoPannerNode(actx)

var nice = true
var pictureWidth = 0
var pictureHeight = 0
var maxGain = 0
var oscs = [[],[],[]]
var gains = [[],[],[]]

function produceSound() {

  panning.connect(out)

  console.log(totals)
  console.log("grids")
  console.log(grids)

  pictureWidth = grids[0].length
  pictureHeight = grids[0][0].length

  console.log("width " + pictureWidth)
  console.log("height " + pictureHeight)

  maxGain = 1 / (pictureHeight * 3)

  oscs = [[],[],[]]

  

  if (nice){
    niceSetup()
  } else {
    totalSetup()
  }

  
}

function niceSetup(){
  
  octaves = log(2, totalRange[1]/totalRange[0])
  maxHeight = octaves * chord.length + 1
  
  musicHeight = maxHeight
  
  if (pictureHeight < maxHeight){
    musicHeight = pictureHeight  
  } 
  
  interval = 2 ** (1/12)

  start = (maxHeight - musicHeight)/2
  start = Math.floor(start)

  console.log(maxHeight)
  console.log(start)
  console.log(start + musicHeight)

  base = totalRange[0]

  oscs.forEach(function(element, index){
    for (var i = 0; i < musicHeight; i++){
      
      element[i] = actx.createOscillator()
      gains[index][i] = actx.createGain()
      gains[index][i].gain.value = getPixelVolume(index, 0, i)

      
      ii = i + start
      exponent = ((ii - ii % chord.length) / chord.length * 12 + chord[ii % chord.length])

      // console.log("exponent " + exponent)
      // console.log("multiple " + interval ** exponent)
      
      element[i].frequency.value = base * interval ** exponent
      
      // console.log(element[i].frequency.value)
      
      element[i].type = oscType[index]

      element[i].connect(gains[index][i])
      gains[index][i].connect(panning)
    }
  })

  gainAndPan()
  
}

function totalSetup(){
  
  oscs.forEach(function(element, index){
    for (var i = 0; i < pictureHeight; i++){
      element[i] = actx.createOscillator()
      element[i].type = oscType[index]

      gains[index][i] = actx.createGain()
      gains[index][i].gain.value = getPixelVolume(index, 0, i)

      interval = totalRange[1]/totalRange[0]
      interval = interval ** (1/pictureHeight)
      
      element[i].frequency.value = totalRange[0] * (interval ** i)

      // console.log(element[i].frequency.value)
      
      element[i].connect(gains[index][i])
      gains[index][i].connect(panning)
    }
    
  })

  gainAndPan()
}

function gainAndPan(){
  resolution = oscs[0].length

  multiple = resolution / pictureHeight

  groups = []
  totalGroups = 0
  for (var i = 0; i < resolution + 1; i++){
    many = i / multiple
    many = Math.floor(many)
    groups[i] = many
    totalGroups = many
  }

  console.log(groups)
  console.log(totalGroups)

  time = actx.currentTime

  for (var channels = 0; channels < 3; channels++){
    for (var columns = 0; columns < pictureWidth; columns++){

      poxelTotal = 0
      
      for (var poxels = 0; poxels < resolution; poxels++){
        
        pixelStart = groups[poxels]
        pixelEnd = groups[poxels + 1]
        poxelVolume = 0
        
        for (var pixs = pixelStart; pixs < pixelEnd; pixs++){
          poxelVolume += getPixelVolume(channels, columns, pixs)
        }

        poxelTotal += poxelVolume

        gains[channels][poxels].gain.setValueAtTime(poxelVolume, time + columns * timeLength / pictureWidth)
      }

      // console.log("channel " + channels + "\ncolumn  " + columns + "\ntotal volume " + poxelTotal)
      
    }
  }

  panning.pan.setValueAtTime(-1, time)
  
  panning.pan.linearRampToValueAtTime(1, time + timeLength)

  // panningOffset = timeLength/pictureWidth
  // for (var i = 0; i < pictureWidth; i++){
  //   panning.pan.setValueAtTime(-1 + 2/pictureWidth * i, time + panningOffset*i)
  // }
  
  oscs.forEach((element) => {
    element.forEach((e) => {
      e.start(time)
      e.stop(time + timeLength)
    })
  })
  
}

function getPixelVolume(channel, column, row){
  pixelVolume = maxGain * grids[channel][column][row] * grids[3][column][row]
  pixelVolume /= 65025
  return pixelVolume
}


function log(x,y){
  return Math.log(y) / Math.log(x)
}