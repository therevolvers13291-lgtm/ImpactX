export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { problem } = req.body || {};

        if (!problem || typeof problem !== "string") {
            return res.status(400).json({
                error: "Problem is required"
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is not configured"
            });
        }

        const prompt = `
You are the ImpactX AI Solution Engine.

Selected real-world problem:
${problem}

Generate exactly 4 different practical solutions.

For every solution provide:
- name
- description
- impact
- feasibility
- sustainability

Requirements:
- practical
- creative
- realistic
- suitable for students, schools or communities
- safe
- clearly different from one another

Return ONLY JSON.
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
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
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "OBJECT",
                            properties: {
                                solutions: {
                                    type: "ARRAY",
                                    items: {
                                        type: "OBJECT",
                                        properties: {
                                            name: {
                                                type: "STRING"
                                            },
                                            description: {
                                                type: "STRING"
                                            },
                                            impact: {
                                                type: "STRING"
                                            },
                                            feasibility: {
                                                type: "STRING"
                                            },
                                            sustainability: {
                                                type: "STRING"
                                            }
                                        },
                                        required: [
                                            "name",
                                            "description",
                                            "impact",
                                            "feasibility",
                                            "sustainability"
                                        ]
                                    }
                                }
                            },
                            required: ["solutions"]
                        }
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    "Gemini request failed"
            });
        }

        const outputText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!outputText) {
            return res.status(500).json({
                error: "Gemini returned no solution text"
            });
        }

        let result;

        try {
            result = JSON.parse(outputText);
        } catch (error) {
            console.error("JSON parse error:", error);
            console.error("Gemini output:", outputText);

            return res.status(500).json({
                error: "Gemini returned invalid JSON"
            });
        }

        if (
            !result.solutions ||
            !Array.isArray(result.solutions)
        ) {
            return res.status(500).json({
                error: "No solutions were returned"
            });
        }

        return res.status(200).json({
            success: true,
            solutions: result.solutions.slice(0, 4)
        });

    } catch (error) {
        console.error("ImpactX server error:", error);

        return res.status(500).json({
            error: "Something went wrong while generating solutions."
        });
    }
}
