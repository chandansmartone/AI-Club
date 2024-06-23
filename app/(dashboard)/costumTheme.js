// custom-theme.js

export const customTheme = {
  'code[class*="language-"]': {
    color: '#f8f8f2',
    background: 'none',
    fontFamily: 'Inconsolata, Monaco, Consolas, "Courier New", Courier, monospace',
    fontSize: '16px',
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#f8f8f2',
    background: '#282a36',
    overflow: 'auto',
    position: 'relative',
    margin: '0.5em 0',
    padding: '1.25em',
    borderRadius: '0.3em',
  },
  // Customize the styling for functions, class names, and important parts of the code.
  '.token.function': {
    color: '#50fa7b',
  },
  '.token.class-name': {
    color: '#bd93f9',
  },
  '.token.keyword, .token.operator': {
    color: '#ff79c6',
  },
};
