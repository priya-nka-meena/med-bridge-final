#!/bin/bash
echo "Installing NLP dependencies..."
pip install -r requirements.txt --quiet
echo "Starting MedBridge NLP service on port 5001..."
python app.py
