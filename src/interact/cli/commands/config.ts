import {Flags} from '@oclif/core'
import yaml from 'yaml'
import {BaseCommand} from "../baseCommand.js";
import {createInteractConfig} from "../../config/interactConfigHandler.js";



/**
 * Recursively filters an object by a key path
 * @param obj - The object to filter
 * @param filterKey - The key to filter by (supports nested paths like 'theme.colors')
 * @returns The filtered object or undefined if not found
 */
function filterByKey(obj: any, filterKey: string): any {
  if (!filterKey) return obj

  const keys = filterKey.split('.')
  let current = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Adds ANSI color codes to JSON string for pretty printing
 */
function colorizeJson(jsonString: string): string {
  const colors = {
    reset: '\x1b[0m',
    key: '\x1b[36m',      // Cyan
    string: '\x1b[32m',   // Green
    number: '\x1b[33m',   // Yellow
    boolean: '\x1b[35m',  // Magenta
    null: '\x1b[90m',     // Gray
  }

  return jsonString
    .replace(/("([^"\\]|\\.)*")(\s*:)/g, `${colors.key}$1${colors.reset}$3`) // Keys
    .replace(/:\s*"([^"\\]|\\.)*"/g, (match) => match.replace(/"([^"\\]|\\.)*"/, `${colors.string}"$1"${colors.reset}`)) // String values
    .replace(/:\s*(-?\d+\.?\d*)/g, `:\x1b[33m$1${colors.reset}`) // Numbers
    .replace(/:\s*(true|false)/g, `:\x1b[35m$1${colors.reset}`) // Booleans
    .replace(/:\s*null/g, `:\x1b[90mnull${colors.reset}`) // null
}

/**
 * Adds ANSI color codes to YAML string for pretty printing
 */
function colorizeYaml(yamlString: string): string {
  const colors = {
    reset: '\x1b[0m',
    key: '\x1b[36m',      // Cyan
    string: '\x1b[32m',   // Green
    number: '\x1b[33m',   // Yellow
    boolean: '\x1b[35m',  // Magenta
    null: '\x1b[90m',     // Gray
  }

  return yamlString
    .split('\n')
    .map(line => {
      // Key: value pairs
      if (line.match(/^(\s*)([^:]+):\s*(.+)$/)) {
        return line.replace(/^(\s*)([^:]+):\s*(.+)$/, (_, indent, key, value) => {
          let coloredValue = value
          // Color values based on type
          if (value.match(/^['"].*['"]$/)) {
            coloredValue = `${colors.string}${value}${colors.reset}`
          } else if (value.match(/^-?\d+\.?\d*$/)) {
            coloredValue = `${colors.number}${value}${colors.reset}`
          } else if (value.match(/^(true|false)$/)) {
            coloredValue = `${colors.boolean}${value}${colors.reset}`
          } else if (value.match(/^null$/)) {
            coloredValue = `${colors.null}${value}${colors.reset}`
          }

          return `${indent}${colors.key}${key}${colors.reset}: ${coloredValue}`
        })
      }

      // Keys without values (object headers)
      if (line.match(/^(\s*)([^:]+):$/)) {
        return line.replace(/^(\s*)([^:]+):$/, `$1${colors.key}$2${colors.reset}:`)
      }

      return line
    })
    .join('\n')
}

export default class Config extends BaseCommand<typeof Config> {
  static description = 'Print the interact configuration (YAML by default)'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --json',
    '<%= config.bin %> <%= command.id %> --filter theme.colors',
    '<%= config.bin %> <%= command.id %> --json --no-pretty',
  ]

  static flags = {
    filter: Flags.string({
      char: 'f',
      description: 'Filter configuration by key path (e.g., "theme.colors")',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'Output in JSON format',
      default: false,
    }),
    yaml: Flags.boolean({
      char: 'y',
      description: 'Output in YAML format (default)',
      default: false,
    }),
    'no-pretty': Flags.boolean({
      description: 'Disable colorized output',
      default: false,
    }),
    plain: Flags.boolean({
      description: 'Disable colorized output (alias for --no-pretty)',
      default: false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Config)

    // Determine format
    const format = flags.json ? 'json' : 'yaml'
    const pretty = !flags['no-pretty'] && !flags.plain

    let configToPrint = createInteractConfig(flags.confPath);
    if (flags.filter) {
      const filtered = filterByKey(configToPrint, flags.filter)
      if (filtered === undefined) {
        this.error(`Key '${flags.filter}' not found in configuration`)
      }
      configToPrint = filtered
    }

    try {
      let output: string

      if (format === 'json') {
        // JSON output
        output = JSON.stringify(configToPrint, null, 2)
        if (pretty) {
          output = colorizeJson(output)
        }
      } else {
        // YAML output (default)
        output = yaml.stringify(configToPrint)
        if (pretty) {
          output = colorizeYaml(output)
        }
      }

      this.log(output)
    } catch (error) {
      this.error('Error printing configuration: ' + error)
    }
  }
}
