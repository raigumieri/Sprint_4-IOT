from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import pickle
import os
import base64
from io import BytesIO
from PIL import Image
import tempfile

app = Flask(__name__)
CORS(app)

DB_FILE = "faces_db_deepface.pkl"

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "rb") as f:
            return pickle.load(f)
    return {}

def save_db(faces_db):
    with open(DB_FILE, "wb") as f:
        pickle.dump(faces_db, f)

def base64_to_image(base64_string):
    """Converte base64 para imagem"""
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_bytes))
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return np.array(image)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "API DeepFace - XPeriencia"})

@app.route('/reconhecer-face', methods=['POST'])
def reconhecer_face():
    try:
        data = request.get_json()
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"error": "Imagem não fornecida"}), 400
        
        # Converte imagem
        img = base64_to_image(image_data)
        
        # Salva temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            cv2.imwrite(tmp_file.name, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
            temp_path = tmp_file.name
        
        try:
            # Extrai embedding usando DeepFace
            embedding_obj = DeepFace.represent(
                img_path=temp_path,
                model_name="Facenet",
                enforce_detection=True
            )
            
            if not embedding_obj:
                return jsonify({
                    "success": False,
                    "message": "Nenhuma face detectada"
                })
            
            embedding = np.array(embedding_obj[0]["embedding"])
            
            # Carrega DB
            faces_db = load_db()
            
            if len(faces_db) == 0:
                return jsonify({
                    "success": False,
                    "message": "Nenhum usuário cadastrado ainda."
                })
            
            # Compara com faces conhecidas
            melhor_match = None
            menor_distancia = float('inf')
            threshold = 10.0  # Distância euclidiana
            
            for nome, emb_conhecido in faces_db.items():
                distancia = np.linalg.norm(embedding - emb_conhecido)
                if distancia < menor_distancia and distancia < threshold:
                    menor_distancia = distancia
                    melhor_match = nome
            
            if melhor_match:
                confianca = max(0, (1 - menor_distancia / threshold) * 100)
                return jsonify({
                    "success": True,
                    "nome": melhor_match,
                    "confianca": f"{confianca:.2f}%",
                    "message": f"Bem-vindo, {melhor_match}!"
                })
            else:
                return jsonify({
                    "success": False,
                    "message": "Face não reconhecida. Por favor, cadastre-se primeiro."
                })
        
        finally:
            # Remove arquivo temporário
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({"error": "Erro ao processar imagem. Certifique-se de que há uma face visível."}), 500

@app.route('/cadastrar-face', methods=['POST'])
def cadastrar_face():
    try:
        data = request.get_json()
        image_data = data.get('image')
        nome = data.get('nome')
        email = data.get('email')
        
        if not image_data or not nome:
            return jsonify({"error": "Imagem e nome são obrigatórios"}), 400
        
        # Converte imagem
        img = base64_to_image(image_data)
        
        # Salva temporariamente
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            cv2.imwrite(tmp_file.name, cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
            temp_path = tmp_file.name
        
        try:
            # Extrai embedding
            embedding_obj = DeepFace.represent(
                img_path=temp_path,
                model_name="Facenet",
                enforce_detection=True
            )
            
            if not embedding_obj:
                return jsonify({"error": "Nenhuma face detectada"}), 400
            
            if len(embedding_obj) > 1:
                return jsonify({"error": "Múltiplas faces detectadas"}), 400
            
            embedding = np.array(embedding_obj[0]["embedding"])
            
            # Salva no DB
            faces_db = load_db()
            chave = email if email else nome
            
            if chave in faces_db:
                return jsonify({"error": f"Usuário '{nome}' já cadastrado"}), 400
            
            faces_db[chave] = embedding
            save_db(faces_db)
            
            return jsonify({
                "success": True,
                "message": f"Face de {nome} cadastrada com sucesso!",
                "total_cadastros": len(faces_db)
            })
        
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({"error": "Erro ao processar imagem"}), 500

@app.route('/verificar-cadastro', methods=['POST'])
def verificar_cadastro():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email é obrigatório"}), 400
        
        faces_db = load_db()
        cadastrado = email in faces_db
        
        return jsonify({
            "cadastrado": cadastrado,
            "message": "Face já cadastrada" if cadastrado else "Face não cadastrada"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/listar-usuarios', methods=['GET'])
def listar_usuarios():
    try:
        faces_db = load_db()
        return jsonify({
            "total": len(faces_db),
            "usuarios": list(faces_db.keys())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("API de Reconhecimento Facial - XPeriencia")
    print("Usando: DeepFace (Facenet)")
    print("=" * 60)
    print("Servidor rodando em: http://0.0.0.0:5000")
    print("=" * 60 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)