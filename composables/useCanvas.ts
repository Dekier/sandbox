import { Object3D } from "three";
import { Color, MeshLambertMaterial } from "three";
export const useCanvas = () => {
  const calculatePixelPercentage = (pixelData, targetColor) => {
    let totalPixels = 0;
    let targetPixels = 0;

    const isGrayColor = (red, green, blue) => red === green && green === blue;

    for (let i = 0; i < pixelData.length; i += 4) {
      // Pixel data is stored in RGBA format (4 values per pixel)
      const red = pixelData[i];
      const green = pixelData[i + 1];
      const blue = pixelData[i + 2];
      const alpha = pixelData[i + 3];

      // Check if the pixel is not fully transparent
      if (alpha > 0) {
        // Assuming targetColor is either "#000000" (black), "#FFFFFF" (white), or "#808080" (gray)
        const isTargetColor =
          (targetColor === "#000000" &&
            red === 0 &&
            green === 0 &&
            blue === 0) ||
          (targetColor === "#FFFFFF" &&
            red === 255 &&
            green === 255 &&
            blue === 255) ||
          (targetColor === "#808080" && isGrayColor(red, green, blue));

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
    drawContext.arc(x, y, 2, 0, 2 * Math.PI);
    drawContext.fill();
    drawContext.strokeStyle = "#000000";
    drawContext.beginPath();
    drawContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawContext.lineTo(x, y);
    drawContext.stroke();
    drawStartPos.set(x, y);
  };

  const drawDots = async (positions, drawContext) => {
    for (let i = 0; i < positions.length; i++) {
      const offsetX = 200 / 2;
      const offsetY = 200 / 2;

      for (let i = 0; i < positions.length; i++) {
        const x = positions[i].positionX + offsetX;
        const y = positions[i].positionZ + offsetY;
        drawContext.fillStyle = "#000000";
        await drawContext.beginPath();
        await drawContext.arc(x, y, 0 + positions[i].scale, 0, 2 * Math.PI);
        await drawContext.fill();
      }
    }
  };

  return { calculatePixelPercentage, draw, drawDots };
};
