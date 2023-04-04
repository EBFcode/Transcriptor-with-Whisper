let apiKey = null;
transcribeButton.disabled = true;
audioFileInput.disabled = true;


const ENDPOINT = "https://api.openai.com/v1/audio/transcriptions";
const audioFileInput = document.getElementById("audioFile");
const transcribeButton = document.getElementById("transcribeButton");
const transcriptText = document.getElementById("transcriptText");
const saveButton = document.getElementById("saveButton");

const apiForm = document.getElementById("apiForm");

apiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    apiKey = document.getElementById("apiKey").value;
    
    if (apiKey) {
        transcribeButton.disabled = false;
        audioFileInput.disabled = false;
    } else {
        transcribeButton.disabled = true;
        audioFileInput.disabled = true;
    }
});


audioFileInput.addEventListener("change", () => {
if (audioFileInput.files.length > 0) {
    transcribeButton.disabled = false;
} else {
    transcribeButton.disabled = true;
}
});

transcribeButton.addEventListener("click", async () => {
transcriptText.value = "Transcribiendo, por favor espera...";
transcribeButton.disabled = true;
saveButton.disabled = true;

try {
    const formData = new FormData();
    formData.append("file", audioFileInput.files[0]);
    formData.append("model", "whisper-1");

    const response = await axios.post(ENDPOINT, formData, {
    headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "multipart/form-data",},
    });

    if (response.status === 200) {
        transcriptText.value = response.data.text;
        } else {
        transcriptText.value = `Error al transcribir el archivo de audio. Código de estado: ${response.status}\n\nRespuesta: ${response.statusText}`;
        }
    } catch (error) {
        transcriptText.value = `Error al transcribir el archivo de audio. Error: ${error.message}`;
    } finally {
        transcribeButton.disabled = false;
        saveButton.disabled = false;
    }
    });

saveButton.addEventListener("click", () => {
    const textToSave = transcriptText.value;
    const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transcripcion.txt";
    link.click();

    URL.revokeObjectURL(url);
});

