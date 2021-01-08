const deleteAll = document.querySelector("#delete-all");

deleteAll.addEventListener("click", () => {
  fetch("/api", {
    method: "DELETE",
  }).then(() => {
    console.log("All posts deleted");
  });
});
