import requests
import json
from tkinter import Tk, Label, Button, filedialog, Text

API_KEY = "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"
ENDPOINT = "https://api.openai.com/v1/audio/transcriptions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "multipart/form-data",
}

class TranscriptorApp:
    def __init__(self, master):
        self.master = master
        master.title("Transcriptor de audio con Whisper")

        self.label = Label(master, text="Selecciona un archivo de audio (.mp3 o .m4a)")
        self.label.pack()

        self.select_button = Button(master, text="Seleccionar archivo", command=self.select_audio_file)
        self.select_button.pack()

        self.transcript_button = Button(master, text="Transcribir", command=self.transcribe_audio, state="disabled")
        self.transcript_button.pack()

        self.transcript_text = Text(master, wrap="word")
        self.transcript_text.pack()

        self.save_button = Button(master, text="Guardar transcripción", command=self.save_transcription, state="disabled")
        self.save_button.pack()

    def select_audio_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Audio files", "*.mp3"), ("Audio files", "*.m4a")])
        if file_path:
            self.set_audio_file(file_path)

    def set_audio_file(self, file_path):
        self.audio_file_path = file_path
        self.transcript_button["state"] = "normal"

    def transcribe_audio(self):
        if not hasattr(self, "audio_file_path"):
            return

        # Muestra un mensaje de carga en la ventana de la aplicación
        self.transcript_text.delete(1.0, "end")
        self.transcript_text.insert("insert", "Transcribiendo, por favor espera...")
        self.master.update()

        # Aquí va el código para realizar la transcripción usando Whisper
        with open(self.audio_file_path, "rb") as audio_file:
            files = {
                "file": audio_file,
            }
            response = requests.post(
                ENDPOINT,
                headers={
                    "Authorization": f"Bearer {API_KEY}"
                },
                data={
                    "model": "whisper-1"
                },
                files=files
            )

        if response.status_code == 200:
            print(response.json())
            json_response = response.json()
            print(json_response)
            transcription = json_response["text"]
        else:
            transcription = f"Error al transcribir el archivo de audio. Código de estado: {response.status_code}\n\nRespuesta: {response.text}"
            print(transcription)

        # Actualiza la ventana de la aplicación con la transcripción
        self.transcript_text.delete(1.0, "end")
        self.transcript_text.insert("insert", transcription)
        self.save_button["state"] = "normal"





    def save_transcription(self):
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text files", "*.txt")])
        if file_path:
            with open(file_path, "w") as text_file:
                text_file.write(self.transcript_text.get(1.0, "end"))

root = Tk()
app = TranscriptorApp(root)
root.mainloop()
