import os
import anthropic
from dotenv import load_dotenv
import json 
import base64


# Load the environment variables from the .env file
load_dotenv()

# Retrieve the key from the environment
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY is missing from the environment variables. Check your .env file.")

# Initialize the Anthropic client securely
client = anthropic.Anthropic(api_key=api_key)

def analyze_image(base64_image_string):
    """
    Takes a base64 encoded image string, sends it to Claude, parses the response,
    and returns a JSON string with detailed species identification and safety info.
    """
    
    print("=== ANALYZE IMAGE CALLED ===")
    print(f"Image data length: {len(base64_image_string)} characters")
    
    media_type = "image/png"

    if base64_image_string.startswith('data:image'):
        header, base64_image_string = base64_image_string.split(',', 1)
        media_type = header.split(':')[1].split(';')[0]
    
    # We define the exact JSON structure we want Claude to return
    
    system_prompt = (
        "You are an expert park ranger and trail guide. Identify the plant, animal, insect, or fungus in the image. "
        "Return ONLY a valid JSON object. Do not include any conversational text, explanations, or markdown formatting (like ```json). "
        "The JSON object must contain exactly these six keys: "
        "'common_name' (string, the species common name), "
        "'scientific_name' (string, the species scientific name), "
        "'description' (string, a short 1-2 sentence description), "
        "'origin' (string, where it is native to), "
        "'safety_precautions' (string, safety precautions for humans in case of confrontation, contact, or consumption. If harmless, state 'Harmless to humans.'), "
        "'fun_fact' (string, one interesting fact)."
    )

    try:
        print("Sending request to Claude API...")
        print(f"Image data length after cleanup: {len(base64_image_string)} characters")
        
        response = client.messages.create(
            model="claude-sonnet-4-6", 
            max_tokens=400,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,  
                                "data": base64_image_string,
                            },
                        },
                        {
                            "type": "text",
                            "text": "What is this? Return ONLY valid JSON with keys: common_name, scientific_name, description, origin, safety_precautions, fun_fact"
                        }
                    ],
                }
            ],
        )
        
        print("Claude API response received!")

        if hasattr(response, 'content') and response.content:
            content_block = response.content[0]
            if hasattr(content_block, 'text'):
                result_text = content_block.text
                print(f"Response length: {len(result_text)}")
                print(f"Response preview: {result_text[:200]}...")
                return result_text
            else:
                result_text = str(content_block)
                return result_text
        else:
            print("No content in response.")
            return None
        #return response.content[0].text

    except Exception as e:
        print(f"Vision API Error: {e}")
        return None