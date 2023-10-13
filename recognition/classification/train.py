from ultralytics import YOLO
from clearml import Task, Logger

task = Task.init(
    project_name='hand_gesture_classification', 
    task_name='Train', 
    tags=['100e', '16b'])

model = YOLO('yolov8n-cls.pt')

results = model.train(
    data='ds/ds',
    imgsz=416,
    epochs=100,
    batch=16,
    name='yolo8n_v8_100e_hc'
)