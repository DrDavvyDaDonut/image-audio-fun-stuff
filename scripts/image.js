var grids = [[[]]]            //  contains the grid representations of the red, green and blue values in the picture
var totals = [[],[],[],[]]    //  contains the sum of the values in each column for red, green, blue, and alpha
let useColumns = true         //  NOT USED. whether it reads left to right or top to bottom


//  loads the image file
function loadFile(){
  file = document.querySelector('input[type=file]').files[0]  //  gets the file from the file selector
  reader = new FileReader()

  reader.addEventListener("load", ()=> {                      //  when the reader loads, run analyze
    analyze( reader.result ) 
  }, false)

  if (file){
    reader.readAsDataURL(file)                                //  if the file has anything, read it
  }

  document.getElementById("run").disabled = false             //  activates the "run" button
}


//  analyzes the image. populates "grids"
function analyze( result ){
  canvas = document.getElementById ("canvas")
  ctx = canvas.getContext("2d")

  image = new Image()
  image.src = result                                      //  sets the url of the image to the result of the reader

  image.addEventListener("load", () => {                  //  when the image loads
    
    iWidth = image.width                                  //  iWidth set to the width of the image
    iHeight = image.height                                //  iHeight set to the height of the image
    
    canvas.width = iWidth                                 //  sets the width of the canvas to the width of the image
    canvas.height = iHeight                               //  sets teh hight of the canvas to the height of the image
    
    ctx.clearRect(0, 0, iWidth, iHeight)                  //  clears canvas
    ctx.fillRect(0, 0, iWidth, iHeight)                   //  fills the canvas with black
    ctx.drawImage(image, 0, 0, iWidth, iHeight)           //  draws the image into the canvas

    updateInfo()
    forceNice()
    
  })

}


//  update info
function updateInfo(){
  imageData = ctx.getImageData(0, 0, iWidth, iHeight)     //  gets a list of the rgba values. it's literally just a list
  lines = separateColors(imageData.data)                  //  separates the list into four separate lists 
  grids = gridify(lines, iWidth, iHeight)                 //  takes the lines and turns them into grids
}


//  separates the image data list into four different lists
function separateColors(array){

  line = [[],[],[],[]]

  array.forEach((value, index) => {                     //  the image date comes as [r, g, b, a, r, g, b, a...]
    line[index % 4].push(value)                         //  it splits the data into four lines
  })

  return line
}


//  turns a line into a grid with the parameter width and height
function gridify(arrays, pWidth, pHeight){
  grids = pullInfo(arrays, pWidth, pHeight)
  return grids
}


//  takes the lines and turns them into grids (either prioritizing columns or rows)
function pullInfo(arrays, pWidth, pHeight){
  if (useColumns){
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


//  takes columns and pushes them into the grid
function pullInfoFromColumns(index, arrays, pWidth, pHeight){

  channel = arrays[index]                                     //  sets channel to specified channel
  
  outputGrid = []
  
  for (var columnIt = 0; columnIt < pWidth; columnIt++){      //  column iterator to number of columns
    
    column = []
    total = 0                                                 //  NOT USED
    
    for (var rowIt = 0; rowIt < pHeight; rowIt++){            //  row iterator to rumber of rows
      value = channel[columnIt + rowIt*pWidth]                //  the index for the channel is the column + the number of rows * the width
      total += value
      column.unshift(value)
    }

    totals[index][columnIt] = total                           //  NOT USED
    
    outputGrid[columnIt] = column                             //  pushes the column to the grid
  }
  
  return outputGrid
}


//  literally just takes the row and pushes them into the output grid
function pullInfoFromRows(array, pWidth, pHeight){
  
  outputGrid = []
  
  for (var i  = 0; i < pHeight; i++){

    row = array.splice(0, pWidth)           //  takes the values from index 0 to parameter width and takes them out of the input array
    outputGrid[i] = row                     //  pushes the row into the grid
  }

  return outputGrid
}