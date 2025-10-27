import { GoogleGenAI, Type } from "@google/genai";
import { Quote, QuoteOptions } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        partName: { type: Type.STRING },
        material: { type: Type.STRING },
        manufacturingProcess: { type: Type.STRING },
        finish: { type: Type.STRING },
        costBreakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING },
                    cost: { type: Type.NUMBER },
                },
                required: ['item', 'cost'],
            },
        },
        totalCost: { type: Type.NUMBER },
        leadTime: { type: Type.STRING },
        assumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    required: [
        'partName',
        'material',
        'manufacturingProcess',
        'finish',
        'costBreakdown',
        'totalCost',
        'leadTime',
        'assumptions'
    ],
};


export const generateQuote = async (file: File, options: QuoteOptions, previousQuote: Quote | null = null): Promise<Quote> => {
    const model = 'gemini-2.5-flash';
    let prompt: string;

    if (previousQuote) {
        // Use a faster, context-aware prompt for updates
        prompt = `
        You are an expert CNC machinist and cost estimator.
        A user is updating a manufacturing quote for a part named "${previousQuote.partName}".

        The previous quote was:
        ${JSON.stringify(previousQuote, null, 2)}

        The new user requirements are:
        - Quantity: ${options.quantity}
        - Material: ${options.material}
        - Finish: ${options.finish}
        - Desired Lead Time: ${options.leadTime}

        Please provide an updated quote reflecting ONLY the changes in the new requirements.
        The part geometry and complexity remain the same. Your calculations should be logical adjustments based on the changes. For example:
        - A change in quantity should affect per-unit cost by amortizing 'Setup Costs' and scaling 'Material Costs'.
        - A change in material should affect 'Material Costs' and potentially 'Machining Costs'.
        - A change in finish should affect 'Finishing Costs'.
        - A shorter lead time should add or increase an 'Expedite Fee'.

        The final output must be a valid JSON object that strictly adheres to the provided schema, reflecting the updated costs and parameters.
        `;
    } else {
        // Use the detailed, initial prompt for the first generation
        prompt = `
        You are an expert CNC machinist and advanced manufacturing cost estimator.
        A user has uploaded a CAD file and specified the following requirements:
        - File Name: ${file.name}
        - File Size: ${(file.size / 1024).toFixed(2)} KB
        - File Type: ${file.type || 'unknown'}
        - Quantity: ${options.quantity}
        - Material: ${options.material}
        - Finish: ${options.finish}
        - Desired Lead Time: ${options.leadTime}

        Based on this information, generate a detailed manufacturing quote.
        Because you cannot see the file's geometry, make reasonable assumptions for a moderately complex part that could fit within a 15cm x 10cm x 5cm bounding box.
        
        Your cost estimation should realistically reflect the specified quantity, material, finish, and lead time.
        - Higher quantities should have a lower per-unit cost due to amortization of setup costs.
        - Exotic materials (like Titanium or PEEK) should be more expensive than common ones (like Aluminum or ABS).
        - Finishes like anodizing add cost over an 'As Machined' finish.
        - Shorter lead times should incur expedite fees.
        
        Produce a realistic quote that includes setup costs, material costs, machining time costs, and a finishing cost. The 'leadTime' in the response should reflect what is achievable for the request, which may differ from the user's desired lead time.
        The final output must be a valid JSON object that strictly adheres to the provided schema.
        `;
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const quoteData = JSON.parse(jsonText);
        
        // Basic validation to ensure the parsed object matches the Quote structure
        if (!quoteData.partName || !Array.isArray(quoteData.costBreakdown)) {
            throw new Error("AI response is not in the expected format.");
        }
        
        return quoteData as Quote;

    } catch (error) {
        console.error("Error generating quote from Gemini API:", error);
        throw new Error("Failed to generate quote. The AI model may be temporarily unavailable.");
    }
};