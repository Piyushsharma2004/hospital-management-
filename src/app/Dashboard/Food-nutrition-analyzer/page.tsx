import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DailyFoodReport from "@/components/food-nutrition/dailyfoodreport";


const FoodNutritionAnalyzerPage= () => {
  return (
    <DefaultLayout>
      <div className=" ">
      <DailyFoodReport />
      </div>
    </DefaultLayout>
  );
};

export default FoodNutritionAnalyzerPage;
