from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Charger le modèle et le scaler
model = joblib.load("nn_model.pkl")
scaler = joblib.load("scaler.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    revenu = data["revenu"]
    remboursement = data["remboursement"]
    duree = data["duree"]
    taux = data["taux"]

    # Préparation des données
    X = np.array([[revenu, remboursement, duree, taux]])
    X_scaled = scaler.transform(X)

    # Prédiction
    probabilities = model.predict_proba(X_scaled)[0]
    prediction = model.predict(X_scaled)[0]

    # Probabilité de la classe 1
    proba = probabilities[1]

    decision = "RISQUE_ELEVE" if prediction == 1 else "RISQUE_FAIBLE"

    

    # Debug
    print("===================================")
    print("Input :", X)
    print("Input scaled :", X_scaled)
    print("Probabilities :", probabilities)
    print("Prediction :", prediction)
    print("Risk probability :", proba)
    print("Decision :", decision)
    print("===================================")

    return jsonify({
        "score_risque": float(proba),
        "decision": decision
    })


if __name__ == "__main__":
    app.run(port=5000)