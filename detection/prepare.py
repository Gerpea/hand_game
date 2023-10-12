import json
import base64
from PIL import Image
from io import BytesIO
import os

with open('hand_gesture_ds/samples_1697132887287.json') as samples_file:
    samples = json.load(samples_file)

counter = {
    
}
altchars=b'+/'
for sample in samples:
    imagestr = sample['image'][sample['image'].find(",")+1:]
    imgdata = base64.b64decode(imagestr)
    img = Image.open(BytesIO(imgdata)).convert('RGB')
    
    gesture = sample["gesture"]
    
    if gesture in counter: 
        counter[gesture] += 1
    else :
        counter[gesture] = 0
    
    save_path = f'hand_gesture_ds/full/{sample["gesture"]}'
    if not os.path.exists(save_path):
            os.makedirs(save_path)
    img.save(save_path + f'/{sample["gesture"]}_{counter.get(gesture)}.jpg')
    
    box = sample['box']
    img = img.crop((box['x'], box['y'], box['x'] + box['w'], box['y'] + box['h']))
    img = img.resize((416, 416))
    save_path = f'hand_gesture_ds/crop/{sample["gesture"]}'
    if not os.path.exists(save_path):
            os.makedirs(save_path)
    img.save(save_path + f'/{sample["gesture"]}_{counter.get(gesture)}.jpg')