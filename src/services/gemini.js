/**
 * Ask Pluto - Gemini API Client Service
 * Specialized Campus & Student Life Guide
 */

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const isGeminiConfigured = () => {
  const key = getApiKey();
  return Boolean(
    key &&
    key.trim() !== '' &&
    !key.includes('your_gemini_api_key')
  );
};

export async function askGeminiGuide({ message, college, studentName, history = [] }) {
  const apiKey = getApiKey();

  if (!isGeminiConfigured()) {
    return {
      success: false,
      error: 'Gemini API key is not set. Please add VITE_GEMINI_API_KEY in your .env file to enable live AI campus guidance.',
      isConfigMissing: true
    };
  }

  const collegeContext = (college && college.trim())
    ? college.trim()
    : 'None selected yet by the student';

  const studentGreetingContext = (studentName && studentName.trim())
    ? studentName.trim()
    : 'Student';

  const systemInstruction = `You are "Ask Pluto", an intelligent, highly focused Campus & Student Life Guide for the Pluto student relocation platform.

STUDENT & CAMPUS CONTEXT:
- Student Name: "${studentGreetingContext}".
- Selected College: "${collegeContext}".

CRITICAL INSTRUCTION - SELF-ANALYZE & CONDENSE:
Before outputting, self-analyze the query internally:
1. Determine the exact question and identify the top specific facts the student needs (local area names, approximate rent in ₹, mess costs, or commute routes).
2. Filter out all conversational filler, preambles, and repetitive commentary.
3. Formulate the shortest possible complete answer that directly and accurately answers the query at its best.
4. Ensure the response is 100% finished and never stops mid-sentence. Always end with a clean concluding punctuation mark.

LENGTH GUIDELINE:
- Deliver the response as short as possible while fully answering what was asked (typically 2 to 4 compact points or 60 to 120 words total).
- No rambling, no incomplete thoughts.

CRITICAL CLEAN FORMATTING (NO RAW MARKDOWN):
- DO NOT use markdown headers (NO "#", "##", "###").
- DO NOT use raw asterisks for bolding or bullets (NO "*", NO "**").
- Use clean numbered points (1., 2., 3.) or simple dashes (-).
- Helpful emojis (🏠, 🍱, 🚇, 📍, 💰) are encouraged for visual clarity.

CAMPUS & RELOCATION SCOPE:
- ONLY answer questions about campus life, accommodation (PGs, hostels, flats), food (mess, tiffins, canteens), transit, and student essentials around "${collegeContext}".
- If off-topic, politely decline in one short sentence.`;

  // Build conversation history formatted for Gemini
  const contents = [];

  // Add previous conversational turns (up to last 6 messages to stay fast and within tokens)
  const recentHistory = history.slice(-6);
  for (const turn of recentHistory) {
    if (turn.text && turn.role) {
      contents.push({
        role: turn.role === 'user' ? 'user' : 'model',
        parts: [{ text: turn.text }]
      });
    }
  }

  // Add the current user message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  // Prioritize active flash models with separate free-tier quota pools
  const models = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash'
  ];
  let lastError = null;

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    // Retry up to 2 times on transient 503
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents,
            generationConfig: {
              temperature: 0.35,
              topK: 40,
              topP: 0.9,
              maxOutputTokens: 800
            }
          })
        });

        const data = await response.json();

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          let rawAnswer = data.candidates[0].content.parts[0].text.trim();

          // Ensure answer is complete and not truncated mid-sentence
          if (!/[.!?”'’\)\]\n]$/.test(rawAnswer)) {
            const lastSentenceEnd = Math.max(
              rawAnswer.lastIndexOf('.'),
              rawAnswer.lastIndexOf('!'),
              rawAnswer.lastIndexOf('?')
            );
            if (lastSentenceEnd > 50) {
              rawAnswer = rawAnswer.substring(0, lastSentenceEnd + 1);
            }
          }

          return {
            success: true,
            text: rawAnswer
          };
        }

        if (!response.ok) {
          const errMsg = data?.error?.message || `Status ${response.status}`;
          console.error(`[Ask Pluto] ${model} error:`, errMsg);

          if (response.status === 400 && errMsg.includes('API key not valid')) {
            return {
              success: false,
              error: 'Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in .env.'
            };
          }

          if (response.status === 429 || errMsg.includes('Quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
            console.warn(`[Ask Pluto] ${model} quota exhausted, falling back to next available model...`);
            lastError = 'Gemini rate limit reached across free-tier models. Please wait 30 seconds and try again.';
            break; // Break attempt loop to try next model immediately
          }

          if (response.status === 503 || errMsg.includes('high demand')) {
            lastError = 'Gemini AI is handling high traffic. Please try again in a moment.';
            if (attempt < 1) {
              await new Promise(res => setTimeout(res, 800));
              continue;
            }
          } else {
            lastError = errMsg;
          }
        }
      } catch (err) {
        console.error(`[Ask Pluto] Network error with ${model}:`, err);
        lastError = err.message;
      }
    }
  }

  return {
    success: false,
    error: lastError || 'Gemini AI is temporarily unavailable. Please try again in a moment.'
  };
}
