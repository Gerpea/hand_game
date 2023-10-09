from ultralytics import YOLO

model = YOLO('weights/hand_position.onnx')

results = model('test.jpg', imgsz=416)  # results list

# View results
for r in results:
    print(r)