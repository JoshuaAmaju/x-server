const deletePost = document.querySelector("#delete");

deletePost.addEventListener("click", () => {
  const id = deletePost.getAttribute("data-id");

  fetch("/api/" + id, { method: "DELETE" });
});
