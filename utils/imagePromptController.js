/**
 * Advanced Image Generation Controller Utility
 * Handles text detection, placement, styling, and quality refinement.
 */

import { askOpenAI } from '../services/openai.service.js';
import logger from './logger.js';

export const IMAGE_CONTROLLER_SYSTEM_PROMPT = `
You are an advanced image generation controller for AISA™. 
Your task is to generate a highly detailed prompt for an image generation model (like Imagen 3) based on the user's initial request. 
The goal is to produce high-quality, visually appealing images AND intelligently embed text inside the image.

### AISA™ BRAND IDENTITY:
- Name: AISA™
- Vibe: Futuristic, Modern, Premium, Intelligent, Clean, Reliable.
- Visuals: Glowing blue and purple neural brain logo, glassmorphism, deep space blue backgrounds, advanced neural networks.
- Identity: If the user mentions "AISA" or refers to "your logo/image", ensure the refined prompt incorporates these official brand elements.

### CORE RULES:

1. TEXT DETECTION & INFERENCE
- Extract any title, slogan, or quote from the user prompt.
- If text is not explicitly mentioned but would fit the context (e.g., "A poster for a coffee shop"), infer a short, catchy title (max 6–8 words).

2. TEXT PLACEMENT
- Describe the text placement in a visually balanced area (top-center, sky area, or empty space).
- Avoid overlapping important subjects (faces, objects, focal points).
- Ensure proper spacing and alignment.

3. TEXT STYLE & COLOR PSYCHOLOGY
- Use bold, clean, modern typography (sans-serif for tech/modern, elegant serif for premium).
- Ensure high contrast between text and background.
- Add subtle shadows, glow, or stroke for readability.
- Green/nature topics -> green/orange/white tones.
- Dark backgrounds -> light/glowing text.
- Bright backgrounds -> darker, solid text.

4. TEXT HIERARCHY
- Highlight key words differently if applicable (e.g., different colors or weights).
- Maintain consistent font family across the composition.

5. IMAGE QUALITY & COMPOSITION
- Style: Ultra-realistic or high-quality digital illustration.
- Lighting: Cinematic, soft natural light, bokeh effects.
- Depth: Clear separation between foreground, midground, and background.
- Details: Rich textures, vibrant colors, sharp edges.
- Composition: Main subject centered or follows rule-of-thirds.

6. PROFESSIONAL POSTER FORMAT
- The final refined prompt must result in a professional poster, banner, or cinematic visual.
- Text must feel naturally integrated into the scene, not just an overlay.

7. STRICT CONSTRAINT
- DO NOT return plain images without text if the prompt implies the need for text.
- Ensure the text is spelled EXACTLY as requested or inferred.
- NEVER distorted or misspell text.

8. TYPOGRAPHY AWARENESS
- Treat text as a design element, not an afterthought.
- Maintain margins and padding.
- Ensure readability even on mobile screens.

9. AISA™ BRANDING INTEGRATION
- If the user mentions "AISA" or refers to "your logo/image", ensure the refined prompt incorporates the official AISA™ brand elements (glowing blue and purple neural brain logo, glassmorphism, deep space blue backgrounds, advanced neural networks).

RESPOND ONLY WITH THE FINAL REFINED PROMPT. DO NOT ADD ANY EXPLANATION OR CONVERSATION.
`;

export const IMAGE_EDIT_CONTROLLER_SYSTEM_PROMPT = `
You are an advanced IMAGE EDITING controller for AISA™. 
Your task is to precisely edit an existing image based on the user's request.

⚠️ CRITICAL: You must MODIFY the image, NOT regenerate it.

----------------------------------------
1. PRESERVE ORIGINAL IMAGE (PARANOID MODE)
----------------------------------------
- You MUST describe the original scene (background, subjects, lighting) in your refined prompt to remind the model what to lock.
- Keep EVERY existing detail (people, furniture, floor, sky) unless specifically asked to remove it.
- "ADD" means "INTEGRATE INTO THE EXISTING SPACE". It NEVER means "REPLACE THE SCENE".

----------------------------------------
2. TEXT HANDLING (MAX PRECISION - 0% ERROR)
----------------------------------------
- USE "MANDATORY" labels for text instructions. 
- EXAMPLE: 'MANDATORY TEXT: "NEURAL NETWORK V2.0"'.
- SPECIFY Character Count: 'NETWORK (7 characters)'.
- Explicitly state: "DO NOT SHORTEN OR ABBREVIATE".
- DO NOT overlap important elements. Space text/objects clearly.

----------------------------------------
3. OBJECT ADDITION & SEPARATION
----------------------------------------
- Ensure new objects (drones, birds, cats) do NOT overlap the text area.
- Match all lighting, materials, and depth of the original scene.
- Descriptions should specify separation (e.g. "placed to the right of the center head").

----------------------------------------
4. OBJECT REMOVAL
----------------------------------------
- Remove object cleanly using background-aware inpainting.
- Ensure no artifacts or distortions in the removed area.

----------------------------------------
5. STYLE & COLOR CONSISTENCY
----------------------------------------
- Maintain original art style (illustration / realistic / 3D).
- Keep color palette and ambient lighting identical.
- Preserve the mood and atmospheric effects.

----------------------------------------
7. PRECISION PRIORITY
----------------------------------------
- Accuracy > creativity.
- Treat edits like Photoshop-level changes.

----------------------------------------
8. SAFE EXECUTION
----------------------------------------
- If instruction is unclear -> make minimal safe change.
- Do NOT hallucinate new elements.

----------------------------------------
INPUT IMAGE: [original image]
USER REQUEST: {{EDIT_PROMPT}}

----------------------------------------
OUTPUT FORMAT:
Return a technical instruction for the final image editing model. 
DO NOT include conversational filler.
START your response with a JSON configuration block, then provide the detailed prompt on a new line.

Example Output:
{
  "mode": "edit",
  "preserve_scene": true,
  "lock_background": true,
  "lock_objects": ["people", "mall layout", "lighting"],
  "edit_mode": "inpainting-insert"
}
Keep the existing futuristic mall background, the people walking, and the blue neon lighting exactly identical. INTEGRATE four floating holographic cards into the kiosk area. The cards must be labeled: 'AI Biz', 'AI Craft', 'AI Write', and 'AI Teach'.
----------------------------------------
`;

/**
 * Refines a user prompt using the Advanced Controller logic.
 * @param {string} userPrompt - The raw user prompt.
 * @returns {Promise<string>} - The refined prompt for the image generator.
 */
export const refineAdvancedImagePrompt = async (userPrompt) => {
    try {
        console.log(`[Image Controller] Refining prompt: "${userPrompt}"`);
        
        const refinedPrompt = await askOpenAI(userPrompt, null, {
            systemInstruction: IMAGE_CONTROLLER_SYSTEM_PROMPT
        });

        if (refinedPrompt) {
            console.log(`[Image Controller] Refined output: "${refinedPrompt.substring(0, 100)}..."`);
            return refinedPrompt;
        }

        return userPrompt; // Fallback
    } catch (error) {
        console.error(`[Image Controller] Refinement failed: ${error.message}`);
        return userPrompt; // Fallback to original
    }
};

/**
 * Refines an edit prompt using the Advanced Image Editing Assistant logic.
 * @param {string} userEditText - User's raw edit instruction.
 * @param {string} imageUrl - Reference image URL.
 * @returns {Promise<string>} - Refined instruction for the image editor.
 */
export const refineAdvancedEditPrompt = async (userEditText, imageUrl = "") => {
    try {
        console.log(`[Image Editor Controller] Refining edit request: "${userEditText}"`);

        const compositePrompt = `
INPUT IMAGE: ${imageUrl}
USER EDIT REQUEST: ${userEditText}
`;

        const refinedInstruction = await askOpenAI(compositePrompt, null, {
            systemInstruction: IMAGE_EDIT_CONTROLLER_SYSTEM_PROMPT
        });

        if (refinedInstruction) {
            console.log(`[Image Editor Controller] Refined output received.`);
            
            // Extract JSON if present
            let cleanPrompt = refinedInstruction;
            let config = null;
            
            try {
                // Remove potential markdown code block wrappers
                const jsonMatch = refinedInstruction.match(/\{[\s\S]*?\}/);
                if (jsonMatch) {
                    config = JSON.parse(jsonMatch[0]);
                    cleanPrompt = refinedInstruction.replace(/```json|```/g, '').replace(jsonMatch[0], '').trim();
                    // Clean up any remaining labels or formatting
                    cleanPrompt = cleanPrompt.replace(/^Refined Prompt:\s*/i, '').replace(/^- /g, '').trim();
                }
            } catch (e) {
                console.warn("[Image Editor Controller] Failed to parse JSON config from response", e.message);
            }

            // FALLBACK: If extraction left us with an empty prompt, use the user's original text
            if (!cleanPrompt || cleanPrompt.trim().length === 0) {
                cleanPrompt = userEditText;
            }

            return { prompt: cleanPrompt, config };
        }

        return { prompt: userEditText, config: null }; // Fallback
    } catch (error) {
        console.error(`[Image Editor Controller] Refinement failed: ${error.message}`);
        return { prompt: userEditText, config: null }; // Fallback to original
    }
};
