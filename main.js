// Waiting until document has loaded


var previousvalueBtn ="Up";
var valueBtn = document.getElementById("myBtn").value;

function tgl() {
  var t = document.getElementById("myBtn");
  if (t.value == "ON") {
    t.value = "OFF";

    valueBtn = "OFF";
    previousvalueBtn ="Up";


  }
  else {
    t.value = "ON";
    
    valueBtn = "ON";
    previousvalueBtn ="Up";


  }
}




window.onload = () => {

  setInterval(function () {
    if (valueBtn === "ON" && previousvalueBtn ==="Up") {
      console.log("onnnn")
      previousvalueBtn = "Down"
      ForceGraphSVG();

      temp = document.getElementById("svgContainer");
      if (temp) {
        temp.remove();
      }

      //MapGraphSVG();

    } else if (valueBtn === "OFF" && previousvalueBtn ==="Up") {
      console.log("offff")
      previousvalueBtn = "Down"

      temp = document.getElementById("svgContainer");
      if (temp) {
        temp.remove();
      }

      MapGraphSVG();
      

      

      


    }else{}

  }, 40);



  //ForceGraphSVG();




};



