import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Maximize2,
  Minimize2,
  Search
} from 'lucide-react';
import { useAppStore } from '../store';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, user } = useAppStore();
  const book = books.find(b => b.id === id);
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent right-click for premium content
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (book?.isPremium) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [book]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Book not found</p>
      </div>
    );
  }

  // Check if user has access
  const hasAccess = book.isFree || user?.isPremium || (!book.isPremium);
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This content is only available for premium users
          </p>
          <button 
            onClick={() => navigate('/premium')}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col"
    >
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} />
            </button>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              {book.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={() => setScale(s => Math.min(2, s + 0.1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ZoomIn size={20} />
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4">
          <Document
            file={`/books/${id}.pdf`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-xl"
              renderTextLayer={!book.isPremium}
              renderAnnotationLayer={!book.isPremium}
            />
          </Document>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
              disabled={pageNumber >= (numPages || 0)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={(e) => setPageNumber(Math.min(numPages || 1, Math.max(1, parseInt(e.target.value))))}
                className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;