from ultralytics import YOLO
from clearml import Task

task = Task.init(
    project_name='hand_position', 
    task_name='Train', 
    tags=['100e', '16b'])

model = YOLO('yolov8n.pt')

results = model.train(
    data='ds/data.yaml',
    imgsz=416,
    epochs=100,
    batch=16,
    name='yolo8n_v8_100e_hp'
)