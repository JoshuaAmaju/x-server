const form = document.querySelector("form");
const textarea = document.querySelector("textarea");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const post = textarea.value;

  fetch("/api/create", {
    method: "POST",
    body: JSON.stringify({ post }),
    headers: {
      "Content-Type": "application/json",
    },
  });
});
