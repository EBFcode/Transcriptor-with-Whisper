const audioFileInput = document.getElementById("audioFile");
const transcribeButton = document.getElementById("transcribeButton");
const transcriptText = document.getElementById("transcriptText");
const saveButton = document.getElementById("saveButton");
const apiForm = document.getElementById("apiForm");

let apiKey;

// Guardar y cargar API Key desde el almacenamiento local
apiForm.addEventListener("submit", (event) => {
event.preventDefault();
apiKey = document.getElementById("apiKey").value;

if (apiKey) {
    localStorage.setItem("whisper_api_key", apiKey);
    transcribeButton.disabled = false;
    audioFileInput.disabled = false;
} else {
    transcribeButton.disabled = true;
    audioFileInput.disabled = true;
}
});

document.addEventListener("DOMContentLoaded", () => {
const storedApiKey = localStorage.getItem("whisper_api_key");
if (storedApiKey) {
    document.getElementById("apiKey").value = storedApiKey;
    apiKey = storedApiKey;
    transcribeButton.disabled = false;
    audioFileInput.disabled = false;
}
});

// Transcribir el archivo de audio
transcribeButton.addEventListener("click", async () => {
    transcriptText.value = "Transcribiendo, por favor espera...";
    transcribeButton.disabled = true;
    saveButton.disabled = true;

    try {
    const formData = new FormData();
    formData.append("file", audioFileInput.files[0]);
    formData.append("model", "whisper-1");

    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "multipart/form-data",
        },
    });

    transcriptText.value = response.data.text;
    } catch (error) {
    console.error("Error al transcribir el archivo de audio:", error);
    transcriptText.value = "Error al transcribir el archivo de audio.";
    }

    transcribeButton.disabled = false;
    saveButton.disabled = false;
});

// Guardar la transcripción en un archivo de texto
saveButton.addEventListener("click", () => {
    const blob = new Blob([transcriptText.value], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "transcriptorAI.txt");
});

