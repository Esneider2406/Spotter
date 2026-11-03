// Recorta la imagen en cuadrado y la reduce para que pese poco (JPEG ~320 px)
export function redimensionar(archivo, lado = 320) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) return reject(new Error('El archivo debe ser una imagen'));
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const min = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = lado;
      canvas.height = lado;
      canvas.getContext('2d').drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, lado, lado);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen. Prueba con un archivo JPG o PNG'));
    };
    img.src = url;
  });
}