from ultralytics import YOLO

model = YOLO('weights/hand_position.pt')

model.export(format='onnx', nms=True)