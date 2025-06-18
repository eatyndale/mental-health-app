import json
from typing import List
import openai
from anthropic import Anthropic
from app.config import settings

# Initialize LLM clients
if settings.LLM_PROVIDER == "openai":
    client = openai.OpenAI(api_key=settings.LLM_API_KEY)
elif settings.LLM_PROVIDER == "anthropic":
    client = Anthropic(api_key=settings.LLM_API_KEY)

async def generate_setup_statements(problem_description: str) -> List[str]:
    """Generate EFT setup statements based on the problem description."""
    prompt = f"""
    Based on the following problem description, generate 3 EFT setup statements.
    Each statement should follow the format: "Even though [problem/feeling], [self-acceptance phrase]"
    Make the statements specific to the user's situation and use their own words.
    
    Problem description: {problem_description}
    
    Generate 3 setup statements that are:
    1. Specific to the user's situation
    2. Use their own words
    3. Include self-acceptance
    4. Are emotionally resonant
    
    Return the statements as a JSON array of strings.
    """
    
    if settings.LLM_PROVIDER == "openai":
        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are an EFT (Emotional Freedom Technique) expert."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        statements = json.loads(response.choices[0].message.content)["statements"]
    else:  # Anthropic
        response = await client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        statements = json.loads(response.content[0].text)["statements"]
    
    return statements

async def generate_reminder_phrases(problem_description: str) -> List[str]:
    """Generate EFT reminder phrases based on the problem description."""
    prompt = f"""
    Based on the following problem description, generate 5-7 EFT reminder phrases.
    These phrases should be short, focused statements that capture the core issue.
    They should be specific to the user's situation and use their own words.
    
    Problem description: {problem_description}
    
    Generate reminder phrases that are:
    1. Short and focused
    2. Specific to the user's situation
    3. Use their own words
    4. Capture the emotional essence of the problem
    
    Return the phrases as a JSON array of strings.
    """
    
    if settings.LLM_PROVIDER == "openai":
        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are an EFT (Emotional Freedom Technique) expert."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        phrases = json.loads(response.choices[0].message.content)["phrases"]
    else:  # Anthropic
        response = await client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        phrases = json.loads(response.content[0].text)["phrases"]
    
    return phrases

async def generate_chat_response(user_message: str, context: dict = None) -> str:
    """Generate a chat response based on the user's message and context."""
    prompt = f"""
    You are an empathetic EFT (Emotional Freedom Technique) coach. Respond to the user's message
    with understanding, validation, and guidance. If appropriate, suggest starting an EFT session.
    
    User message: {user_message}
    
    Context: {json.dumps(context) if context else "No additional context"}
    
    Provide a response that:
    1. Validates the user's feelings
    2. Shows empathy and understanding
    3. Offers appropriate support
    4. Suggests next steps if relevant
    """
    
    if settings.LLM_PROVIDER == "openai":
        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are an empathetic EFT coach."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    else:  # Anthropic
        response = await client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.content[0].text 