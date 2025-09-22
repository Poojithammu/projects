
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, School } from "lucide-react";

interface Character {
  id: string;
  name: string;
  field: string;
  period: string;
  category: 'Historical' | 'Scientific';
  avatar: string;
  description: string;
  achievements: string[];
  funFacts: string[];
  quote: string;
  background: string;
}

const EducationalCharacters = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Historical' | 'Scientific'>('All');

  const characters: Character[] = [
    {
      id: '1',
      name: 'Marie Curie',
      field: 'Physics & Chemistry',
      period: '1867-1934',
      category: 'Scientific',
      avatar: '👩‍🔬',
      description: 'Pioneering physicist and chemist who conducted groundbreaking research on radioactivity.',
      achievements: [
        'First woman to win a Nobel Prize',
        'First person to win Nobel Prizes in two different sciences',
        'Discovered elements polonium and radium',
        'Developed mobile X-ray units during WWI'
      ],
      funFacts: [
        'Her notebooks are still radioactive and will be for another 1,500 years',
        'She coined the term "radioactivity"',
        'The element curium was named in her honor'
      ],
      quote: "Nothing in life is to be feared, it is only to be understood.",
      background: 'Born in Warsaw, Poland, Marie Curie overcame numerous obstacles as a woman in science to become one of the most influential scientists in history.'
    },
    {
      id: '2',
      name: 'Leonardo da Vinci',
      field: 'Art, Science, Engineering',
      period: '1452-1519',
      category: 'Historical',
      avatar: '🎨',
      description: 'Renaissance polymath whose curiosity and inventive imagination made him the archetype of the Renaissance man.',
      achievements: [
        'Painted the Mona Lisa and The Last Supper',
        'Designed flying machines centuries before flight',
        'Advanced understanding of human anatomy',
        'Created detailed architectural and engineering plans'
      ],
      funFacts: [
        'He wrote backwards, from right to left',
        'He was vegetarian and loved animals',
        'He designed a robot knight in 1495'
      ],
      quote: "Learning never exhausts the mind.",
      background: 'Born in Vinci, Italy, Leonardo embodied the Renaissance ideal of the complete person - artist, scientist, engineer, and philosopher all in one.'
    },
    {
      id: '3',
      name: 'Albert Einstein',
      field: 'Theoretical Physics',
      period: '1879-1955',
      category: 'Scientific',
      avatar: '🧠',
      description: 'Theoretical physicist who developed the theory of relativity and made significant contributions to quantum mechanics.',
      achievements: [
        'Developed the theory of special and general relativity',
        'Won Nobel Prize in Physics (1921)',
        'Explained the photoelectric effect',
        'Famous equation E=mc²'
      ],
      funFacts: [
        'He had a messy hairstyle because he never combed it',
        'He played the violin and loved sailing',
        'He had trouble with early speech development as a child'
      ],
      quote: "Imagination is more important than knowledge.",
      background: 'Born in Germany, Einstein revolutionized our understanding of space, time, and gravity, becoming synonymous with genius.'
    },
    {
      id: '4',
      name: 'Cleopatra VII',
      field: 'Leadership & Politics',
      period: '69-30 BCE',
      category: 'Historical',
      avatar: '👑',
      description: 'Last active pharaoh of Ptolemaic Egypt, known for her intelligence, political acumen, and relationships with Roman leaders.',
      achievements: [
        'Ruled Egypt for nearly three decades',
        'Spoke multiple languages fluently',
        'Maintained Egypt\'s independence for years',
        'Patron of arts and learning'
      ],
      funFacts: [
        'She was actually Greek, not Egyptian by ethnicity',
        'She was highly educated and spoke 9 languages',
        'Alexandria\'s library flourished under her rule'
      ],
      quote: "I will not be triumphed over.",
      background: 'The last pharaoh of Egypt, Cleopatra was known for her intelligence and political skill rather than just her beauty as often portrayed.'
    },
    {
      id: '5',
      name: 'Charles Darwin',
      field: 'Natural History',
      period: '1809-1882',
      category: 'Scientific',
      avatar: '🐒',
      description: 'Naturalist who proposed the theory of evolution through natural selection.',
      achievements: [
        'Developed the theory of evolution',
        'Wrote "On the Origin of Species"',
        'Revolutionized biological sciences',
        'Established evolutionary biology as a field'
      ],
      funFacts: [
        'He almost became a clergyman instead of a scientist',
        'The voyage on HMS Beagle lasted 5 years',
        'He was very methodical and kept detailed notes'
      ],
      quote: "It is not the strongest of the species that survives, but the most adaptable to change.",
      background: 'English naturalist whose observations during his voyage on the Beagle led to groundbreaking insights about evolution.'
    },
    {
      id: '6',
      name: 'Joan of Arc',
      field: 'Military Leadership',
      period: '1412-1431',
      category: 'Historical',
      avatar: '⚔️',
      description: 'Peasant girl who convinced the French court she had divine visions and led military campaigns during the Hundred Years\' War.',
      achievements: [
        'Lifted the siege of Orléans',
        'Led French forces to several victories',
        'Helped Charles VII become king',
        'Became a symbol of French nationalism'
      ],
      funFacts: [
        'She was only 17 when she convinced the king to let her fight',
        'She wore men\'s clothing and armor',
        'She could not read or write but was very persuasive'
      ],
      quote: "I am not afraid; I was born to do this.",
      background: 'A peasant girl who claimed divine guidance, Joan became a military leader and French national heroine during the Hundred Years\' War.'
    }
  ];

  const filteredCharacters = selectedCategory === 'All' 
    ? characters 
    : characters.filter(char => char.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <School className="w-5 h-5" />
            Educational Characters
          </CardTitle>
          <CardDescription className="text-blue-700">
            Explore history and science through interactive character profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['All', 'Historical', 'Scientific'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category as any)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <Dialog key={character.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{character.avatar}</div>
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {character.field} • {character.period}
                  </CardDescription>
                  <Badge 
                    variant="secondary" 
                    className={character.category === 'Historical' 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-blue-100 text-blue-800"
                    }
                  >
                    {character.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {character.description}
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="text-center mb-4">
                  <div className="text-8xl mb-4">{character.avatar}</div>
                  <DialogTitle className="text-2xl">{character.name}</DialogTitle>
                  <DialogDescription className="text-lg">
                    {character.field} • {character.period}
                  </DialogDescription>
                  <Badge 
                    variant="secondary" 
                    className={character.category === 'Historical' 
                      ? "bg-amber-100 text-amber-800 mt-2" 
                      : "bg-blue-100 text-blue-800 mt-2"
                    }
                  >
                    {character.category}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Background</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {character.background}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Key Achievements</h3>
                  <ul className="space-y-2">
                    {character.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Fun Facts</h3>
                  <div className="space-y-2">
                    {character.funFacts.map((fact, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-800">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold mb-2">Famous Quote</h3>
                  <blockquote className="text-sm italic text-blue-800">
                    "{character.quote}"
                  </blockquote>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default EducationalCharacters;
