export const expressionColors = {
    Admiration: "#ffc58f",
    Adoration: "#ffc6cc",
    "Aesthetic Appreciation": "#e2cbff",
    Amusement: "#febf52",
    Anger: "#b21816",
    Annoyance: "#ffffff",
    Anxiety: "#6e42cc",
    Awe: "#7dabd3",
    Awkwardness: "#d7d99d",
    Boredom: "#a4a4a4",
    Calmness: "#a9cce1",
    Concentration: "#336cff",
    Contemplation: "#b0aeef",
    Confusion: "#c66a26",
    Contempt: "#76842d",
    Contentment: "#e5c6b4",
    Craving: "#54591c",
    Determination: "#ff5c00",
    Disappointment: "#006c7c",
    Disapproval: "#ffffff",
    Disgust: "#1a7a41",
    Distress: "#c5f264",
    Doubt: "#998644",
    Ecstasy: "#ff48a4",
    Embarrassment: "#63c653",
    "Empathic Pain": "#ca5555",
    Enthusiasm: "#ffffff",
    Entrancement: "#7554d6",
    Envy: "#1d4921",
    Excitement: "#fff974",
    Fear: "#d1c9ef",
    Gratitude: "#ffffff",
    Guilt: "#879aa1",
    Horror: "#772e7a",
    Interest: "#a9cce1",
    Joy: "#ffd600",
    Love: "#f44f4c",
    Neutral: "#879aa1",
    Nostalgia: "#b087a1",
    Pain: "#8c1d1d",
    Pride: "#9a4cb6",
    Realization: "#217aa8",
    Relief: "#fe927a",
    Romance: "#f0cc86",
    Sadness: "#305575",
    Sarcasm: "#ffffff",
    Satisfaction: "#a6ddaf",
    "Sexual Desire": "#aa0d59",
    Shame: "#8a6262",
    Surprise: "#70e63a",
    "Surprise (negative)": "#70e63a",
    "Surprise (positive)": "#7affff",
    Sympathy: "#7f88e0",
    Tiredness: "#757575",
    Triumph: "#ec8132",
  };
  
  export const isExpressionColor = (color) => {
    return color in expressionColors;
  }