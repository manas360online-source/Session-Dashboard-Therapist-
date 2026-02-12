import { GoogleGenAI } from "@google/genai";
import { Session, Patient } from '../types';

// NOTE: In a real production app, API calls should go through a backend to protect the key.
// For this demo, we assume process.env.API_KEY is available.

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSessionSummary = async (session: Session): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const prompt = `
      As a clinical assistant, summarize the following therapy session details into a concise, professional medical summary paragraph.
      Highlight the patient's condition, the intervention used, and the outcome/patient response.
      
      Patient Condition: ${session.patient.condition}
      Session Type: ${session.type}
      Status: ${session.status}
      Clinical Notes: ${session.clinicalNotes}
      Patient Responses: ${JSON.stringify(session.patientResponses)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the summary.";
  }
};

export const analyzeTrends = async (sessions: Session[]): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    try {
        const prompt = `
            Analyze these session records for a therapist. Identify key trends in patient attendance and mood based on the data.
            Keep it brief (max 3 bullet points).
            
            Data: ${JSON.stringify(sessions.map(s => ({ 
                status: s.status, 
                date: s.date, 
                mood: s.patientResponses.find(r => r.moodRating)?.moodRating 
            })))}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "No analysis available.";
    } catch (e) {
        return "Failed to analyze trends.";
    }
}

export const predictPatientOutcome = async (patient: Patient, sessions: Session[]): Promise<string> => {
    if (!apiKey) return "API Key missing. Cannot generate prediction.";

    try {
        // Prepare historical data for the model
        const history = sessions
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Chronological order
            .map(s => `Date: ${s.date.split('T')[0]}, Notes: ${s.clinicalNotes}, Mood: ${s.patientResponses.find(r=>r.moodRating)?.moodRating || 'N/A'}`)
            .join('\n');

        const prompt = `
            You are an advanced medical predictive model. Based on the patient's demographics and session history, predict the patient's condition trajectory.
            
            Patient: ${patient.name}, Age: ${patient.age}, Condition: ${patient.condition}
            
            Session History:
            ${history}

            Please provide a structured prediction in the following format (do not use Markdown bolding, just plain text headers):
            
            Short-Term Prognosis (3 Months): [Prediction]
            Long-Term Prognosis (6 Months): [Prediction]
            Risk Factors: [List key risks]
            Recommended Intervention Adjustment: [One key suggestion]
            Confidence Score: [High/Medium/Low] (Brief reason)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3, // Lower temperature for more analytical/conservative predictions
            }
        });

        return response.text || "Unable to generate prediction.";
    } catch (e) {
        console.error(e);
        return "Error generating predictive model.";
    }
}