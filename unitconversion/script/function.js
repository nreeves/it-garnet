function calculate() {
    // Clear previous error messages
    clearError();
  
    // Fetch input values
    var fromValue = document.getElementById('from-value').value;
    var fromUnits = getSelectedUnit('from-unit');
    var toUnits = getSelectedUnit('to-unit');
  
    // Validate input
    if (!fromValue || isNaN(fromValue)) {
      displayError("Please enter a numeric value for From Value.");
      return;
    }
    if (!fromUnits) {
      displayError("Please select From Unit for conversion.");
      return;
    }
    if (!toUnits) {
      displayError("Please select To Unit for conversion.");
      return;
    }
  
    // Make AJAX call
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          document.getElementById('result').innerText = xhr.responseText;
        } else {
          displayError("Error: " + xhr.status);
        }
      }
    };
  
    // Construct URL for conversion
    var url = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";
    url += "?FromValue=" + encodeURIComponent(fromValue);
    url += "&FromUnit=" + encodeURIComponent(fromUnits);
    url += "&ToUnit=" + encodeURIComponent(toUnits);
  
    xhr.open("GET", url, true);
    xhr.send();
  }
  
  function clearForm() {
    document.getElementById('from-value').value = "";
    document.getElementById('from-unit').checked = false;
    document.getElementById('to-unit').checked = false;
    document.getElementById('result').innerText = "";
  
    clearError();
  }
  
  function getSelectedUnit(unitType) {
    var units = document.getElementsByName(unitType);
    for (var i = 0; i < units.length; i++) {
      if (units[i].checked) {
        return units[i].value;
      }
    }
    return null;
  }
  
  function displayError(message) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
  }
  
  function clearError() {
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerText = "";
  }