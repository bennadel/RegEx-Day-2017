
// Import the core angular services.
import { Component } from "@angular/core";
import _ = require( "lodash" );

// Import the application services.
import { GridSelection } from "./grid.component";
import { GridSelectionEvent } from "./grid.component";

interface Game {
	letters: string[][];
	words: string[];
	patterns: RegExp[];
}

interface GameItem {
	word: string;
	pattern: RegExp;
	selection: GridSelection;
}

@Component({
	selector: "my-app",
	styleUrls: [ "./app.component.css" ],
	template: 
	`
		<re-grid 
			[letters]="letters"
			[selections]="selections"
			(selection)="handleSelection( $event )">
		</re-grid>

		<ul>
			<li *ngFor="let item of items" [class.found]="item.selection">
				
				<strong>{{ item.pattern.source }}</strong>

				<span *ngIf="item.selection" (click)="removeSelection( item )" class="remove">
					Remove
				</span>

			</li>
		</ul>
	`
})
export class AppComponent {

	public items: GameItem[];
	public letters: string[][];
	public selections: GridSelection[];


	// I initialize the app component.
	constructor() {

		var game = this.getGame();

		this.letters = game.letters;
		this.selections = [];

		this.items = game.words.map(
			function( word: string, i: number ) : GameItem {

				return({
					word: word,
					pattern: game.patterns[ i ],
					selection: null
				});

			}
		);

	}


	// I check to see if game has been won. And, if so, alerts the user.
	public checkStatus() : void {

		// The game is considered complete / won if every item is associated with a 
		// selection on the grid.
		var isWinner = this.items.every(
			( item: GameItem ) : boolean => {

				return( !! item.selection );

			}
		);

		if ( isWinner ) {

			setTimeout(
				function() {

					alert( "Noice! Way to RegExp like a boss!" );
					
				},
				500
			);

		}

	}


	// I handle the selection event from the grid.
	public handleSelection( event: GridSelectionEvent ) : void {

		// Since words may be placed on the grid in any direction, we have to check 
		// the given selection using both the forwards and reversed letters.
		var selectedLetters = event.letters.join( "" ).toLowerCase();
		var selectedLettersInverse = event.letters.reverse().join( "" ).toLowerCase(); // CAUTION: In-place reverse.

		// Check the selection against the game configuration.
		for ( var item of this.items ) {

			if ( item.selection ) {

				continue;

			}

			if ( 
				( item.word === selectedLetters ) || 
				( item.word === selectedLettersInverse ) 
				) {

				this.selections.push( item.selection = event.selection );
				this.checkStatus();
				return;

			}

		}

	}


	// I remove the selection associated with the given item.
	public removeSelection( item: GameItem ) : void {

		this.selections = _.without( this.selections, item.selection );
		item.selection = null;

	}


	// ---
	// PRIVATE METHODS.
	// ---


	// I return a random game configuration.
	private getGame() : Game {

		// The various board configurations have been generated using the following list 
		// of words. And, we know that these words map to specific Regular Expression 
		// patterns (which is what we'll display to the user).
		var patternsMap = {
			"programmer": /program+er/,
			"javascript": /.{4}script/,
			"oop": /..p/,
			"function": /f.{4}ion/,
			"closure": /clos.*?e/,
			"ecmascript": /emca.+?t/,
			"noop": /n(.)\1p/,
			"array": /(a)(r)\2\1y/,
			"lexical": /(.)exica\1/,
			"prototype": /pr(ot)+?ype/,
			"constructor": /con.{5}tor/,
			"boolean": /.oo.ean/,
			"truthy": /...thy/,
			"falsey": /false[aeiouy]/,
			"comment": /co(.)\1ent/,
			"variable": /var.{5}/,
			"method": /.etho./
		};

		var configurations = [
			{
				letters: [
					"XVFUNCTION".split( "" ),
					"TPIRCSAVAJ".split( "" ),
					"IYPLLXQYYC".split( "" ),
					"LAOHORKEHO".split( "" ),
					"AROHSMUSTM".split( "" ),
					"CRNMUQYLUM".split( "" ),
					"IAOORFEARE".split( "" ),
					"XSOYEYKFTN".split( "" ),
					"EKPDOHTEMT".split( "" ),
					"LEPYTOTORP".split( "" )
				],
				words: [ "array", "closure", "comment", "falsey", "function", "javascript", "lexical", "method", "noop", "oop", "prototype", "truthy" ]
			},
			{
				letters: [
					"DTRNAELOOB".split( "" ),
					"DPEHOYTYRZ".split( "" ),
					"OIMCVNREPP".split( "" ),
					"HRMEAOUSDO".split( "" ),
					"TCARRITLTO".split( "" ),
					"ESRUITHANN".split( "" ),
					"MAGSACYFNS".split( "" ),
					"YVOOBNGHPF".split( "" ),
					"ZARLLUZOAE".split( "" ),
					"UJPCEFOFWP".split( "" )
				],
				words: [ "array", "boolean", "closure", "falsey", "function", "javascript", "method", "noop", "oop", "programmer", "truthy", "variable" ]
			},
			{
				letters: [
					"EEFUNCTION".split( "" ),
					"BLUSMETHOD".split( "" ),
					"HIBNAELOOB".split( "" ),
					"SWPAIAAPEY".split( "" ),
					"XLEXICALRH".split( "" ),
					"ARRAYRYXUT".split( "" ),
					"PJYESLAFSU".split( "" ),
					"WSGPOONVOR".split( "" ),
					"YGPMSPOOLT".split( "" ),
					"ZJTNEMMOCA".split( "" )
				],
				words: [ "array", "boolean", "closure", "comment", "falsey", "function", "lexical", "method", "noop", "oop", "truthy", "variable" ]
			}
		];

		var selectedConfig = this.getRandom( configurations );

		return({
			letters: selectedConfig.letters,
			words: selectedConfig.words,

			// Once we've selected the random game configuration, we have to generate the
			// patterns collection based on the words collection. After all, we want the 
			// users to have to work backwards a bit (from pattern to word to selection).
			patterns: selectedConfig.words.map(
				( word: string ) : RegExp => {

					return( patternsMap[ word ] );

				}
			)
		});

	}


	// I get a random item from the given collection.
	private getRandom<T>( collection: T[] ) : T {

		var randomIndex = _.random( collection.length - 1 );

		return( collection[ randomIndex ] );

	}

}
