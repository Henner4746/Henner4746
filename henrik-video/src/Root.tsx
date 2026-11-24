import React from 'react';
import {Composition} from 'remotion';
import {Henrik, TOTAL} from './Henrik';
export const Root: React.FC = () => (
  <Composition id="Henrik" component={Henrik} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
