import { Filter } from '../types';

export const AVAILABLE_FILTERS: Filter[] = [
  {
    id: 'brightness',
    name: '밝기',
    type: 'color',
    parameters: { value: 0, min: -1, max: 1 }
  },
  {
    id: 'contrast',
    name: '대비',
    type: 'color',
    parameters: { value: 1, min: 0, max: 2 }
  },
  {
    id: 'saturation',
    name: '채도',
    type: 'color',
    parameters: { value: 1, min: 0, max: 2 }
  },
  {
    id: 'hue',
    name: '색조',
    type: 'color',
    parameters: { value: 0, min: -180, max: 180 }
  },
  {
    id: 'blur',
    name: '블러',
    type: 'blur',
    parameters: { value: 0, min: 0, max: 10 }
  },
  {
    id: 'sharpen',
    name: '선명도',
    type: 'effect',
    parameters: { value: 0, min: 0, max: 1 }
  },
  {
    id: 'vintage',
    name: '빈티지',
    type: 'effect',
    parameters: { value: 0, min: 0, max: 1 }
  },
  {
    id: 'blackAndWhite',
    name: '흑백',
    type: 'effect',
    parameters: { value: 0, min: 0, max: 1 }
  },
  {
    id: 'sepia',
    name: '세피아',
    type: 'effect',
    parameters: { value: 0, min: 0, max: 1 }
  },
  {
    id: 'invert',
    name: '반전',
    type: 'effect',
    parameters: { value: 0, min: 0, max: 1 }
  }
];

export const getFilterById = (id: string): Filter | undefined => {
  return AVAILABLE_FILTERS.find(filter => filter.id === id);
}; 