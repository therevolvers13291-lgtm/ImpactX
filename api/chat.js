export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    try {

        // Get the problem from the website
        const { problem } = req.body || {};


        // Make sure a problem was provided
        if (!problem || typeof problem !== "string") {

            return res.status(400).json({
                error: "Problem is required"
            });

        }


        // Check that the API key exists
        if (!process.env.OPENAI_API_KEY) {

            return res.status(500).json({
                error: "OPENAI_API_KEY is not configured"
            });

        }


        // Send the problem to OpenAI
        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({

                    model: "gpt-6-luna",

                    input: [
                        {
                            role: "system",

                            content:
                                "You are the ImpactX AI Solution Engine. Help students turn real-world problems into practical, creative and realistic solutions."
                        },

                        {
                            role: "user",

                            content: `
The selected real-world problem is:

${problem}

Generate exactly 4 different possible solutions.

For EACH solution provide:

- name
- description
- impact
- feasibility
- sustainability

The solutions should be:
- practical
- creative
- realistic
- suitable for students, schools or communities
- different from one another

Return ONLY valid JSON.

Use exactly this structure:

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
`
                        }
                    ]

                })

            }
        );


        // Convert OpenAI response to JSON
        const data = await response.json();


        // Handle OpenAI errors
        if (!response.ok) {

            console.error("OpenAI API error:", data);

            return res.status(response.status).json({

                error:
                    data?.error?.message ||
                    "OpenAI request failed"

            });

        }


        // Get generated text
        const outputText =
            data.output_text;


        if (!outputText) {

            return res.status(500).json({
                error: "AI returned no solution text"
            });

        }


        // Convert AI JSON text into an actual object
        let solutions;


        try {

            solutions =
                JSON.parse(outputText);

        } catch (parseError) {

            console.error(
                "AI JSON parsing error:",
                parseError
            );

            console.error(
                "AI output:",
                outputText
            );

            return res.status(500).json({
                error:
                    "AI returned an invalid solution format"
            });

        }


        // Make sure solutions exist
        if (
            !solutions.solutions ||
            !Array.isArray(solutions.solutions)
        ) {

            return res.status(500).json({
                error:
                    "AI did not return the expected solutions"
            });

        }


        // Send solutions back to the website
        return res.status(200).json({

            success: true,

            solutions:
                solutions.solutions

        });

    }


    catch (error) {

        console.error(
            "ImpactX server error:",
            error
        );


        return res.status(500).json({

            error:
                "Something went wrong while generating solutions."

        });

    }

}
