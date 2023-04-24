

    // ==============================
    // Zona Api Key
    // ==============================
CallApiOpenAI = () => {
    // Open form for API Key
    openAPIForm = () => {
        const openAPIForm = document.querySelector('.menu-user .hidden');
        const btnApi = document.querySelector('#btn-api');

        btnApi.addEventListener('click', () => {
            openAPIForm.classList.contains('hidden')? openAPIForm.classList.remove('hidden') : openAPIForm.classList.add('hidden')
        });
    }
    openAPIForm();

    // Cargar la clave API si está disponible
    const audioFileInput = document.getElementById("audioFile");
    const transcribeButton = document.getElementById("transcribeButton");
    const transcriptText = document.getElementById("transcriptText");
    const saveButton = document.getElementById("saveButton");
    const apiForm = document.getElementById("apiForm");

    let openaiApiKey;

    const customUploadButton = document.getElementById("customUploadButton");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

    customUploadButton.addEventListener("click", () => {
        audioFileInput.click();
    });

    audioFileInput.addEventListener("change", () => {
        const file = audioFileInput.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
        } else {
            fileNameDisplay.textContent = "Ningún archivo seleccionado";
        }
    });


    // Guardar y cargar API Key desde el almacenamiento local
    apiForm.addEventListener("submit", (event) => {
        event.preventDefault();
        openaiApiKey = document.getElementById("apiKey").value;

        if (openaiApiKey) {
            // Almacenar la clave API junto con un timestamp
            const storedApiKeyData = {
                key: openaiApiKey,
                timestamp: Date.now(),
            };
            localStorage.setItem("whisper_api_key", JSON.stringify(storedApiKeyData));
            transcribeButton.disabled = false;
            audioFileInput.disabled = false;
        } else {
            transcribeButton.disabled = true;
            audioFileInput.disabled = true;
        }
    });

    // Cargar la clave API si está disponible
    document.addEventListener("DOMContentLoaded", () => {
        const storedApiKeyData = JSON.parse(localStorage.getItem("whisper_api_key"));
        if (storedApiKeyData) {
            const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
            const currentTime = Date.now();

            if (currentTime - storedApiKeyData.timestamp <= twoDaysInMilliseconds) {
                document.getElementById("apiKey").value = storedApiKeyData.key;
                openaiApiKey = storedApiKeyData.key;
                transcribeButton.disabled = false;
                audioFileInput.disabled = false;
            }         } else {
                // Eliminar la clave API si han pasado más de 2 días
                localStorage.removeItem("whisper_api_key");
            }
        }
    );



    document.addEventListener("DOMContentLoaded", () => {
    const storedApiKey = localStorage.getItem("whisper_api_key");
    if (storedApiKey) {
        document.getElementById("apiKey").value = storedApiKey;
        openaiApiKey = storedApiKey;
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
            "Authorization": `Bearer ${openaiApiKey}`,
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
}
CallApiOpenAI();
