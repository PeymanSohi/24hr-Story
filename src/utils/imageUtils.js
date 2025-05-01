export function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = e => {
        img.src = e.target.result;
      };
  
      img.onload = () => {
        const MAX_WIDTH = 1080;
        const MAX_HEIGHT = 1920;
        let { width, height } = img;
  
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= scale;
          height *= scale;
        }
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
  
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  