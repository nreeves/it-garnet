function getCuriosity() {
    document.getElementById("pictureDate").value = "2012-08-06";
  }
  
  function getOpportunity() {
    document.getElementById("pictureDate").value = "2004-01-26";
  }
  
  function getSpirit() {
    document.getElementById("pictureDate").value = "2004-01-05";
  }
  
  async function getPhotos() {
    "use strict";

    var form = $("#myform");
  
    form.validate();

    if (form.valid()) {
      var rover;
      if (document.getElementById("curiosity").checked) {
        rover = document.getElementById("curiosity").value;
      }
  
      if (document.getElementById("opportunity").checked) {
        rover = document.getElementById("opportunity").value;
      }
      if (document.getElementById("spirit").checked) {
        rover = document.getElementById("spirit").value;
      }
  
      var pictureDate = document.getElementById("pictureDate").value;
      var apiKey = "klPNVKxX7LPt1NKjTDTr52PJfARUVGGSHZO83Ddz";
  
      var myURL2 =
        "https://api.nasa.gov/mars-photos/api/v1/rovers/" +
        rover +
        "/photos?earth_date=" +
        pictureDate +
        "&api_key=" +
        apiKey;
  
      let PictureObject = await fetch(myURL2);
      let Result = await PictureObject.text();
      let msg = JSON.parse(Result);
      document.getElementById("numPhoto").innerHTML =
        msg.photos.length + " pictures found";
      if (numPhoto > 25) {
        numPhoto = 25;
      }
  
      for (let i = 0; i < 25; i++) {
        document.getElementById("image" + i).src = msg.photos[i].img_src;
        document.getElementById("image" + i).style.visibility = "visible";
        document.getElementById("image" + i).title =
          msg.photos[i].camera.full_name;
           document.getElementById("displayPhoto").innerHTML =
             "Click a photo to display full size";
      }
    }
  let PictureObject = await fetch(myURL2);
  let Result = await PictureObject.text();
  let msg =JSON.parse(Result); 
  document.getElementById("numPhoto").innerHTML = msg.photos.length + " pictures found"
  if (numPhoto >25)
  {numPhoto = 25}
  
    for (let i = 0; i < 25; i++) {
      document.getElementById("href" + i).href = msg.photos[i].img_src;
    }
  }