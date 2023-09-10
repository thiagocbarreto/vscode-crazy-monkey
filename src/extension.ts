import * as vscode from 'vscode';

let timer: NodeJS.Timeout;

export function activate(context: vscode.ExtensionContext) {
  console.log('Crazy Monkey is activated!');

  const startCrazyMonkey = vscode.commands.registerCommand('crazy-monkey.startCrazyMonkey', async () => {
    const config = vscode.workspace.getConfiguration('crazy-monkey');
    const intervalInMinutes = Math.max(0.01, config.get<number>('interval', 0.05));
    const interval = intervalInMinutes * 60 * 1000;

    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const lineCount = editor.document.lineCount;
        const randomLine = Math.floor(Math.random() * lineCount);
        const randomStr = Math.random().toString(36).substring(7);

        editor.edit(editBuilder => {
          editBuilder.insert(new vscode.Position(randomLine, 0), `${randomStr}\n`);
        });
      }
    }, interval);

    vscode.window.showInformationMessage('Crazy Monkey started!');
  });

  const stopCrazyMonkey = vscode.commands.registerCommand('crazy-monkey.stopCrazyMonkey', () => {
    if (timer) {
      clearInterval(timer);
      vscode.window.showInformationMessage('Crazy Monkey stopped!');
    }
  });

  context.subscriptions.push(startCrazyMonkey);
  context.subscriptions.push(stopCrazyMonkey);
}

export function deactivate() {
  if (timer) {
    clearInterval(timer);
  }
}