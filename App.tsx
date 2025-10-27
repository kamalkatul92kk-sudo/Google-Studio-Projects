import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import QuoteDisplay from './components/QuoteDisplay';
import Loader from './components/Loader';
import QuoteCustomization from './components/QuoteCustomization';
import { generateQuote } from './services/geminiService';
import { Quote, QuoteOptions } from './types';

// Debounce hook to delay API calls while user is typing/selecting options
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [quoteOptions, setQuoteOptions] = useState<QuoteOptions>({
    quantity: 1,
    material: 'Aluminum 6061-T6',
    finish: 'As Machined',
    leadTime: 'Standard (2 Weeks)',
  });

  const debouncedQuoteOptions = useDebounce(quoteOptions, 750);

  useEffect(() => {
    if (!file) {
      return;
    }

    const getQuote = async () => {
      setIsLoading(true);
      setError(null);
      // Do not clear previous quote, so it remains visible while loading

      try {
        const generatedQuote = await generateQuote(file, debouncedQuoteOptions, quote);
        setQuote(generatedQuote);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getQuote();
  }, [file, debouncedQuoteOptions]);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setQuote(null); // Clear old quote when new file is uploaded
    setError(null);
  };

  const clearFile = () => {
    setFile(null);
    setQuote(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            AI Machinist Quote Generator
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
            Get an instant, AI-powered manufacturing estimate for your 3D models.
          </p>
        </header>

        <div className="w-full max-w-2xl mx-auto space-y-6">
          <FileUpload
            onFileChange={handleFileChange}
            file={file}
            clearFile={clearFile}
            disabled={isLoading && !quote} // Only disable upload when initially loading
          />
        </div>

        <div className="mt-4">
          {file && (
            <>
              <QuoteCustomization
                options={quoteOptions}
                onOptionsChange={setQuoteOptions}
                disabled={isLoading}
              />
              <div className="mt-0">
                {isLoading && !quote && (
                  <div className="mt-8">
                    <Loader message="Our AI is analyzing your file and preparing a detailed quote. This may take a moment." />
                  </div>
                )}

                {error && (
                  <div className="max-w-4xl mx-auto mt-8 p-4 text-center bg-red-100 border border-red-300 text-red-800 rounded-lg">
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {quote && <QuoteDisplay quote={quote} isLoading={isLoading} />}
              </div>
            </>
          )}
        </div>

        {!file && (
          <div className="text-center mt-16 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-700">How It Works</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-bold text-blue-600">1. Upload Your CAD</p>
                <p className="text-sm text-gray-600 mt-1">Select or drag-and-drop your design file to get an initial quote.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-bold text-blue-600">2. Customize Options</p>
                <p className="text-sm text-gray-600 mt-1">Adjust quantity, material, finish, and lead time to see how they affect the price.</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="font-bold text-blue-600">3. Instant Quote</p>
                <p className="text-sm text-gray-600 mt-1">Your quote updates automatically, showing a detailed cost breakdown.</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AI Machinist Quote. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;