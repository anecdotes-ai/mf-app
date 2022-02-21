export function delayedPromise(delay: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
