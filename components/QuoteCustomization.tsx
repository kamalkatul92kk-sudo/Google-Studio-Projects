import React from 'react';
import { QuoteOptions } from '../types';

interface QuoteCustomizationProps {
  options: QuoteOptions;
  onOptionsChange: (newOptions: QuoteOptions) => void;
  disabled: boolean;
}

const MATERIALS = ['Aluminum 6061-T6', 'Stainless Steel 304', 'ABS Plastic', 'Titanium Grade 5', 'PEEK'];
const FINISHES = ['As Machined', 'Bead Blast', 'Anodized (Clear)', 'Anodized (Black)', 'Polished'];
const LEAD_TIMES = ['Standard (2 Weeks)', 'Expedited (1 Week)', 'Rush (3 Days)'];

const QuoteCustomization: React.FC<QuoteCustomizationProps> = ({ options, onOptionsChange, disabled }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onOptionsChange({
      ...options,
      [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-8 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Customize Your Quote</h3>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <InputField label="Quantity" name="quantity" type="number" value={options.quantity.toString()} onChange={handleChange} disabled={disabled} min={1} />
        <SelectField label="Material" name="material" value={options.material} options={MATERIALS} onChange={handleChange} disabled={disabled} />
        <SelectField label="Finish" name="finish" value={options.finish} options={FINISHES} onChange={handleChange} disabled={disabled} />
        <SelectField label="Lead Time" name="leadTime" value={options.leadTime} options={LEAD_TIMES} onChange={handleChange} disabled={disabled} />
      </div>
    </div>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    min?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type, value, onChange, disabled, min }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={min}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, options, onChange, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default QuoteCustomization;
