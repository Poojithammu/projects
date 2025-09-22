
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, BookOpen, School } from "lucide-react";
import RecipeGenerator from "@/components/RecipeGenerator";
import EducationalCharacters from "@/components/EducationalCharacters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  CookLearn
                </h1>
                <p className="text-sm text-muted-foreground">Recipes & Education</p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
            Cooking Recipes & Educational Characters
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your ingredients into delicious recipes with AI, and explore history and science through interactive educational characters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="w-64 bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <ChefHat className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-semibold text-orange-800 mb-2">Recipe Generation</h3>
                <p className="text-sm text-orange-700">Create recipes from your available ingredients</p>
              </CardContent>
            </Card>
            <Card className="w-64 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <School className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-blue-800 mb-2">Educational Characters</h3>
                <p className="text-sm text-blue-700">Learn through historical and scientific figures</p>
              </CardContent>
            </Card>
            <Card className="w-64 bg-gradient-to-br from-red-100 to-red-200 border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold text-red-800 mb-2">Visual Learning</h3>
                <p className="text-sm text-red-700">Interactive visual aids for better understanding</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Recipe Generator
              </TabsTrigger>
              <TabsTrigger value="characters" className="flex items-center gap-2">
                <School className="w-4 h-4" />
                Educational Characters
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recipes" className="mt-0">
              <RecipeGenerator />
            </TabsContent>
            
            <TabsContent value="characters" className="mt-0">
              <EducationalCharacters />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 CookLearn. Combining culinary creativity with educational innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
