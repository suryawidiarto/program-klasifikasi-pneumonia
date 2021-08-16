from flask import Flask, render_template, url_for, request
from werkzeug.utils import secure_filename

import numpy as np
import os
import cv2
from keras.preprocessing import image
from keras.models import load_model

app = Flask(__name__)

model = load_model('model.h5')

def predict_image(model,image_path):
    predict_img = image.load_img(image_path, target_size = (256, 256))
    predict_img = image.img_to_array(predict_img)
    predict_img = np.expand_dims(predict_img, axis = 0)
    hasil = np.argmax((model.predict(predict_img)), axis=-1)
    return hasil[0]

@app.route("/")
def home():
    return render_template('main.html')

@app.route("/predict", methods=["POST"])
def predict():  
    img = request.files['image']
    directory = os.path.dirname(__file__)
    image_path = os.path.join(directory, 'uploads', secure_filename(img.filename))
    img.save(image_path)
    
    image = cv2.imread(image_path)
    lab_image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab_image)
    clahe = cv2.createCLAHE(clipLimit=1, tileGridSize=(8,8))
    l_clahe = clahe.apply(l)
    new_lab_image = cv2.merge((l_clahe,a,b))
    clahe_image = cv2.cvtColor(new_lab_image, cv2.COLOR_LAB2BGR)
    cv2.imwrite(image_path,clahe_image)
    
    predict = str(predict_image(model, image_path))
    return predict

if __name__ == '__main__':
    app.run()



