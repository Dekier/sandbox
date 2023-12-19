import { Object3D } from "three";
import { Color, MeshLambertMaterial } from "three";
export const useCanvas = () => {
  const calculatePixelPercentage = (pixelData, targetColor) => {
    let totalPixels = 0;
    let targetPixels = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      // Pixel data is stored in RGBA format (4 values per pixel)
      const red = pixelData[i];
      const green = pixelData[i + 1];
      const blue = pixelData[i + 2];
      const alpha = pixelData[i + 3];

      // Check if the pixel is not fully transparent
      if (alpha > 0) {
        // Assuming targetColor is either "#000000" (black) or "#FFFFFF" (white)
        const isTargetColor =
          (targetColor === "#000000" &&
            red === 0 &&
            green === 0 &&
            blue === 0) ||
          (targetColor === "#FFFFFF" &&
            red === 255 &&
            green === 255 &&
            blue === 255);

        if (isTargetColor) {
          targetPixels++;
        }
      }

      totalPixels++;
    }

    return (targetPixels / totalPixels) * 100;
  };

  const draw = (drawContext, x, y, drawStartPos) => {
    drawContext.fillStyle = "#000000";
    drawContext.beginPath();
    drawContext.arc(x, y, 3, 0, 3 * Math.PI);
    drawContext.fill();
    drawContext.strokeStyle = "#000000";
    drawContext.beginPath();
    drawContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawContext.lineTo(x, y);
    drawContext.stroke();
    drawStartPos.set(x, y);
  };

  return { calculatePixelPercentage, draw };
};
