---
title: Grid System
---


Grid system are notoriously difficult (even in [tailwind](../reference/styling.md#tailwind)).

This component brings the nice [grid system of boostrap](https://getbootstrap.com/docs/5.3/layout/grid/)
adapted to TailWind.

## Example

### Grid with equal size by cells

A grid of:

* 1 cell in a `row` in mobile
* 2 cells in a row from the `sm` breakpoint
* 3 cells in a row from the `md` breakpoint

````jsx
<Grid class="row-cols-1 sm:row-cols-2 md:row-cols-3">
    <GridCell>
        Cell
    </GridCell>
    <GridCell>
        Cell
    </GridCell>
    <GridCell>
        Cell
    </GridCell>
</Grid>
````

<Grid class="row-cols-1 sm:row-cols-2 md:row-cols-3">
  <GridCell>
      Cell 1
  </GridCell>
  <GridCell>
      Cell 2
  </GridCell>
  <GridCell>
      Cell 2
  </GridCell>
</Grid>

## Syntax

* `Grid` wraps a `row` class name and accepts:
  * `row-cols-x` class to define the number of cells in a row
* `GridCell` wraps a `col` class name and accepts:
  * `col-x` class to define the size of a cell on a scale from `1` to `12`
