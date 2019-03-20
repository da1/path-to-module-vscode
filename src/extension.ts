// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "path-to-module" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let file2moduleDisposable = vscode.commands.registerCommand('extension.file2module', () => {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('editor not found');
			return;
		}

		let rootPath = vscode.workspace.rootPath;
		if (!rootPath) {
			return;
		}

		let uri = editor.document.fileName;
		let relativePath = uri.substr(rootPath.length + 1);

		let moduleName = relativePath.replace(/^(t\/)?lib\//, '').replace(/\.(pm|t)$/, '').replace(/\//g, '::');
		vscode.env.clipboard.writeText(moduleName);
		editor.edit(editBuilder => {
			if (!editor) {
				return;
			}
			editor.selections.forEach(selection => {
				editBuilder.insert(selection.start, moduleName);
			});
		});

		vscode.window.showInformationMessage('file to module');
	});
	context.subscriptions.push(file2moduleDisposable);

	let disposable = vscode.commands.registerCommand('extension.module2file', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('editor not found');
			return;
		}

		let prefix = "lib/";
		let ext    = ".pm";

		let selection = editor.selection;

		let doc = editor.document;
		let text = doc.getText(selection);

		let file = text.replace(/::/g, '/');

		let rootPath = vscode.workspace.rootPath;
		if (!rootPath) {
			return;
		}

		let fileURL = vscode.Uri.file(rootPath + "/" + prefix + file + ext);
		let success = vscode.commands.executeCommand('vscode.open', fileURL);

		// Display a message box to the user
		vscode.window.showInformationMessage('module to file');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
