
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";

interface GridLocation {
	row: number;
	column: number;
}

export interface GridSelectionEvent {
	letters: string[];
	selection: GridSelection;
}

export interface GridSelectionMapFunction {
	( row: number, column: number ) : any;
}

@Component({
	selector: "re-grid",
	inputs: [ "letters", "selections" ],
	outputs: [ "selectionEvent: selection" ],
	host: {
		"(document: mouseup)": "endSelection()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./grid.component.css" ],
	templateUrl: "./grid.component.htm"
})
export class GridComponent {

	public letters: string[][];
	public selectionEvent: EventEmitter<GridSelectionEvent>;
	public selections: GridSelection[];

	private pendingSelection: GridSelection;


	// I initialize the grid component.
	constructor() {

		this.letters = [];
		this.selections = [];
		this.selectionEvent = new EventEmitter();
		this.pendingSelection = null;

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I handle the end of the selection gesture, possibly emitting a new selection if 
	// the current selection does not conflict with selections that have already been
	// placed on the grid.
	public endSelection() : void {

		if ( ! this.pendingSelection ) {

			return;

		}

		// Check to see if the current selection is wholly contained (ie, subsumed) by
		// any of the existing selections.
		var isSubsumed = this.selections.some(
			( selection: GridSelection ) : boolean => {

				return( this.pendingSelection.isSubsumedBy( selection ) );

			}
		);

		// Only emit a selection event if the selection is new.
		if ( ! isSubsumed ) {

			var selectedLetters = this.pendingSelection.map<string>(
				( row: number, column: number ) : string => {

					return( this.letters[ row ][ column ] );

				}
			);

			this.selectionEvent.emit({
				letters: selectedLetters,
				selection: this.pendingSelection
			});

		}

		this.pendingSelection = null;

	}


	// I check to see if the given grid coordinates are part of a pending selection.
	public isPending( row: number, column: number ) : boolean {

		if ( ! this.pendingSelection ) {

			return( false );

		}

		return( this.pendingSelection.includes({ row, column }) );

	}


	// I check to see if the given grid coordinates are part of an existing selection.
	public isSelected( row: number, column: number ) : boolean {

		var result = this.selections.some(
			( selection: GridSelection ) : boolean => {

				return( selection.includes({ row, column }) );

			}
		);

		return( result );

	}


	// I start a new pending selection on the grid.
	public startSelection( row: number, column: number ) : void {

		this.pendingSelection = new GridSelection({ row, column });

	}


	// I update the pending selection using the given grid coordinates.
	public updateSelection( row: number, column: number ) : void {

		if ( ! this.pendingSelection ) {

			return;

		}

		this.pendingSelection.update({ row, column });

	}

}


export class GridSelection {

	private from: GridLocation;
	private to: GridLocation;

	// I initialize the grid location with the given starting location.
	constructor( start: GridLocation ) {

		this.setFrom( start );

	}


	// ---
	// PUBLIC METHODS.
	// ---


	// I check to see if the given grid location is contained within the selection.
	public includes( location: GridLocation ) : boolean {

		var isFound = this.gatherLocations().some(
			( selectionLocation: GridLocation ) : boolean => {

				return(
					( location.row === selectionLocation.row ) &&
					( location.column === selectionLocation.column )
				);

			}
		);

		return( isFound );

	}


	// I check to see if the current selection completely subsumes the given selection.
	public isSubsumedBy( selection: GridSelection ) : boolean {

		var isConflict = this.gatherLocations().every(
			( location: GridLocation ) : boolean => {

				return( selection.includes( location ) );

			}
		);

		return( isConflict );

	}


	// I map the selected grid location using the given callback / operator.
	public map<T>( callback: GridSelectionMapFunction ) : T[] {

		var result = this.gatherLocations().map(
			( location: GridLocation ) : T => {

				return( callback( location.row, location.column ) );

			}
		);

		return( result );

	}


	// I update the selection using the (TO) grid location. 
	// --
	// CAUTION: This uses a very strict diagonal selection since using a fuzzy diagonal
	// runs the risk of moving off the grid and the selection is not aware of the grid
	// dimensions. We could probably rework the selection to either know about the gird;
	// or, move the selection logic into the grid. But, ... meh.
	public update( newTo: GridLocation ) : void {

		var deltaRow = Math.abs( newTo.row - this.from.row );
		var deltaColumn = Math.abs( newTo.column - this.from.column );
		var maxDelta = Math.max( deltaRow, deltaColumn );

		// Use the diagonal selection.
		if ( deltaRow === deltaColumn ) {

			this.setTo( newTo );

		// Force to be vertical selection.
		} else if ( deltaRow > deltaColumn ) {

			this.setTo({
				row: newTo.row,
				column: this.from.column
			});

		// Force to be horizontal selection.
		} else {

			this.setTo({
				row: this.from.row,
				column: newTo.column
			});

		}

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I gather all the concrete grid locations between the FROM and TO locations.
	private gatherLocations() : GridLocation[] {

		var count = Math.max(
			( Math.abs( this.to.row - this.from.row ) + 1 ),
			( Math.abs( this.to.column - this.from.column ) + 1 )
		);

		var rowIncrement = this.getIncrement( this.from.row, this.to.row );
		var columnIncrement = this.getIncrement( this.from.column, this.to.column );
		var iRow = this.from.row;
		var iColumn = this.from.column;

		var locations = [];

		for ( var i = 0 ; i < count ; i++ ) {

			locations.push({
				row: iRow,
				column: iColumn
			});

			iRow += rowIncrement;
			iColumn += columnIncrement;

		}

		return( locations );

	}


	// I get the increment [-1, 0, 1] that can be used to loop over the given range.
	private getIncrement( fromValue: number, toValue: number ) : number {

		if ( fromValue < toValue ) {

			return( 1 );

		} else if ( fromValue > toValue ) {

			return( -1 );

		} else {

			return( 0 );

		}

	}


	// I set the starting location of the selection.
	private setFrom( from: GridLocation ) : void {

		this.from = this.to = Object.assign( {}, from );

	}


	// I set the ending location of the selection.
	private setTo( to: GridLocation ) : void {

		if ( 
			// Not horizontal.
			( this.from.row !== to.row ) &&

			// Not vertical.
			( this.from.column !== to.column ) && 

			// Not diagonal.
			( Math.abs( to.row - this.from.row ) !== Math.abs( to.column - this.from.column ) )
			) {

			throw( new Error( "InvalidSelection" ) );

		}

		this.to = Object.assign( {}, to );
		
	}

}
