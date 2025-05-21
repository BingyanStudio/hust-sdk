import * as readline from 'readline';

/**
 * Prompts the user for input in the console with the given message
 * 
 * @param message The message to display to the user
 * @returns A promise that resolves to the user's input
 */
export const promptConsole = async (message: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise<string>((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

/**
 * Default implementation for requesting a phone verification code via console
 * 
 * @returns A promise that resolves to the verification code entered by the user
 */
export const getPhoneCodeFromConsole = async (): Promise<string> => {
  console.log('Phone verification code has been sent to your mobile phone.');
  const code = await promptConsole('Please enter the verification code: ');
  return code;
};
