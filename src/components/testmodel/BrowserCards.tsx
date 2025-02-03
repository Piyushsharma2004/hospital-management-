'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { Globe, ArrowLeft } from 'lucide-react';

interface CardData {
  id: number;
  title: string;
  description: string;
  url: string;
  previewImage: string; // Add preview screenshot
}

const cardData = [
  {
    id: 1,
    title: 'Chest X-ray Analyzer',
    description: 'X-ray Analyzer on our Huggingface Account',
    url: 'https://huggingface.co/spaces/sahilyaduvanshi9467/sahil_yadavuvanshi',
    previewImage: '/path/to/preview1.jpg',
    
  },
  {
    id: 2,
    title: 'Brain X-ray (MRI) Analyzer',
    description: 'Magnetic resonance imaging Analyzer on our Huggingface Account',
    url: 'https://huggingface.co/spaces/sahilyaduvanshi9467/tumour',
    previewImage: '/path/to/preview3.jpg',
    
  },
  {
    id: 3,
    title: 'Diet Analysis',
    description: 'Diet Analysis for track your Schedule on our Huggingface Account',
    url: 'https://huggingface.co/spaces/sahilyaduvanshi9467/nutrition',
    previewImage: '/path/to/preview2.jpg',
  }
];

const BrowserCards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleCardClick = (card: CardData) => {
    // Option 1: Open new window
    window.open(card.url, '_blank');

    // Option 2: Show preview image
    // setSelectedCard(card);
  };
  if (selectedCard) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <Image 
          src={selectedCard.previewImage} 
          alt={selectedCard.title} 
          layout="fill"
          objectFit="contain"
          className="max-w-full max-h-full"
        />
        <button 
          onClick={() => setSelectedCard(null)}
          className="
            absolute top-6 left-6 
            bg-orange-500 dark:bg-orange-600 
            text-white 
            px-4 py-2 
            rounded-full
          "
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cardData.map((card) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="
              group relative 
              bg-white dark:bg-gray-800
              border border-orange-100 dark:border-orange-800 
              rounded-2xl 
              shadow-lg 
              overflow-hidden 
              cursor-pointer 
              transform transition 
              hover:-translate-y-2 
              hover:shadow-2xl
            "
          >
            <div className="p-6">
              <div className="
                absolute top-0 right-0 
                w-24 h-24 
                bg-orange-500 dark:bg-orange-600
                rounded-bl-full 
                group-hover:bg-orange-600 
                transition-colors
              "></div>
              
              <div className="relative z-10">
                <Globe className="
                  w-12 h-12 mb-4 
                  text-orange-600 dark:text-orange-400
                  group-hover:text-orange-700 dark:group-hover:text-orange-500
                  transition-colors
                " />
                <h2 className="
                  text-2xl font-bold mb-2 
                  text-gray-800 dark:text-white
                  group-hover:text-orange-900 dark:group-hover:text-orange-400
                  transition-colors
                ">
                  {card.title}
                </h2>
                <p className="
                  text-gray-600 dark:text-gray-300
                  group-hover:text-gray-800 dark:group-hover:text-white
                  transition-colors
                ">
                  {card.description}
                </p>
              </div>
            </div>
            <div className="
              absolute bottom-0 right-0 
              p-4 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity
            ">
              <span className="
                text-orange-600 dark:text-orange-400
                font-semibold 
                group-hover:text-orange-800 dark:group-hover:text-orange-500
              ">
                Explore →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserCards;