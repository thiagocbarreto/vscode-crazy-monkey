import * as assert from 'assert';
import * as vscode from 'vscode';
import { beforeEach, afterEach } from 'mocha';
// Remember to import your activate function from your extension.ts file to ensure the extension is activated during the tests. Depending on your project setup, the import path may vary.
import { activate, deactivate } from '../../extension';

let doc: vscode.TextDocument;
let editor: vscode.TextEditor;
let originalText: string;

suite('Extension Test Suite', function () {
  this.timeout(5000);
  
  vscode.window.showInformationMessage('Start all tests.');

  beforeEach(async () => {
    doc = await vscode.workspace.openTextDocument({ 
      content: `Initial line 1\nInitial line 2\nInitial line 3\n`
    });
    editor = await vscode.window.showTextDocument(doc);
    originalText = doc.getText();
  });

  afterEach(async () => {
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('thiagobarreto.crazy-monkey'));
  });

  test('Extension should activate', function(done) {
    this.timeout(1 * 60 * 1000);
    const extension = vscode.extensions.getExtension('thiagobarreto.crazy-monkey');
    if (!extension) {
      return done(new Error('Extension not found.'));
    }
    extension.activate().then((api) => {
      done();
    }, done);
  });

  test('Should register all Crazy Monkey commands', async () => {
    const allCommands = await vscode.commands.getCommands(true);

    const crazyMonkeyCommands = [
      'crazy-monkey.startCrazyMonkey',
      'crazy-monkey.stopCrazyMonkey'
    ];

    let filteredCommands = allCommands.filter((command) => {
      return crazyMonkeyCommands.indexOf(command) >= 0 || command.startsWith('crazy-monkey.');
    });
    
    filteredCommands = filteredCommands.sort();

    assert.deepStrictEqual(filteredCommands, crazyMonkeyCommands);
  });

  test('Should insert text into active editor', async () => {
    await vscode.workspace.getConfiguration('crazy-monkey').update('interval', 0.01, vscode.ConfigurationTarget.Global);
    await vscode.commands.executeCommand('crazy-monkey.startCrazyMonkey');
    await new Promise(resolve => setTimeout(resolve, 800)); // > 0.01 * 60 * 1000 = 600 ms
    const modifiedText = doc.getText();
    assert.notStrictEqual(modifiedText, originalText);
  });

  test('Should stop inserting text into active editor', async () => {
    await vscode.workspace.getConfiguration('crazy-monkey').update('interval', 0.01, vscode.ConfigurationTarget.Global);
    await vscode.commands.executeCommand('crazy-monkey.startCrazyMonkey');
    await new Promise(resolve => setTimeout(resolve, 800)); // > 0.01 * 60 * 1000 = 600 ms
    const modifiedText = doc.getText();
    await vscode.commands.executeCommand('crazy-monkey.stopCrazyMonkey');
    await new Promise(resolve => setTimeout(resolve, 800));// > 0.01 * 60 * 1000 = 600 ms
    const furtherModifiedText = doc.getText();
    assert.strictEqual(modifiedText, furtherModifiedText);
  });

  test('Should deactivate extension', async () => {
    deactivate();
  });
});
