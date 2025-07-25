const { JSDOM } = require('jsdom');

// Setup DOM for jsdom
const dom = new JSDOM('<!DOCTYPE html><input id="input"><div id="output"></div>');

global.window = dom.window;
global.document = dom.window.document;
// stub requestAnimationFrame so script can load
window.requestAnimationFrame = () => {};
global.requestAnimationFrame = window.requestAnimationFrame;

const engine = require('..');

// disable LLM calls
window.useLLM = false;

const mockPrint = jest.fn();
engine.setPrintln(mockPrint);

describe('enterRoom', () => {
  test('calls onEnter and prints description', async () => {
    const onEnter = jest.fn();
    const disk = {
      roomId: 'start',
      rooms: [ { id: 'start', desc: 'A room', onEnter } ],
      inventory: [],
      characters: []
    };

    engine(disk); // initial load
    mockPrint.mockClear();
    onEnter.mockClear();

    await expect(engine.enterRoom('start')).resolves.not.toThrow(); // not to throw

    expect(onEnter).toHaveBeenCalled();
    expect(mockPrint).toHaveBeenCalledWith('A room');
  });
});
