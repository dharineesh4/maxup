import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    // Set standard reliable worker from unpkg or cdnjs corresponding to installed pdfjs-dist version
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Failed to set pdfjs workerSrc:', e);
  }
}

export interface ParsedResumePDF {
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  pageCount: number;
  text: string;
  wordCount: number;
  characterCount: number;
}

/**
 * Format bytes to readable string (e.g., 245 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Fallback lightweight text extractor for PDF array buffers if worker/wasm fails
 */
function fallbackExtractPdfText(buffer: ArrayBuffer): string {
  try {
    const textDecoder = new TextDecoder('latin1');
    const raw = textDecoder.decode(buffer);
    const textPieces: string[] = [];

    // Match text blocks enclosed in BT ... ET or parenthesized strings
    const regex = /\(([^)]+)\)\s*T[jJ]/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      if (match[1] && match[1].length > 1) {
        textPieces.push(match[1].replace(/\\([()\\])/g, '$1'));
      }
    }

    if (textPieces.length > 10) {
      return textPieces.join(' ').replace(/\s+/g, ' ');
    }
  } catch (err) {
    console.error('Fallback PDF parser failed:', err);
  }
  return '';
}

/**
 * Parses an uploaded PDF File into cleaned raw text suitable for ATS analysis.
 * Uses the HTML5 File API and PDF.js text extraction.
 */
export async function parsePdfResume(
  file: File, 
  onProgress?: (progress: { stage: string; current: number; total: number }) => void
): Promise<ParsedResumePDF> {
  if (!file) {
    throw new Error('No file provided');
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('Invalid file format. Please upload a valid PDF document (.pdf).');
  }

  // 1. Read file as ArrayBuffer using HTML5 File API
  onProgress?.({ stage: 'Reading PDF file...', current: 1, total: 4 });
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  let fullText = '';
  let pageCount = 0;

  try {
    // 2. Load PDF document
    onProgress?.({ stage: 'Parsing PDF structure...', current: 2, total: 4 });
    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDoc = await loadingTask.promise;
    pageCount = pdfDoc.numPages;

    // 3. Extract text from each page preserving layout flow
    const pageTexts: string[] = [];
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      onProgress?.({ 
        stage: `Extracting text from page ${pageNum} of ${pageCount}...`, 
        current: pageNum, 
        total: pageCount 
      });

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageString = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const textItem = item as { str: string; transform: number[] };
          // If vertical position changed significantly, add newline
          const currentY = textItem.transform[5];
          if (lastY !== null && Math.abs(currentY - lastY) > 6) {
            pageString += '\n';
          } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
            pageString += ' ';
          }
          pageString += textItem.str;
          lastY = currentY;
        }
      }

      pageTexts.push(pageString.trim());
    }

    fullText = pageTexts.join('\n\n--- Page Break ---\n\n').trim();
  } catch (error) {
    console.warn('PDF.js worker/load encountered an error, trying fallback parser:', error);
    // Use fallback regex stream extractor
    fullText = fallbackExtractPdfText(arrayBuffer);
    pageCount = pageCount || 1;
  }

  if (!fullText || fullText.trim().length < 20) {
    throw new Error(
      'Could not extract readable text from this PDF. It may be an image-only scanned document or password-protected. Please ensure your PDF contains selectable text.'
    );
  }

  // Clean up excessive whitespace
  const cleanedText = fullText
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  const words = cleanedText.split(/\s+/).filter(Boolean);

  onProgress?.({ stage: 'Extraction complete', current: 4, total: 4 });

  return {
    fileName: file.name,
    fileSizeBytes: file.size,
    fileSizeFormatted: formatBytes(file.size),
    pageCount,
    text: cleanedText,
    wordCount: words.length,
    characterCount: cleanedText.length
  };
}
