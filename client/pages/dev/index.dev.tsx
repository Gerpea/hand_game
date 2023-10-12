import { useCallback, useEffect, useRef, useState } from "react";
import { Box, useHandPosition } from "hand_detector";
import styled from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useCameraImage } from "@/hooks";
import { saveAs } from "file-saver";
import { useGesture } from "@/hooks/useGesture";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

let timeoutId: NodeJS.Timeout;

type Sample = {
  gesture: string;
  image: string;
  box: Box;
};

export default function DevHome() {
  const recordSamples = useRef(false);
  const samplesRef = useRef<Sample[]>([]);
  const { gesture, nextGesture } = useGesture();
  const [samplesCounter, setSamplesCounter] = useState<{
    total: number;
    [gesture: string]: number;
  }>({
    total: 0,
  });

  const cameraImage = useCameraImage();
  const [boxes, setBoxes] = useState<Box[]>([]);

  const { detect } = useHandPosition({
    scoreThreshold: 0.7,
    iouThreshold: 0.6,
    topk: 2,
  });

  const addSample = useCallback((sample: Sample) => {
    samplesRef.current.push(sample);
    setSamplesCounter((counter) => {
      counter.total = samplesRef.current.length;
      counter[sample.gesture] = samplesRef.current.filter(
        (s) => s.gesture === sample.gesture
      ).length;

      return counter;
    });
  }, []);

  const saveSamples = useCallback(() => {
    saveAs(
      new File(
        [JSON.stringify(samplesRef.current)],
        `samples_${Date.now()}.json`,
        {
          type: "text/plain;charset=utf-8",
        }
      )
    );
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (ev) => {
      if (ev.key === " " && !recordSamples.current) {
        recordSamples.current = true;
        setTimeout(() => {
          recordSamples.current = false;
          nextGesture();
        }, 5000);
      }
    });
  }, [nextGesture]);

  useEffect(() => {
    if (!cameraImage) {
      return;
    }

    if (timeoutId) {
      return;
    }

    timeoutId = setTimeout(() => {
      (async () => {
        // @ts-ignore
        timeoutId = undefined;

        console.time("Detection");
        const boxes = await detect(cameraImage);
        console.timeEnd("Detection");
        if (boxes[0] && recordSamples.current) {
          addSample({
            gesture: gesture.label,
            box: boxes[0],
            image: cameraImage,
          });
        }
        setBoxes(boxes);
      })();
    }, 300);
  }, [cameraImage, detect, gesture, addSample]);

  return (
    <>
      <p>
        Fold you finger to gesture on the card, wait for green box appear around
        you hand
      </p>
      <p>Then press the spacebar and wait a 3 seconds</p>
      <p>Repeat</p>
      <StyledContainer>
        <GestureCard gesture={gesture.label} />
        <HandCard imgSrc={cameraImage} boxes={boxes} />
      </StyledContainer>
      {recordSamples.current && <p>Recording samples...</p>}
      {Object.keys(samplesCounter).map((key) => {
        return (
          <p key={key}>
            Gesture [{key}]: {samplesCounter[key]}
          </p>
        );
      })}
      <button onClick={saveSamples}>Save samples</button>
    </>
  );
}
