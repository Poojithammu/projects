import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Clock, Users, Flame } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';

interface Recipe {
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient!");
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}. 
      Include a creative title, description, cook time, servings, difficulty level, 
      list of all ingredients needed, step-by-step instructions, and chef's tips. 
      Format as a complete recipe with all sections.`;
      
      const context = `You are a professional chef AI. Create a delicious, well-structured recipe 
      using the provided ingredients. Include all necessary additional ingredients. 
      Make the recipe practical with clear instructions and helpful tips. 
      Structure the response as a complete recipe with title, description, 
      cooking details, ingredients, instructions, and tips.`;
      
      const apiKey = "16t1b3fa04b8866116ccceb0d2do3a04";
      
      const response = await axios.get(
        `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`
      );

      // Parse the AI response into our recipe structure
      const aiResponse = response.data.answer;
      const parsedRecipe = parseAIResponse(aiResponse);
      setGeneratedRecipe(parsedRecipe);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast.error("Failed to generate recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to parse the AI response into our Recipe interface
  const parseAIResponse = (text: string): Recipe => {
    // Default values if parsing fails
    const defaultRecipe: Recipe = {
      title: "Delicious AI-Generated Recipe",
      description: "A wonderful dish created just for you",
      cookTime: "30 minutes",
      servings: 4,
      difficulty: "Medium",
      ingredients: [...ingredients],
      instructions: [
        "Combine all ingredients in a pan",
        "Cook until done",
        "Serve and enjoy!"
      ],
      tips: [
        "Season to taste",
        "Adjust cooking time as needed"
      ]
    };

    try {
      // Try to extract structured data from the AI response
      // This is a basic implementation - you might need to adjust based on actual AI responses
      const lines = text.split('\n').filter(line => line.trim());
      
      // Extract title (first line)
      const title = lines[0].replace('Title:', '').trim();
      
      // Extract description (second line)
      const description = lines[1].replace('Description:', '').trim();
      
      // Find and extract other sections
      const ingredientsSection = text.match(/Ingredients:([\s\S]*?)Instructions:/)?.[1] || '';
      const instructionsSection = text.match(/Instructions:([\s\S]*?)Tips:/)?.[1] || '';
      const tipsSection = text.match(/Tips:([\s\S]*)/)?.[1] || '';
      
      // Parse ingredients list
      const ingredientsList = ingredientsSection.split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line);
      
      // Parse instructions
      const instructionsList = instructionsSection.split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line);
      
      // Parse tips
      const tipsList = tipsSection.split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line);
      
      return {
        title: title || defaultRecipe.title,
        description: description || defaultRecipe.description,
        cookTime: "30 minutes", // Could parse this if AI provides it
        servings: 4, // Could parse this if AI provides it
        difficulty: "Medium", // Could parse this if AI provides it
        ingredients: [...new Set([...ingredients, ...ingredientsList])], // Combine user ingredients with AI suggestions
        instructions: instructionsList.length ? instructionsList : defaultRecipe.instructions,
        tips: tipsList.length ? tipsList : defaultRecipe.tips
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return defaultRecipe;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <ChefHat className="w-5 h-5" />
            AI Recipe Generator
          </CardTitle>
          <CardDescription className="text-orange-700">
            Enter your available ingredients and let AI create a delicious recipe for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter an ingredient (e.g., chicken, tomatoes, rice)"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addIngredient} variant="outline">
              Add
            </Button>
          </div>
          
          {ingredients.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-800">Your Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    {ingredient} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            onClick={generateRecipe} 
            disabled={isGenerating || ingredients.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isGenerating ? "Generating Recipe..." : "Generate Recipe"}
          </Button>
        </CardContent>
      </Card>

      {generatedRecipe && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{generatedRecipe.title}</CardTitle>
            <CardDescription className="text-lg">{generatedRecipe.description}</CardDescription>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {generatedRecipe.cookTime}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {generatedRecipe.servings} servings
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Flame className="w-4 h-4" />
                {generatedRecipe.difficulty}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {generatedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-3">Instructions</h3>
              <ol className="space-y-3">
                {generatedRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-3">Chef's Tips</h3>
              <div className="space-y-2">
                {generatedRecipe.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                    <ChefHat className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-orange-800">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipeGenerator;