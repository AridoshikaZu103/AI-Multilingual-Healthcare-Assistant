import logging
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# System prompt for the healthcare assistant
SYSTEM_PROMPT = """You are an AI-Driven Multilingual Healthcare Assistant designed to help rural communities in India access healthcare information.

Your responsibilities:
1. Provide accurate information about government healthcare schemes (Ayushman Bharat, PMJAY, Aarogyasri, etc.)
2. Explain eligibility criteria for various schemes
3. List required documents for scheme enrollment
4. Provide general healthcare awareness and preventive care tips
5. Help users understand vaccination schedules
6. Provide information about nearby government hospitals and Primary Health Centres (PHCs)

Important guidelines:
- Always respond in the language the user is speaking. If the user writes in Hindi, respond in Hindi. If in Telugu, respond in Telugu. If in English, respond in English.
- Be empathetic, patient, and use simple language that rural communities can understand.
- Always include a disclaimer that you provide general healthcare information only and are NOT a substitute for professional medical advice.
- If a user describes a medical emergency, advise them to call emergency services (112) or visit the nearest hospital immediately.
- Be concise but thorough in your responses.
- When discussing schemes, provide practical step-by-step guidance.
- Use bullet points and structured formatting for clarity.

You are a trusted health information companion for people who may have limited access to healthcare resources."""

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in English.",
    "hi": "कृपया हिंदी में जवाब दें। Respond in Hindi language using Devanagari script.",
    "te": "దయచేసి తెలుగులో సమాధానం ఇవ్వండి. Respond in Telugu language using Telugu script.",
}


class AIService:
    """Service for interacting with Ollama LLM."""

    def __init__(self):
        self.llm = None
        self._initialized = False

    def _ensure_initialized(self):
        """Lazy initialization of the LLM client."""
        if not self._initialized:
            try:
                self.llm = ChatOllama(
                    model=settings.OLLAMA_MODEL,
                    base_url=settings.OLLAMA_BASE_URL,
                    temperature=0.7,
                    num_predict=1024,
                    timeout=180.0,
                )
                self._initialized = True
                logger.info(f"AI Service initialized with model: {settings.OLLAMA_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize AI Service: {e}")
                raise

    async def generate_response(self, user_message: str, language: str = "en") -> str:
        """Generate an AI response to the user's message."""
        self._ensure_initialized()

        lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])

        messages = [
            SystemMessage(content=f"{SYSTEM_PROMPT}\n\n{lang_instruction}"),
            HumanMessage(content=user_message),
        ]

        try:
            response = await self.llm.ainvoke(messages)
            return response.content
        except Exception as e:
            logger.error(f"AI generation error: {e}")
            # Fallback responses in different languages
            fallback = {
                "en": "I apologize, but I'm currently unable to process your request. Please try again in a moment, or contact your nearest healthcare centre for immediate assistance.",
                "hi": "क्षमा करें, मैं अभी आपके अनुरोध को संसाधित करने में असमर्थ हूं। कृपया कुछ समय बाद पुनः प्रयास करें, या तत्काल सहायता के लिए अपने निकटतम स्वास्थ्य केंद्र से संपर्क करें।",
                "te": "క్షమించండి, ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయడం సాధ్యం కాలేదు. దయచేసి కొద్దిసేపటి తర్వాత మళ్ళీ ప్రయత్నించండి, లేదా తక్షణ సహాయం కోసం మీ సమీపంలోని ఆరోగ్య కేంద్రాన్ని సంప్రదించండి.",
            }
            return fallback.get(language, fallback["en"])

    async def check_health(self) -> bool:
        """Check if Ollama is reachable."""
        try:
            self._ensure_initialized()
            # Simple ping by generating a minimal response
            response = await self.llm.ainvoke([HumanMessage(content="Hi")])
            return bool(response.content)
        except Exception:
            return False


# Singleton instance
ai_service = AIService()
