export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { problem } = req.body || {};

        // Check problem
        if (!problem || typeof problem !== "string") {
            return res.status(400).json({
                error: "Problem is required"
            });
        }

        // Check Gemini API key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is not configured"
            });
        }

        const prompt = `
You are the ImpactX AI Solution Engine.

ImpactX helps students turn real-world problems into practical solutions.

The selected problem is:

${problem}

Generate exactly 4 DIFFERENT possible solutions.

Each solution must contain:

- name
- description
- impact
- feasibility
- sustainability

Requirements:
- Practical
- Creative
- Realistic
- Suitable for students, schools or communities
- Different from each other
- Safe and responsible
- Easy to understand

Return ONLY valid JSON in exactly this format:

{
  "solutions": [
    {
      "name": "Solution name",
      "description": "Short explanation",
      "impact": "High",
      "feasibility": "High",
      "sustainability": "Medium"
    }
  ]
}
`;

        // Call Gemini
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],

                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        const data = await response.json();

        // Handle Gemini errors
        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    "Gemini request failed"
            });
        }

        // Extract Gemini response text
        const outputText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!outputText) {
            console.error("Gemini returned:", data);

            return res.status(500).json({
                error: "Gemini returned no solution text"
            });
        }

        // Parse JSON returned by Gemini
        let result;

        try {
            result = JSON.parse(outputText);
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.error("Gemini output:", outputText);

            return res.status(500).json({
                error: "Gemini returned invalid solution JSON"
            });
        }

        // Validate solutions
        if (
            !result.solutions ||
            !Array.isArray(result.solutions)
        ) {
            return res.status(500).json({
                error: "Gemini did not return the expected solutions"
            });
        }

        // Keep exactly 4 solutions
        const solutions = result.solutions
            .slice(0, 4)
            .map(solution => ({
                name: String(solution.name || "Untitled Solution"),
                description: String(
                    solution.description || "No description provided."
                ),
                impact: String(
                    solution.impact || "Medium"
                ),
                feasibility: String(
                    solution.feasibility || "Medium"
                ),
                sustainability: String(
                    solution.sustainability || "Medium"
                )
            }));

        return res.status(200).json({
            success: true,
            solutions
        });

    } catch (error) {
        console.error("ImpactX server error:", error);

        return res.status(500).json({
            error:
                "Something went wrong while generating solutions."
        });
    }
}
