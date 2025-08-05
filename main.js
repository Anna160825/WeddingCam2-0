const cloudName = "dpajidihc";
const uploadPreset = "WeddingCam";

let capturedBlob = null;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const uploadBtn = document.getElementById('upload');
const statusText = document.getElementById('status');

// Kamera starten
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    statusText.textContent = "Kamera-Fehler: " + err;
  });

// Foto machen
captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    capturedBlob = blob;
    uploadBtn.disabled = false;
    statusText.textContent = "📸 Foto bereit zum Hochladen.";
  }, 'image/jpeg');
});

// Upload zu Cloudinary
uploadBtn.addEventListener('click', async () => {
  if (!capturedBlob) return;

  const formData = new FormData();
  formData.append("file", capturedBlob);
  formData.append("upload_preset", uploadPreset);
  formData.append("tags", "weddingcam"); // 🟢 Hier wird das Tag gesetzt

  statusText.textContent = "⏳ Bild wird hochgeladen...";

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.secure_url) {
      statusText.textContent = "✅ Hochgeladen!";
      uploadBtn.disabled = true;

      // 👉 Hier kannst du das Bild direkt auf deiner Seite anzeigen lassen
      console.log("Bild-URL:", data.secure_url);
    } else {
      throw new Error("Kein Bild-URL erhalten");
    }
  } catch (err) {
    console.error("Fehler beim Upload:", err);
    statusText.textContent = "❌ Upload fehlgeschlagen.";
  }
});
