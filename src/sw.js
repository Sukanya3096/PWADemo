importScripts("./ngsw-worker.js");

//background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "post-data") {
    event.waitUntil(getDataAndSend());
  }
});

//get data from indexed db and send it to backend
function getDataAndSend() {
  let db;
  const request = indexedDB.open("my-db");
  request.onerror = (event) => {
    console.log("Cannot access indexed db!");
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    getData(db);
  };
}

function getData(db) {
  const transaction = db.transaction(["user-store"]);
  const objectStore = transaction.objectStore("user-store");
  const request = objectStore.getAll();
  request.onerror = (event) => {
    console.log("An error ocurred while fetching data");
  };
  request.onsuccess = (event) => {
    console.log(request.result);
    addData(request.result)
      .then(() => {
        // self.registration.showNotification("Post is added successfully");
        const transaction = db.transaction(["user-store"], "readwrite");
        const objectStore = transaction.objectStore("user-store");
        const request = objectStore.clear();

        request.onsuccess = (event) => {
          console.log("records are cleared.");
          Promise.resolve();
        };
        request.onerror = (event) => {
          console.log("An error ocurred while fetching data");
        };
      })
      .catch((err) => console.log(err));
  };
}

function addData(obj) {
  let data = obj.map((res) => JSON.parse(res));
  let arrObj = {
    data: data,
  };
  return fetch("http://localhost:3000/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arrObj),
  });
}
