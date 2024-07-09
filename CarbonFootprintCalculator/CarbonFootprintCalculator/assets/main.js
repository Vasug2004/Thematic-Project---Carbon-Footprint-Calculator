/**
 * File for results page of carbon footprint calculator
 * Calculates emissions 
 * Validates inputs
 * Draws pie chart and line chart
 * @author Luna Lamb 
 * @https://lambxx.github.io/
 * CopyRight Luna Lamb 2024
 */

function processForm() {

   valid = validate(); // Check if all inputs valid 
   if(!valid){
    document.getElementById('warningBtn').innerHTML = "<p id=\"warningMessage\"class=\"warning\">Missing Fields, Please fill in all fields</p>";
 
  }
   var x = document.getElementById("form");
   // Hide and display from and results
  if (x.style.display === "none") {
    
    x.style.display = "block";
    location.reload();
    
  } else {
    if (valid){ // Only hide if inputs valid 
    
    var output = calculateFootrptint();
    document.getElementById('output').innerHTML = "<h2>" + output + " Tonnes of CO2 per year </h2>";
    x.style.display = "none";
    //document.getElementById('warningMessage').style.display = "none";
    setTimeout(function() {
      // Code to execute after 2 seconds
    }, 2000);
    }
  }
  var x = document.getElementById("results");
  if (x.style.display === "none") {
    if (valid){ // Only show if inputs valid
    x.style.display = "block";
    drawLifeTimeUsage(output);
    var btn = document.getElementById('mainBn');
    btn.innerHTML = "Redo";
}
  } else {
    
    x.style.display = "none";
    
  }
  
}

function calculateFootrptint(){

  // Calculates Carbonfootrpint and displays
  // Add in train and tram
  // Emmisisons in pounds = (weekly miles * 52) * (car:0.79,bus:0.14) (train * 0.05) (tram 0.027)+ (electric bill * 105 + gas * 105 + oil * 113) + (no. 4 hour less flights by 1110 + 4 hour more flights * 4400) + 184(if dont recycle paper) + 166(dont recycle metal)



  var total = 0;
  // Add commuting emissions
  var miles = document.getElementById('CommuterMiles').value;
  var commuting = 0
  if (document.getElementById('transportR1').checked){
    // Car
    total += miles * 52 * 0.79;
    commuting += miles * 52 * 0.79;
  } else if (document.getElementById('transportR3').checked) {
    // bus 
    total += miles * 52 * 0.14;
    commuting += miles * 52 * 0.14;
    }  else if (document.getElementById('transportR4').checked) {
    // train
    total += miles * 52 * 0.05;
    commuting += miles * 52 * 0.05;
    } else {
      total += miles * 52 * 0.027;
      commuting = miles * 52 * 0.027;
    }
    // Add energy emissions
    var electricBill = document.getElementById('electricBill').value;
    var gasBill = document.getElementById('gasBill').value;
    var oilBill = document.getElementById('oilBill').value;
    var energy = ((electricBill*1.24) * 105) + ((gasBill * 1.24)*  105) + (( oilBill *1.24) * 113); // 1.24 is to conver from dollar to gbp
    total += ((electricBill*1.24) * 105) + ((gasBill * 1.24)*  105) + (( oilBill *1.24) * 113); // 1.24 is to conver from dollar to gbp
    
    // Add flight emissions
    var lessThanFour = document.getElementById('lessThanFour').value;
    var moreThanFour = document.getElementById('moreThanFour').value;
  var flights = (lessThanFour * 1110) + (moreThanFour * 4400);
  // Add recycling emissions
  var recycling = 0;

   total += (lessThanFour * 1110) + (moreThanFour * 4400);
    if (!document.getElementById('metalR1').checked){
      total += 166;
      recycling += 166;
    }
    if (!document.getElementById('paperR1').checked){
      total += 184;
      recycling
    } 
    // Add diet emissions
    var diet = 0;
      //  Vegan/veg 1.6kg *365 
  // avg 2.5kg * 365
  // meat 3.3kg * 365

  // 1kg = 0.001 tonne
  // Averasge fast food 2.35

  if (document.getElementById('dietR1').checked){
    diet += 3.3 * 365* 0.001;
  } else if(document.getElementById('dietR2').checked){
    diet += 2.5 * 365* 0.001;

  } else if (document.getElementById('dietR3').checked){
    diet += 1.6 * 365* 0.001;
  }

  if (document.getElementById('fastFoodR2').checked){
    diet += 2.35 * 52 * 1.5 * 0.001;
  }  else if (document.getElementById('fastFoodR3').checked){
    diet += 2.35 * 52 * 3.5 * 0.001;
  }
  // Data is put into array for pie chart
    data = [commuting* 0.000453592,energy* 0.000453592,flights* 0.000453592,recycling* 0.000453592, diet]
    console.log(data);
    // Call pie chart function
    drawChart(data);
   return total * 0.000453592; // CPnvert piund  to tonne
}



function validateRadioButtons(name,numOptions){
  // Validates radio buttons 
  
  var valid = false;
  for (let i = 1; i < numOptions + 1; i++) {
    radio = document.getElementById(name+'R'+i);
    console.log(radio);
    if ((radio.checked == true)){
     valid = true;
     console.log(radio);
    }
  }
  if(!valid){
  var element = document.getElementById(name+'Label');
  element.classList.add("invalid");
  element.innerHTML += "Please select an option";
  return false;
  }
  return true;
}

function validateInputField(name){
  console.log(name);
  var element = document.getElementById(name);
  var value = element.value;
  console.log(value);
  if (!(value >= 0) || value == ""){
    element.classList.add("invalid");
    element.classList.add("invalid");
    var label = document.getElementById(name+'Label').innerHTML;
    document.getElementById(name+'Label').innerHTML = label + " \n Enter a valid number";
     return false;
  }
  // Ensures all inputs are validated 
  // Select element, if valid fine if not add invalid class to element 
  // Add styling for invalid class in css, return false, if any invalid 
  // return true if all valid 
  return true;
}

function validate(){
  // iterates through all input types and validates 
  
  // Input feild types
  const inputIDs = ['CommuterMiles','electricBill','gasBill','oilBill','lessThanFour','moreThanFour']
  for (let i = 0; i < inputIDs.length; i++) {
    if (!validateInputField(inputIDs[i])){
      console.log('invalid');
      return false;
    }
  } 

  //  Radio button validation 
  const radioIDs = ['transport','metal','paper','diet','fastFood'];
  const radioOptions = [4,2,2,3,3];
  for (let i = 0; i < radioIDs.length; i++) {
    if (!validateRadioButtons(radioIDs[i],radioOptions[i])){
      console.log('invalid');
      return false;
    }
  }
  return true;
}

function drawChart(data){
  // Using get started exmaple form chart.js
  
const ctx = document.getElementById('myChart');

// Values to be changed once form completed. 
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Travel', 'Energy', 'Flights', 'Recycling','Diet'],
    datasets: [{
      label: '%BreakdownOfEmissions',
      data: data,
      borderWidth: 1
    }]
  }
});
}

function drawLifeTimeUsage(emissions){
  // Function takes yearly usage, and plots lifetime emissons 
 

const ctx = document.getElementById('lineChart');

// Values to be changed once form completed. 
new Chart(ctx, {
  type: 'line',
  options: {
    scales: {
      y: {
        title: {
          display: true,
          text: 'Emissions (Tonnes of CO2)'
        }
      },
      x:{
        title: {
          display: true,
          text: 'Years'
        }
      }     
    }
  }, data: {
    labels: ['1', '10', '20', '30', '40', '50', '60','70','80','90','100'],
    datasets: [{
      label: 'Emissions Over Time ',
      data: [1*emissions,10*emissions,20*emissions,30*emissions,40*emissions,50*emissions,60*emissions,70*emissions,80*emissions,90*emissions,100*emissions],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
  });

};

