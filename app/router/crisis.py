from fastapi import APIRouter, HTTPException, status
from typing import List, Dict
import json
from pathlib import Path

router = APIRouter()

# Load crisis resources from JSON file
def load_crisis_resources():
    try:
        resources_path = Path(__file__).parent.parent / "data" / "crisis_hotlines.json"
        with open(resources_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "hotlines": [
                {
                    "name": "National Suicide Prevention Lifeline",
                    "number": "988",
                    "description": "24/7 support for people in suicidal crisis or emotional distress"
                },
                {
                    "name": "Crisis Text Line",
                    "number": "Text HOME to 741741",
                    "description": "24/7 text support for any type of crisis"
                }
            ],
            "emergency_services": "911",
            "resources": [
                {
                    "name": "SAMHSA's National Helpline",
                    "number": "1-800-662-4357",
                    "description": "Treatment referral and information service for individuals facing mental health or substance use disorders"
                }
            ]
        }

@router.get("/resources")
async def get_crisis_resources():
    """Get crisis support resources and hotlines."""
    return load_crisis_resources()

@router.get("/hotlines")
async def get_crisis_hotlines():
    """Get crisis hotline information."""
    resources = load_crisis_resources()
    return {
        "hotlines": resources["hotlines"],
        "emergency_services": resources["emergency_services"]
    }

@router.get("/local-resources")
async def get_local_resources():
    """Get local mental health resources."""
    resources = load_crisis_resources()
    return {
        "resources": resources["resources"]
    } 