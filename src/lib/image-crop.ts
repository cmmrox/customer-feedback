function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

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
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = outputWidth ?? pixelCrop.width;
  cropCanvas.height = outputHeight ?? pixelCrop.height;

  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) {
    throw new Error("Could not create crop canvas context");
  }

  cropCtx.fillStyle = "#ffffff";
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

  cropCtx.drawImage(
    canvas,
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
