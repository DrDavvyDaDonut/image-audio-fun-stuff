var grids = [[[]]]
var totals = [[],[],[],[]]

function loadFile(){
  imagePane = document.querySelector('img');
  file = document.querySelector('input[type=file]').files[0]
  reader = new FileReader()

  reader.addEventListener("load", ()=> {
    analyze( reader.result );
  }, false)

  if (file){
    reader.readAsDataURL(file);
  }

  document.getElementById("run").disabled = false
}

function analyze( result ){
  canvas = document.getElementById ("canvas")
  ctx = canvas.getContext("2d")

  image = new Image()
  image.src = result

  lines = [[],[],[],[]]


  image.addEventListener("load", () => {
    
    iWidth = image.width
    iHeight = image.height
  
    // console.log(iWidth + ", " + iHeight)
    
    canvas.width = iWidth
    canvas.height = iHeight
    
    ctx.drawImage(image,0,0,iWidth,iHeight)

    imageData = ctx.getImageData(0,0,iWidth,iHeight)

    // console.log(imageData.data)

    lines = separateColors(imageData.data)
    
    grids = gridify(lines, iWidth, iHeight)

    // console.log(grids)
    
  })
}

function separateColors(array){

  line = [[],[],[],[]]

  array.forEach((element,index) => {
    line[index%4][line[index%4].length] = element
  })

  return line
}

function gridify(arrays, pWidth, pHeight){
  grids = pullInfo(arrays, pWidth, pHeight, true)
  return grids
}

function pullInfo(arrays, pWidth, pHeight, norm){
  if (norm){
    r = pullInfoFromColumns(0, arrays, pWidth, pHeight )
    g = pullInfoFromColumns(1, arrays, pWidth, pHeight )
    b = pullInfoFromColumns(2, arrays, pWidth, pHeight )
    a = pullInfoFromColumns(3, arrays, pWidth, pHeight )

    return [r,g,b,a]
    
  } else {
    r = pullInfoFromRows(arrays[0], pWidth, pHeight )
    g = pullInfoFromRows(arrays[1], pWidth, pHeight )
    b = pullInfoFromRows(arrays[2], pWidth, pHeight )
    a = pullInfoFromRows(arrays[3], pWidth, pHeight )

    return [r,g,b,a]
  }
}

function pullInfoFromColumns(index, arrays, pWidth, pHeight){

  array = arrays[index]
  
  outputGrid = []
  
  for (var i = 0; i < pWidth; i++){
    
    column = []
    total = 0
    
    for (var j = 0; j < pHeight; j++){
      total += array[i + j*pWidth]
      column.unshift(array[i + j*pWidth])
    }

    totals[index][i] = total
    outputGrid[i] = column
  }
  
  return outputGrid
}

function pullInfoFromRows(array, pWidth, pHeight){
  outputGrid = []
  for (var i  = 0; i < pHeight; i++){
    thing = array.splice(0, pWidth)
    outputGrid[i] = thing
  }
  // console.log(outputGrid)
  return outputGrid
}
