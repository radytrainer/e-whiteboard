import { jsPDF } from 'jspdf';

/**
 * Export the Konva Stage to a PDF file
 */
export const exportPDF = (stage, options = {}) => {
  if (!stage) return;

  const { fileName = 'whiteboard.pdf', multiPage = false } = options;

  // Capture canvas dataURL
  const dataURL = stage.toDataURL({
    pixelRatio: 1.5,
    mimeType: 'image/png',
  });

  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    const stageWidth = img.width;
    const stageHeight = img.height;

    // Standard A4 dimensions
    const isLandscape = stageWidth >= stageHeight;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    if (!multiPage) {
      // Single Page: Scale the entire stage to fit A4 page
      const ratio = Math.min(pdfWidth / stageWidth, pdfHeight / stageHeight);
      const imgWidth = stageWidth * ratio;
      const imgHeight = stageHeight * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(dataURL, 'PNG', x, y, imgWidth, imgHeight);
    } else {
      // Multi Page: Slice vertical canvas height into 3 separate pages (A4)
      const pageCount = 3;
      const sliceHeight = stageHeight / pageCount;

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Create a temporary canvas to crop the image section
        const canvas = document.createElement('canvas');
        canvas.width = stageWidth;
        canvas.height = sliceHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            img,
            0,
            i * sliceHeight,
            stageWidth,
            sliceHeight,
            0,
            0,
            stageWidth,
            sliceHeight
          );

          const slicedDataURL = canvas.toDataURL('image/png');

          // Fit this slice on the current page
          const ratio = Math.min(pdfWidth / stageWidth, pdfHeight / sliceHeight);
          const imgWidth = stageWidth * ratio;
          const imgHeight = sliceHeight * ratio;
          const x = (pdfWidth - imgWidth) / 2;
          const y = (pdfHeight - imgHeight) / 2;

          pdf.addImage(slicedDataURL, 'PNG', x, y, imgWidth, imgHeight);
        }
      }
    }

    pdf.save(fileName);
  };
};
