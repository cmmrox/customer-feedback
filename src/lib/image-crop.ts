export async function getCroppedImg({
  imageSrc,
  pixelCrop,
  rotation = 0,
  outputWidth,
  outputHeight,
}: {
  imageSrc: string;
  pixelCrop: { x: number; y: number; width: number; height: number };
  rotation?: number;
  outputWidth?: number;
  outputHeight?: number;
}): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);
  ctx.drawImage(image, safeArea / 2 - image.width / 2, safeArea / 2 - image.height / 2);

  const imageData = ctx.getImageData(0, 0, safeArea, safeArea);

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = outputWidth ?? pixelCrop.width;
  cropCanvas.height = outputHeight ?? pixelCrop.height;

  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) {
    throw new Error("Could not create crop canvas context");
  }

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = safeArea;
  sourceCanvas.height = safeArea;
  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) {
    throw new Error("Could not create source canvas context");
  }

  sourceCtx.putImageData(imageData, 0, 0);
  cropCtx.drawImage(
    sourceCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height,
  );

  return cropCanvas.toDataURL("image/jpeg", 0.92);
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
