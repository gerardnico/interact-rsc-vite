---
title: Grid System
---


Grid system are notoriously difficult (even in [tailwind](../reference/styling.md#tailwind)).
This component brings the nice [grid system of boostrap](https://getbootstrap.com/docs/5.3/layout/grid/) over.

## Example

````jsx
<Grid maxRowCells="1 sm:2 md:3">
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

<Grid maxRowCells="1 sm:2 md:3">
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

## Syntax

* `Grid` wraps a `row` and accepts a `maxRowCells` attribute to set the maximum number of cells in a row. 
* `GridCell` wraps a `col`