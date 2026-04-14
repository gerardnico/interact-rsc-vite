---
title: Grid Cells System based
---


Grid system are notoriously difficult (even in [tailwind](../reference/styling.md#tailwind))
due to size calculation with gutter.

This component brings the nice [grid system of boostrap](https://getbootstrap.com/docs/5.3/layout/grid/)
adapted to TailWind.

## Example

### Grid with equal size by cells

A grid of:

* 1 cell in a `row` in mobile
* 2 cells in a row from the `sm` breakpoint
* 3 cells in a row from the `md` breakpoint

````markdown
<Grid class="cells-row-1 sm:cells-row-2 md:cells-row-3 text-center">
    <GridCell>
        Cell 1
    </GridCell>
    <GridCell>
        Cell 2
    </GridCell>
    <GridCell>
        Cell 3
    </GridCell>
    <GridCell>
        Cell 4
    </GridCell>
</Grid>
````

<Grid class="cells-row-1 sm:cells-row-2 md:cells-row-3 text-center">
  <GridCell>
      Cell 1
  </GridCell>
  <GridCell>
      Cell 2
  </GridCell>
  <GridCell>
      Cell 2
  </GridCell>
  <GridCell>
        Cell 4 is center justified by default
  </GridCell>
</Grid>

### Grid with different size by cells

A grid with a gutter of `12` where:

* the first row has:
  * 1 cell of 25% width (ie `3/12`)
  * 1 cell of 50% width (ie `6/12`)
  * 1 cell of 25% width (ie `3/12`)
* the second row has:
  * 1 cell of 50% width (ie `6/12`)

````markdown
<Grid class="text-center cells-gap-12">
    <GridCell class="cell-3">
        Cell 25%
    </GridCell>
    <GridCell class="cell-6">
        Cell 50%
    </GridCell>
    <GridCell class="cell-3">
        Cell 25%
    </GridCell>
    <GridCell class="cell-6">
        Cell 50%
    </GridCell>
</Grid>
````

<Grid class="text-center cells-gap-12">
    <GridCell class="cell-3">
        Cell 25%
    </GridCell>
    <GridCell class="cell-6">
        Cell 50%
    </GridCell>
    <GridCell class="cell-3">
        Cell 25%
    </GridCell>
    <GridCell class="cell-6">
        Cell 50%
    </GridCell>
</Grid>

## Syntax/Features

### Cell Width

You may define the width of a cells by setting:

* the maximum of cells in a row with the `cells-row-n` class on the `Grid` element where `n` is a number from `1` to `6`
  where:
  * `cells-row-1`: 1 cell by row
  * `cells-row-6`: 6 cells by row
* the width of a cell with the `cell-n` class on the `GridCell` element where `n` defines the width of a cell on a scale
  from `1` to
  `12` where:
  * `cell-12` taking all units being 100%
  * `cell-1` taking only 1/12 of 100%

### Gutter / Gap

The gutter is the space between rows and columns, not the space outside the grid.

You can set the gutter on the `Grid` element with the following class utilities where `n` is a number:

* `cells-gap-n`: for horizontal and vertical gutter
* `cells-gap-x-n`: for horizontal gutter
* `cells-gap-y-n`: for vertical gutter

In the bootstrap system, the gutter is created with the margin so that it does not interfere with the width calculation.

### Default: Center justified and Gap

By default:
* the grid has:
  * cells justified in the center (`justify-center`)
  * a gap of 10 (`cells-gap-10`)
* the grid cells are center justified (`flex justify-center`)

You can change this behavior by setting any other class:

* [tailwind justify class](../reference/styling.md#tailwind))
* and [cells gap](#gutter--gap)

## Markdown Support

This component is [registered as a Markdown component](../howto/add-a-markdown-component.md#register-it) and can be used
in [markdown pages](../reference/markdown.md).
