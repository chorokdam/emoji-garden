import { Riddle } from './types';

export const FALLBACK_RIDDLES: Riddle[] = [
  {
    id: 'f1',
    emojis: '⚡️👓🧙‍♂️🏰',
    question: '영화를 맞춰보세요',
    correctAnswer: '해리포터',
    options: ['반지의 제왕', '해리포터', '닥터 스트레인지', '신비한 동물사전'],
    category: '영화'
  },
  {
    id: 'f2',
    emojis: '🦑🎮🟢🔺',
    question: '드라마를 맞춰보세요',
    correctAnswer: '오징어 게임',
    options: ['더 글로리', '오징어 게임', '지옥', '킹덤'],
    category: '드라마'
  },
  {
    id: 'f3',
    emojis: '❄️☃️👑🏰',
    question: '애니메이션을 맞춰보세요',
    correctAnswer: '겨울왕국',
    options: ['라푼젤', '겨울왕국', '모아나', '엘리멘탈'],
    category: '영화'
  },
  {
    id: 'f4',
    emojis: '🧞‍♂️✨🕌🐒',
    question: '영화를 맞춰보세요',
    correctAnswer: '알라딘',
    options: ['신데렐라', '미녀와 야수', '알라딘', '인어공주'],
    category: '영화'
  },
  {
    id: 'f5',
    emojis: '🎤💜🕺🧨',
    question: '가수를 맞춰보세요',
    correctAnswer: 'BTS',
    options: ['세븐틴', 'BTS', 'EXO', '블랙핑크'],
    category: 'K-POP'
  }
];
