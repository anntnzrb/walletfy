# Walletfy Test Coverage Setup

## How to Run Coverage

- **Bun:**  
  Run `bun run test:coverage` to generate a coverage report.

- **Vitest:**  
  Run `bun run test --coverage` or `vitest run --coverage` for coverage output.

## Coverage Output

- Coverage reports are generated in the `coverage/` directory.
- Supported formats: text, HTML, lcov.

## Recommendations

- Ensure all new tests are included in coverage.
- Review HTML report for uncovered lines and branches.
- Aim for >90% coverage on all critical business logic and UI flows.
