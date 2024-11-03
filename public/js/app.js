let authToken = null;

// Authentication Form Handler
document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
      const authStatus = document.getElementById("authStatus");
      authStatus.textContent = "Successfully authenticated!";
      authStatus.style.display = "block";
      authStatus.className = "alert success";
      document.getElementById("encryptForm").style.display = "block";
      document.getElementById("decryptForm").style.display = "block";
    }
  } catch (error) {
    const authStatus = document.getElementById("authStatus");
    authStatus.textContent = "Authentication failed. Please try again.";
    authStatus.style.display = "block";
    authStatus.className = "alert error";
  }
});

// Encryption Form Handler
document.getElementById("encryptForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!authToken) {
    showResult("Please authenticate first");
    return;
  }

  const data = document.getElementById("dataToEncrypt").value;
  const loadingElement = document.getElementById("encryptLoading");
  const timerElement = document.getElementById("encryptTimer");
  const timeResultElement = document.getElementById("encryptTimeResult");
  const finalTimeElement = document.getElementById("encryptFinalTime");
  let startTime;

  try {
    // Show loading indicator and hide previous time result
    loadingElement.style.display = "flex";
    timeResultElement.style.display = "none";
    startTime = Date.now();

    // Start timer update
    const timerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      timerElement.textContent = `${elapsed}s`;
    }, 100);

    const response = await fetch("/api/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: authToken, data }),
    });
    const result = await response.json();

    // Calculate final time and display it
    const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    clearInterval(timerInterval);
    loadingElement.style.display = "none";
    finalTimeElement.textContent = finalTime;
    timeResultElement.style.display = "flex";

    // Show results and update content
    document.querySelector(".results").style.display = "block";
    document.getElementById("encryptedResult").textContent =
      result.encryptedData;
  } catch (error) {
    loadingElement.style.display = "none";
    timeResultElement.style.display = "none";
    document.querySelector(".results").style.display = "none";
    document.getElementById("encryptedResult").textContent =
      "Encryption failed: " + error.message;
  }
});

// Decryption Form Handler
document.getElementById("decryptForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!authToken) {
    showResult("Please authenticate first");
    return;
  }

  const data = document.getElementById("dataToDecrypt").value;
  const loadingElement = document.getElementById("decryptLoading");
  const timerElement = document.getElementById("decryptTimer");
  const timeResultElement = document.getElementById("decryptTimeResult");
  const finalTimeElement = document.getElementById("decryptFinalTime");
  const resultsElement = document.querySelector("#decryptForm .results");
  let startTime;

  try {
    // Show loading indicator and hide previous time result
    loadingElement.style.display = "flex";
    timeResultElement.style.display = "none";
    resultsElement.style.display = "none";
    startTime = Date.now();

    // Start timer update
    const timerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      timerElement.textContent = `${elapsed}s`;
    }, 100);

    const response = await fetch("/api/decrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: authToken, encryptedData: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Calculate final time and display it
    const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    clearInterval(timerInterval);
    loadingElement.style.display = "none";
    finalTimeElement.textContent = finalTime;
    timeResultElement.style.display = "flex";

    // Show results and update content
    resultsElement.style.display = "block";
    document.getElementById("decryptedResult").textContent =
      result.decryptedData;
  } catch (error) {
    loadingElement.style.display = "none";
    timeResultElement.style.display = "none";
    resultsElement.style.display = "block";
    document.getElementById("decryptedResult").textContent =
      "Decryption failed: " + error.message;
  }
});

function showResult(message) {
  document.getElementById("decryptedResult").textContent = message;
}

function startTimer(timerId) {
  const timerElement = document.getElementById(timerId);
  const startTime = Date.now();

  return setInterval(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    timerElement.textContent = `${elapsedTime.toFixed(1)}s`;
  }, 100);
}

async function handleEncrypt(event) {
  event.preventDefault();

  const loadingElement = document.getElementById("encryptLoading");
  loadingElement.style.display = "flex";

  const timerId = setInterval(() => startTimer("encryptTimer"));

  try {
    // Your encryption logic here
    await encryptData();
  } finally {
    loadingElement.style.display = "none";
    clearInterval(timerId);
  }
}

document.getElementById("copyButton").addEventListener("click", async () => {
  const encryptedResult =
    document.getElementById("encryptedResult").textContent;
  try {
    await navigator.clipboard.writeText(encryptedResult);
    const button = document.getElementById("copyButton");
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = "Copy";
    }, 1000);
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
});

document
  .getElementById("decryptCopyButton")
  .addEventListener("click", async () => {
    const decryptedResult =
      document.getElementById("decryptedResult").textContent;
    try {
      await navigator.clipboard.writeText(decryptedResult);
      const button = document.getElementById("decryptCopyButton");
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  });
