export function delayPromise(delayInMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve();

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }, delayInMs);
  });
}
