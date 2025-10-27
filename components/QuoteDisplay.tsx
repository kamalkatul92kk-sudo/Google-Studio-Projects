import React from 'react';
import { Quote } from '../types';
import { CheckCircleIcon } from './icons';
import Loader from './Loader';

interface QuoteDisplayProps {
  quote: Quote;
  isLoading?: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading = false }) => {
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 bg-white shadow-xl rounded-2xl overflow-hidden animate-fade-in">
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm">
                <Loader message="Updating quote with new options..." />
            </div>
        )}
        <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h2 className="text-2xl md:text-3xl font-bold">Manufacturing Quote</h2>
            <p className="mt-1 text-blue-200 truncate">For part: <span className="font-semibold">{quote.partName}</span></p>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard title="Material" value={quote.material} />
            <InfoCard title="Process" value={quote.manufacturingProcess} />
            <InfoCard title="Finish" value={quote.finish} />
            <InfoCard title="Lead Time" value={quote.leadTime} />
        </div>

        <div className="p-6 md:p-8 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
                <ul className="space-y-3">
                    {quote.costBreakdown.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">{item.item}</span>
                            <span className="font-semibold text-gray-800">{formatCurrency(item.cost)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center p-4 mt-4 bg-gray-100 rounded-lg">
                    <span className="text-lg font-bold text-gray-900">Total Cost</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(quote.totalCost)}</span>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Assumptions Made</h3>
                <ul className="space-y-3">
                    {quote.assumptions.map((assumption, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{assumption}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="px-6 py-4 md:px-8 md:py-5 bg-yellow-50 border-t border-yellow-200">
            <p className="text-xs text-yellow-800 text-center">
                This is an AI-generated estimate. Prices are indicative and subject to change upon detailed design review.
            </p>
        </div>
    </div>
  );
};

interface InfoCardProps {
    title: string;
    value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({title, value}) => (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
    </div>
);


export default QuoteDisplay;
