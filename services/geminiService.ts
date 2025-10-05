
// This is a mock service. In a real application, you would import and use the @google/genai library here.
// import { GoogleGenAI } from "@google/genai";

// Utility function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is in format "data:image/jpeg;base64,..."
            // we only need the part after the comma
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
};


export const analyzeNotes = async (imageFile: File): Promise<string> => {
    console.log("Analyzing notes with Gemini...");
    
    // In a real app, this would be your API key from process.env.API_KEY
    // const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
    
    // Convert image to base64 for the API call
    const base64Image = await fileToBase64(imageFile);
    
    const prompt = "Analyze this image of student notes. Summarize the key topics and list 3-5 important keywords or concepts mentioned. Present the output in a clear, concise format.";

    /*
    // --- REAL GEMINI API CALL (for reference) ---
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { 
            parts: [
                {
                    inlineData: {
                        mimeType: imageFile.type,
                        data: base64Image,
                    },
                },
                { text: prompt }
            ] 
        },
    });
    return response.text;
    */

    // --- MOCK API RESPONSE ---
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResponse = `
### Ringkasan Catatan
Catatan ini membahas tentang sistem peredaran darah pada manusia. Topik utamanya adalah fungsi jantung sebagai pemompa darah, perbedaan antara pembuluh arteri dan vena, serta komposisi darah yang terdiri dari plasma, sel darah merah, sel darah putih, dan keping darah.

### Kata Kunci
-   Jantung
-   Arteri & Vena
-   Plasma Darah
-   Sel Darah Merah (Eritrosit)
-   Sirkulasi Ganda
            `;
            resolve(mockResponse.trim());
        }, 2500);
    });
};
