const output = document.querySelector("#output");

function value(id) {
  return document.querySelector(id).value;
}

function show(data) {
  output.textContent =
    typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

async function getCsrfToken() {
  const response = await fetch("/csrf", {
    credentials: "include",
  });

  const data = await response.json();
  return data.csrfToken;
}

async function api(path, options = {}) {
  const method = options.method || "GET";
  const headers = options.headers || {};

  if (!["GET", "HEAD"].includes(method)) {
    headers["x-csrf-token"] = await getCsrfToken();
  }

  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers,
  });

  const text = await response.text();

  try {
    show(JSON.parse(text));
  } catch {
    show(text);
  }
}

function jsonBody(data) {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

document.querySelector("#loginBtn").addEventListener("click", () => {
  api("/auth/login", {
    method: "POST",
    ...jsonBody({
      username: value("#loginUsername"),
      password: value("#loginPassword"),
    }),
  });
});

document.querySelector("#currentUserBtn").addEventListener("click", () => {
  api("/auth/user");
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
  api("/auth/logout", {
    method: "POST",
  });
});

document.querySelector("#createClientBtn").addEventListener("click", () => {
  const surveyId = value("#clientSurveyId").trim();

  const path = surveyId
    ? `/register/create-new-client-account/${surveyId}`
    : "/register/create-new-client-account";

  api(path, {
    method: "POST",
    ...jsonBody({
      name: value("#clientName"),
      email: value("#clientEmail"),
    }),
  });
});

document.querySelector("#getAllClientsBtn").addEventListener("click", () => {
  api("/clients/all-clients");
});

document.querySelector("#getClientBtn").addEventListener("click", () => {
  api(`/clients/client-info/${value("#clientId")}`);
});

document.querySelector("#deleteClientBtn").addEventListener("click", () => {
  api(`/clients/${value("#clientId")}`, {
    method: "DELETE",
  });
});

document.querySelector("#getSurveyQuestionsBtn").addEventListener("click", () => {
  api("/survey/survey-questions");
});

document.querySelector("#updateSurveyTemplateBtn").addEventListener("click", () => {
  api("/survey/new-survey", {
    method: "POST",
    ...jsonBody(JSON.parse(value("#newSurvey"))),
  });
});

document.querySelector("#createSurveyAnswerBtn").addEventListener("click", () => {
  api("/survey/survey-answers", {
    method: "POST",
    ...jsonBody(JSON.parse(value("#surveyAnswers"))),
  });
});

document.querySelector("#getAnsweredSurveysBtn").addEventListener("click", () => {
  api("/survey/answered-surveys");
});

document.querySelector("#deleteSurveyAnswerBtn").addEventListener("click", () => {
  api(`/survey/answered-survey/${value("#surveyId")}`, {
    method: "DELETE",
  });
});

document.querySelector("#createOnboardingBtn").addEventListener("click", () => {
  api(`/onboarding/${value("#onboardingUserId")}/onboarding`, {
    method: "POST",
    ...jsonBody(JSON.parse(value("#onboardingSlides"))),
  });
});

document.querySelector("#readMyOnboardingBtn").addEventListener("click", () => {
  api("/onboarding");
});

document.querySelector("#deleteOnboardingBtn").addEventListener("click", () => {
  api(`/onboarding/${value("#onboardingUserId")}/onboarding`, {
    method: "DELETE",
  });
});

document.querySelector("#sendInvitationBtn").addEventListener("click", () => {
  api(`/onboarding/send-register-invitation/${value("#onboardingUserId")}`, {
    method: "POST",
  });
});

document.querySelector("#updateProgressBtn").addEventListener("click", () => {
  api("/onboarding/onboarding-progress", {
    method: "POST",
    ...jsonBody(JSON.parse(value("#onboardingProgress"))),
  });
});

document.querySelector("#createYoutubeLinksBtn").addEventListener("click", () => {
  api("/onboarding/youtube-links", {
    method: "POST",
    ...jsonBody(JSON.parse(value("#youtubeLinks"))),
  });
});

document.querySelector("#readYoutubeLinksBtn").addEventListener("click", () => {
  api("/onboarding/youtube-links");
});

document.querySelector("#deleteYoutubeLinkBtn").addEventListener("click", () => {
  api(`/onboarding/youtube-link/${value("#youtubeLinkId")}`, {
    method: "DELETE",
  });
});

document.querySelector("#readPdfBtn").addEventListener("click", () => {
  api("/onboarding/pdf-slides");
});

document.querySelector("#deletePdfBtn").addEventListener("click", () => {
  api(`/onboarding/pdf-file/${encodeURIComponent(value("#pdfFilename"))}`, {
    method: "DELETE",
  });
});

document.querySelector("#updateOwnAccountBtn").addEventListener("click", () => {
  const body = {
    username: value("#reauthUsername"),
    password: value("#reauthPassword"),
  };

  if (value("#newUsername").trim()) {
    body.newUsername = value("#newUsername");
  }

  if (value("#newEmail").trim()) {
    body.email = value("#newEmail");
  }

  api("/account/me", {
    method: "PATCH",
    ...jsonBody(body),
  });
});

document.querySelector("#updateOwnPasswordBtn").addEventListener("click", () => {
  api("/account/me/password", {
    method: "PATCH",
    ...jsonBody({
      username: value("#reauthUsername"),
      password: value("#reauthPassword"),
      newPassword: value("#newPassword"),
      confirmNewPassword: value("#confirmNewPassword"),
    }),
  });
});

document.querySelector("#deleteOwnAccountBtn").addEventListener("click", () => {
  api("/account/me", {
    method: "DELETE",
    ...jsonBody({
      username: value("#reauthUsername"),
      password: value("#reauthPassword"),
    }),
  });
});