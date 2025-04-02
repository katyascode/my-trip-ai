import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      type,
      userMessage,
      age,
      originAirport,
      destinationAirport,
      destinationCity,
      files,
      preferences,
      budget,
      duration,
      startDate,
      endDate
    } = body;

    if (!(userMessage && type)) {
      return NextResponse.json(
        { error: "Missing user message or type." },
        { status: 400 }
      )
    }

    let systemMessage = "";

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
      const documentContext = files && files.length > 0 
        ? `\nIncorporate the following information from uploaded documents into the itinerary where relevant:\n${files.join('\n')}`
        : '';

      systemMessage = `
      You are a helpful, engaging and modern AI travel assistant.
      Your task is to create a detailed day-by-day itinerary for a ${duration}-day trip to ${destinationCity}.
      The trip starts on ${startDate} and ends on ${endDate}.
      
      Important rules to follow:
      1. Create EXACTLY ${duration} days of activities, no more and no less
      2. Format each day exactly like this:
         ## Day X (YYYY-MM-DD)
         ### Morning:
         - Activity 1 ($cost)
         - Activity 2 ($cost)
         ### Afternoon:
         - Activity 1 ($cost)
         - Activity 2 ($cost)
         ### Evening:
         - Activity 1 ($cost)
         - Activity 2 ($cost)
      3. Each activity should include:
         - Estimated cost in parentheses where applicable
         - Travel time and transport info in italics
         - Any special notes or tips in blockquotes
      4. Consider the user's preferences: ${preferences || "none"}
      5. Stay within the budget range: ${budget || "flexible"}
      ${documentContext}

      Do not include any introductory text before the first day heading.
      Start directly with "## Day 1" and maintain consistent markdown formatting throughout.
      `.trim();
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
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
