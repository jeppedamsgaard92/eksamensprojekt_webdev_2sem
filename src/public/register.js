async function insertCsrfToken() {
  const response = await fetch("/csrf", {
    credentials: "include",
  });

  const data = await response.json();

  document.querySelector("#csrfInput").value = data.csrfToken;
}

insertCsrfToken();