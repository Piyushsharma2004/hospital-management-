import gradio as gr
import numpy as np
from keras.models import load_model
import cv2

# Load your trained model
model = load_model('best_model.h5')  # Replace with your saved model path

# List of class names
Emotion_Classes = ['Bacterial Pneumonia', 'Corona Virus Disease', 'Normal', 'Tuberculosis', 'Viral Pneumonia']

# Define a prediction function
def predict_condition(image):
    # Convert the image from RGB to BGR (if required by your model)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert to BGR if necessary

    # Resize the image to match the model's expected input size
    image = cv2.resize(image, (224, 224))  # Adjust (224, 224) if your model expects a different size
    
    # Normalize the image if the model was trained with normalized data
    image = image / 255.0  # Normalize image to [0, 1] range
    
    # Expand dimensions to match the model's input (batch size, height, width, channels)
    image = np.expand_dims(image, axis=0)
    
    # Predict the class
    prediction = model.predict(image)
    predicted_class = np.argmax(prediction)
    
    return f"Predicted Condition: {Emotion_Classes[predicted_class]}"

# Define Gradio interface
interface = gr.Interface(
    fn=predict_condition, 
    inputs=gr.Image(type="numpy"),  # Input type is numpy array
    outputs=gr.Text(),
    title="Disease Classification from Chest X-Ray",
    description="Upload a chest X-ray image, and the model will predict the disease category."
)

# Launch the interface with the share option
interface.launch(share=True)  # Set share=True to generate a public link

