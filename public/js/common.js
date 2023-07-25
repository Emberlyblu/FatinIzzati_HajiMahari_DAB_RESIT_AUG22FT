function sqlQuery1() {
  fetch("/vehicles/popular-types")
    .then((response) => response.text())
    .then((html) => {
      const vehicleList = document.querySelector(".list-group");
      while (vehicleList.firstChild) {
        vehicleList.removeChild(vehicleList.firstChild);
      }
      vehicleList.innerHTML = html;
    });
}

function sqlQuery2() {
  fetch("/vehicles/vehicles-requiring-service")
    .then((response) => response.text())
    .then((html) => {
      const vehicleList = document.querySelector(".list-group");
      while (vehicleList.firstChild) {
        vehicleList.removeChild(vehicleList.firstChild);
      }
      vehicleList.innerHTML = html;
    });
}

function sqlQuery3() {
  fetch("/vehicles/vehicles-with-cruise-control")
    .then((response) => response.text())
    .then((html) => {
      const vehicleList = document.querySelector(".list-group");
      while (vehicleList.firstChild) {
        vehicleList.removeChild(vehicleList.firstChild);
      }
      vehicleList.innerHTML = html;
    });
}

function sqlQuery4() {
  fetch("/vehicles/currently-rented-vehicles")
    .then((response) => response.text())
    .then((html) => {
      const vehicleList = document.querySelector(".list-group");
      while (vehicleList.firstChild) {
        vehicleList.removeChild(vehicleList.firstChild);
      }
      vehicleList.innerHTML = html;
    });
}

function allVehicles() {
  fetch("/vehicles/all")
    .then((response) => response.text())
    .then((html) => {
      const vehicleList = document.querySelector(".list-group");
      while (vehicleList.firstChild) {
        vehicleList.removeChild(vehicleList.firstChild);
      }
      vehicleList.innerHTML = html;
    });
}

function rentvehicle(id) {
  fetch(`/vehicles/rent/${id}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        alert("Vehicle rented successfully");
        window.location.reload();
      } else {
        alert("You've already rented a vehicle");
      }
    })
    .catch((error) => {
      console.error("Renting vehicle error:", error);
    });
}

function cancelrental(id) {
  fetch(`/vehicles/rent/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Vehicle rental cancelled successfully");
        window.location.reload();
      } else {
        response.text().then(alert);
      }
    })
    .catch((error) => {
      console.error("Canceling vehicle rental error:", error);
    });
}

async function updateFeature(id) {
  let newFeature = prompt("Update feature");
  if (newFeature == null || newFeature == "") {
    alert("You must enter a new feature!");
  } else {
    try {
      let response = await fetch(`/features/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFeature }),
      });

      let result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      window.location.href = "/features";
    } catch (error) {
      console.error("Updating feature error:", error);
    }
  }
}

function deleteFeature(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this feature? This cannot be undone."
  );
  if (!confirmed) {
    return;
  }
  fetch(`/features/delete/${id}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        alert("Feature deleted successfully");
        window.location.reload();
      } else {
        response.text().then((text) => {
          alert(text);
        });
      }
    })
    .catch((error) => {
      console.error("Deleting feature error:", error);
    });
}

async function updateType(typeId) {
  let newName = prompt("Please enter new type name", "New Type");

  if (newName == null || newName == "") {
    alert("You must enter a new name!");
  } else {
    try {
      let response = await fetch("/types/update/" + typeId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      let result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      location.reload();
    } catch (error) {
      console.error("Updating type error:", error);
    }
  }
}

function deleteType(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this type? This cannot be undone."
  );
  if (!confirmed) {
    return;
  }
  fetch(`/types/delete/${id}`, {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        alert("Type deleted successfully");
        window.location.reload();
      } else {
        response.text().then((text) => {
          alert(text);
        });
      }
    })
    .catch((error) => {
      console.error("Deleting type error:", error);
    });
}
