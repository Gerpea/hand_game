This uses YOLOv8 detection model

* First place your dataset in [yolo format](https://docs.ultralytics.com/tasks/detect/#dataset-format) inside ds folder
* If you want to track progress with clearml init it by executing `clearml-init`
* Then run `python train.py`
* If you need model in onnx format run `python export.py`