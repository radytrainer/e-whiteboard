/**
 * Export the Konva Stage as a PNG image
 */
export const exportPNG = (stage, options = {}) => {
  if (!stage) return;

  const { transparent = false, fileName = 'whiteboard.png' } = options;

  // Find background shapes
  const backgroundRect = stage.findOne('.canvas-background');
  const gridPattern = stage.findOne('.canvas-grid-pattern');

  // Save original visibility
  const originalBgVisible = backgroundRect ? backgroundRect.visible() : true;
  const originalGridVisible = gridPattern ? gridPattern.visible() : true;

  // Toggle visibility for transparent export
  if (transparent) {
    if (backgroundRect) backgroundRect.visible(false);
    if (gridPattern) gridPattern.visible(false);
  }

  // Get data URL of stage
  // We can calculate the bounding box of all objects, or just export the visible screen
  const dataURL = stage.toDataURL({
    pixelRatio: 2, // High resolution scale
    mimeType: 'image/png',
  });

  // Restore visibility
  if (transparent) {
    if (backgroundRect) backgroundRect.visible(originalBgVisible);
    if (gridPattern) gridPattern.visible(originalGridVisible);
  }

  // Trigger download
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
