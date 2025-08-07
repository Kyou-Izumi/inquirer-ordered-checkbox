# inquirer-ordered-checkbox

[![npm version](https://badge.fury.io/js/inquirer-ordered-checkbox.svg)](https://badge.fury.io/js/inquirer-ordered-checkbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sortable checkbox prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) that maintains the order of selection. Perfect for prioritizing tasks, ranking options, or creating ordered lists.

## Features

- ✅ **Multi-select with ordering**: Select multiple options while preserving selection order
- 🔢 **Visual order indicators**: See the selection order with numbered badges
- ⌨️ **Keyboard navigation**: Full keyboard support for accessibility
- 🎨 **Customizable themes**: Style the prompt to match your application
- 📦 **TypeScript support**: Full type definitions included
- 🚀 **Modern ESM**: Built with modern JavaScript modules

## Installation

```bash
npm install inquirer-ordered-checkbox
```

## Usage

### Basic Example

```typescript
import orderedCheckbox from 'inquirer-ordered-checkbox';

const answer = await orderedCheckbox({
  message: 'Select your priorities in order:',
  choices: [
    'Complete project documentation',
    'Fix critical bugs',
    'Implement new features',
    'Code review',
    'Write tests'
  ]
});

console.log('Your priorities:', answer);
// Output: ['Fix critical bugs', 'Complete project documentation', 'Write tests']
```

### Advanced Configuration

```typescript
import orderedCheckbox from 'inquirer-ordered-checkbox';

const answer = await orderedCheckbox({
  message: 'Configure your development workflow:',
  choices: [
    {
      name: 'Set up CI/CD pipeline',
      value: 'cicd',
      description: 'Automated testing and deployment'
    },
    {
      name: 'Code quality tools',
      value: 'quality',
      description: 'Linting, formatting, and analysis'
    },
    {
      name: 'Documentation',
      value: 'docs',
      description: 'API docs and user guides',
      checked: true // Pre-selected
    },
    {
      name: 'Performance monitoring',
      value: 'monitoring',
      description: 'Track app performance and errors'
    },
    {
      name: 'Legacy system',
      value: 'legacy',
      disabled: true // Cannot be selected
    }
  ],
  validate: (choices) => {
    if (choices.length === 0) {
      return 'Please select at least one option.';
    }
    if (choices.length > 3) {
      return 'Please select no more than 3 options.';
    }
    return true;
  }
});
```

### With Separators

```typescript
import orderedCheckbox, { Separator } from 'inquirer-ordered-checkbox';

const answer = await orderedCheckbox({
  message: 'Choose your tech stack:',
  choices: [
    'Frontend Frameworks',
    new Separator(),
    'React',
    'Vue.js',
    'Angular',
    new Separator(),
    'Backend Technologies', 
    new Separator(),
    'Node.js',
    'Python',
    'Go'
  ]
});
```

## API

### `orderedCheckbox(config)`

#### Configuration Options

| Option     | Type                                   | Default | Description                           |
| ---------- | -------------------------------------- | ------- | ------------------------------------- |
| `message`  | `string`                               |         | The question to ask the user          |
| `choices`  | `Array<Choice \| Separator \| string>` |         | List of choices                       |
| `validate` | `function`                             |         | Validation function for the answer    |
| `theme`    | `object`                               |         | Custom theme configuration            |
| `pageSize` | `number`                               | `7`     | Number of choices to display per page |

#### Choice Object

```typescript
interface Choice<T = any> {
  name?: string;        // Display name (defaults to value)
  value: T;            // The actual value returned
  description?: string; // Help text shown on selection
  short?: string;      // Abbreviated name for final answer
  checked?: boolean;   // Pre-selected state
  disabled?: boolean;  // Cannot be selected
  order?: number;      // Initial order (for pre-selected items)
}
```

#### Validation Function

```typescript
type ValidateFunction<T> = (
  choices: T[]
) => boolean | string | Promise<boolean | string>;
```

Return `true` for valid input, or a string error message for invalid input.

## Keyboard Controls

| Key     | Action           |
| ------- | ---------------- |
| `↑/↓`   | Navigate up/down |
| `Space` | Toggle selection |
| `Enter` | Submit answer    |
| `?`     | Toggle help      |

## Theming

Customize the appearance with a theme object:

```typescript
const customTheme = {
  icon: {
    cursor: '❯',
  },
  style: {
    disabledChoice: (text) => `🚫 ${text}`,
    description: (text) => `💡 ${text}`,
    selectedOrder: (text) => `🔥 ${text}`,
    unselectedOrder: (text) => `⭕ ${text}`,
    renderSelectedChoices: (choices) => 
      choices.map(c => `✨ ${c.name}`).join(', ')
  }
};

const answer = await orderedCheckbox({
  message: 'Select items:',
  choices: ['Option 1', 'Option 2', 'Option 3'],
  theme: customTheme
});
```

## TypeScript Support

This package includes full TypeScript definitions:

```typescript
import orderedCheckbox, { 
  CheckboxSortConfig, 
  NormalizedChoice,
  CheckboxSortTheme 
} from 'inquirer-ordered-checkbox';

interface MyValue {
  id: string;
  priority: number;
}

const config: CheckboxSortConfig<MyValue> = {
  message: 'Select tasks:',
  choices: [
    { 
      name: 'High priority task', 
      value: { id: 'task1', priority: 1 } 
    },
    { 
      name: 'Medium priority task', 
      value: { id: 'task2', priority: 2 } 
    }
  ]
};

const result: MyValue[] = await orderedCheckbox(config);
```

## Requirements

- Node.js >= 18
- ESM environment (import/export)

## Related

- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - A collection of common interactive command line user interfaces
- [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js/tree/main/packages/prompts) - Individual prompt packages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright © 2025 [Kyou Izumi](https://github.com/kyou-izumi)
Licensed under the MIT license.
