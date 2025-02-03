'use client'
import React, { useState, useEffect } from 'react';
import { Book, Stethoscope, HeartPulse, Info, AlertTriangle, Sun, MapPin, Clock, Thermometer, Menu, X } from 'lucide-react';

interface DiseaseContent {
  images: string[];
  summary?: string | string[];
  possible_causes?: string[];
  risk_factors?: string[];
  symptoms?: string[];
  home_remedies?: string[];
  complications?: string[];
  when_to_see_a_doctor?: string[];
  whom_to_consult?: string[];
  calorie_and_diet_intake?: string;
  Diagnosis?: string[];
  conclusion?: string[];
  recommendation?: string[];
}

interface Disease {
  title: string;
  content: DiseaseContent;
}

const DiseaseDetailPage: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch('/data/all_disease.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Disease[] = await response.json();
        setDiseases(data);
        if (data.length > 0) {
          setSelectedDisease(data[0]);
        }
      } catch (error) {
        console.error('Error fetching diseases:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    };

    fetchDiseases();
  }, []);

  const DetailSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="bg-orange-50 p-4 rounded-lg mb-4">
      <div className="flex items-center mb-2">
        <Icon className="mr-2 text-orange-600" size={20} />
        <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const renderListSection = (title: string, items: string[] | undefined, icon: React.ElementType) => {
    if (!items || items.length === 0) return null;
    
    return (
      <DetailSection icon={icon} title={title}>
        <ul className="list-disc pl-5 text-orange-800">
          {items.map((item, index) => (
            <li key={index} className="mb-1">{item}</li>
          ))}
        </ul>
      </DetailSection>
    );
  };

  const renderTextSection = (title: string, content: string | string[] | undefined, icon: React.ElementType) => {
    if (!content) return null;

    return (
      <DetailSection icon={icon} title={title}>
        {typeof content === 'string' ? (
          <p className="text-orange-700">{content}</p>
        ) : (
          <ul className="list-disc pl-5 text-orange-800">
            {content.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        )}
      </DetailSection>
    );
  };

  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        Error loading diseases: {error}
        <p>Ensure the JSON file is in the correct public folder location.</p>
      </div>
    );
  }

  if (diseases.length === 0) {
    return <div className="text-center p-6">Loading diseases...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Mobile Disease List Toggle */}
        <div className="md:hidden flex justify-between items-center bg-white rounded-xl shadow-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-orange-700">Detected Diseases</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-orange-600"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Disease List */}
        <div className={`
          col-span-1 bg-white rounded-xl shadow-lg p-4 
          ${isMobileMenuOpen ? 'block' : 'hidden'} md:block 
          overflow-y-auto max-h-[90vh]
        `}>
          <h2 className="text-2xl font-bold text-orange-700 mb-4 hidden md:block">Detected Diseases</h2>
          <div className="space-y-2">
            {diseases.map((disease) => (
              <button
                key={disease.title}
                onClick={() => {
                  setSelectedDisease(disease);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedDisease?.title === disease.title 
                    ? 'bg-orange-600 text-white' 
                    : 'hover:bg-orange-100 text-orange-800'
                }`}
              >
                {disease.title}
              </button>
            ))}
          </div>
        </div>

        {/* Disease Details */}
        {selectedDisease && (
          <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6 overflow-y-auto max-h-[90vh]">
            <h1 className="text-2xl md:text-3xl font-bold text-orange-800 mb-4 md:mb-6">{selectedDisease.title}</h1>
            
            {/* Image Gallery */}
            {selectedDisease.content.images && selectedDisease.content.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                {selectedDisease.content.images.map((imageUrl, index) => (
                  <img 
                    key={index} 
                    src={imageUrl} 
                    alt={`${selectedDisease.title} - Image ${index + 1}`} 
                    className="rounded-lg object-cover h-32 md:h-48 w-full" 
                  />
                ))}
              </div>
            )}

            {/* Dynamic Sections with Flexible Rendering */}
            {renderTextSection("Summary", selectedDisease.content.summary, Info)}
            {renderListSection("Possible Causes", selectedDisease.content.possible_causes, Stethoscope)}
            {renderListSection("Risk Factors", selectedDisease.content.risk_factors, AlertTriangle)}
            {renderListSection("Symptoms", selectedDisease.content.symptoms, Thermometer)}
            {renderListSection("Home Remedies", selectedDisease.content.home_remedies, Sun)}
            {renderListSection("Complications", selectedDisease.content.complications, Clock)}
            {renderListSection("When to See a Doctor", selectedDisease.content.when_to_see_a_doctor, MapPin)}
            {renderListSection("Whom to Consult", selectedDisease.content.whom_to_consult, Book)}
            {renderTextSection("Calorie and Diet Intake", selectedDisease.content.calorie_and_diet_intake, Stethoscope)}
            {renderTextSection("Diagnosis", selectedDisease.content.Diagnosis, Info)}
            {renderListSection("Conclusion", selectedDisease.content.conclusion, Book)}
            {renderListSection("Recommendation", selectedDisease.content.recommendation, MapPin)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetailPage;