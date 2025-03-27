import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      type, // 'trip', 'document'
      userMessage,
      age,
      originAirport,
      destinationAirport,
      destinationCity,
      files,
      preferences,
      budget
    } = body;

    if (!(userMessage && type)) {
      return NextResponse.json(
        { error: "Missing user message or type." },
        { status: 400 }
      )
    }

    let systemMessage = "";

    // Types of requests:
    // (1) Travel Suggestions (overview)
    // (2) Document-based feedback (e.g. hotel confirmation)

    if (type === "trip") {
      systemMessage = `
      You are a helpful, engaging and modern AI travel assistant.
      Your job is to provide a high-level overview of the destination's attractions, tips, and things to keep in mind. 
      Maximum words: Around 100-150 words.
      Personalize your suggestions for the destination city, using this user info and their age group:
      
      - Age: ${age || "unknown"}
      - Origin airport: ${originAirport || "unknown"}
      - Destination city: ${destinationCity || "unknown"}
      - Destination airport: ${destinationAirport || "unknown"}
      - Preferences: ${preferences || "none"}
      - Budget: ${budget || "none"}
      
      Be concise but informative and exciting.
    `.trim()
    }
    if (type === "itinerary") {
          systemMessage = `
          You are a helpful, engaging and modern AI travel assistant.
          Your job is to provide a high-level itinerary of the trip, based on given information from the text extracted from uploaded files and your suggestions for additional activities and modes of transport. Your answer should be organized clearly laid out by time and date and note which travel activities are based off recommendations.
          Maximum words: Around 100-500 words.
          Personalize your suggestions for the destination city, using this user preferences, their fileText and their age group keeping in mind their budget:

          - Age: ${age || "unknown"}
          - Destination city: ${destinationCity || "unknown"}
          - Files: ($filesText || "none")
          - Preferences: ${preferences || "none"}
          - Budget: ${budget || "none"}

          Be concise but informative and exciting.
        `.trim()
        }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
      ],
      temperature: 0.8
    });

    const reply = res.choices[0].message.content;
    return NextResponse.json({ reply }, { status: 200 });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Something went wrong with the AI request." },
      { status: 500 }
    );
  }
}
