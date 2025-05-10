import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const MLTrainingPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 10 seconds
    const animationFrame = requestAnimationFrame(function update() {
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = Math.max(0, 100 - (elapsedTime / duration) * 100);
      
      setProgress(remainingProgress);

      if (remainingProgress > 0) {
        requestAnimationFrame(update);
      } else {
        setIsVisible(false);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-10 z-[9999999] w-80">
      <div className="relative bg-white/20 backdrop-blur-lg border border-orange-400 rounded-xl shadow-xl overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 h-1 bg-orange-400" 
          style={{ width: `${progress}%` }}
        />
        <div className="p-4 flex items-center">
          <div className="bg-orange-100/50 rounded-full p-2 mr-3">
            <AlertTriangle className="text-orange-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-orange-600 font-semibold text-base mb-1">
              AI Models in Development
            </h3>
            <p className="text-orange-600 text-xs">
              Than check our ML models in Test Model Page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLTrainingPopup;