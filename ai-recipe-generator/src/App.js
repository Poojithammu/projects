import React, { useState } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import "./App.css";

export default function App() {
  const [instructions, setInstructions] = useState("");
  const [recipeHtml, setRecipeHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!instructions.trim()) return;

    setIsLoading(true);
    setRecipeHtml("");

    const prompt = `User instructions are: Generate a recipe for ${instructions}`;
    const context = `You are an expert at recipes. Your mission is to generate a short and easy recipe in basic HTML. Make sure to follow user instructions. Sign the recipe at the end with '<strong>SheCodes AI</strong>' in bold`;
    const apiKey = "16t1b3fa04b8866116ccceb0d2do3a04";

    const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(
      prompt
    )}&context=${encodeURIComponent(context)}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      setRecipeHtml(response.data.answer);
    } catch (error) {
      setRecipeHtml("<p class='error-message'>Sorry, something went wrong. Please try again!</p>");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>
          <span role="img" aria-label="cooking">👩‍🍳</span> AI Recipe Generator
        </h1>
        <p className="subtitle">Turn your cravings into recipes with AI magic</p>
      </header>

      <main className="app-content">
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="What would you like to cook? e.g. vegan pasta, gluten-free cookies, quick chicken dinner..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="recipe-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="generate-btn"
              disabled={isLoading || !instructions.trim()}
            >
              {isLoading ? (
                <span className="spinner">🌀</span>
              ) : (
                "Cook It Up!"
              )}
            </button>
          </div>
        </form>

        <div className={`recipe-container ${isLoading ? "loading" : ""}`}>
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">👩‍🍳 Whipping up your {instructions} recipe...</p>
            </div>
          ) : recipeHtml ? (
            <div className="recipe-result">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(recipeHtml)
                    .pauseFor(2500)
                    .start();
                }}
                options={{
                  delay: 20,
                  cursor: "",
                }}
              />
            </div>
          ) : (
            <div className="empty-state">
              <div className="illustration">🍽️</div>
              <h3>No recipe yet</h3>
              <p>Enter what you'd like to cook and let our AI chef work its magic!</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}