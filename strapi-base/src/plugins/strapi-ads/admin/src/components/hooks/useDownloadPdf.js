import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useDownloadPdf = () => {
  const downloadPdf = useCallback(async (ref, filename = 'report.pdf', targetSizeMB = 2) => {
    if (!ref?.current) return;

    const targetSizeBytes = targetSizeMB * 1024 * 1024;

    // Start with lower scale for smaller file size
    let scale = 1.5;
    let quality = 0.8;
    let pdfBlob = null;

    // Iteratively reduce quality/scale until under target size
    while (scale >= 0.5 && quality >= 0.3) {
      const canvas = await html2canvas(ref.current, {
        scale,
        useCORS: true,
        logging: false,
      });

      // Use JPEG instead of PNG for better compression
      const imgData = canvas.toDataURL('image/jpeg', quality);

      // Standard A4 size in px at 72dpi
      const pdfWidth = 595;
      const pdfHeight = 842;

      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Calculate number of pages needed
      const pageCount = Math.ceil(imgHeight / pdfHeight);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        compress: true,
      });

      // Add image across multiple pages if needed
      let yOffset = 0;
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, imgWidth, imgHeight, undefined, 'FAST');
        yOffset += pdfHeight;
      }

      // Get PDF as blob to check size
      pdfBlob = pdf.output('blob');

      if (pdfBlob.size <= targetSizeBytes) {
        pdf.save(filename);
        return;
      }

      // Reduce quality first, then scale
      if (quality > 0.3) {
        quality -= 0.1;
      } else {
        quality = 0.8;
        scale -= 0.25;
      }
    }

    // If still over size, save anyway with lowest settings
    const canvas = await html2canvas(ref.current, {
      scale: 0.5,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.3);
    const pdfWidth = 595;
    const pdfHeight = 842;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(filename);
  }, []);

  return downloadPdf;
};

export default useDownloadPdf;
