import { CalculatedControl } from 'core/modules/data/models';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';

export function generateControls(
  applicableFrameworkIds: string[],
  controlsByFramework: {[frameworkId: string]: CalculatedControl[]},
  isAnecdotes = true
): CalculatedControl[] {
  const isAnecdotesCheck = isAnecdotes;
  const controls = generateControlsByFilter();
  return controls
    ?.reduce((acc, curr) => acc.concat(curr), []);

  function generateControlsByFilter(): CalculatedControl[][] {
    return Object.keys(controlsByFramework)
      .filter((frameworkId) => isDesiredFramework(frameworkId))
      .map((frameworkId) => Object.values(controlsByFramework[frameworkId]));
  }

  function isDesiredFramework(frameworkId: string): boolean {
    return isAnecdotesCheck
      ? frameworkId === AnecdotesUnifiedFramework.framework_id
      : frameworkId !== AnecdotesUnifiedFramework.framework_id && applicableFrameworkIds.includes(frameworkId);
  }
}
