////////////////
//  syncr js  //
////////////////

var syncr = {

	///////////////
	// variables //
	///////////////

	// contain the number of the new list being made
	newListNumber: '',
	// get the number of items in the current list
	numberOfListItems: '',
	// current list the user is interacting with
	currentList: '',
	// current item the user is interacting with
	currentItem: '',
	// store touch coordinates & info
	touchDown: '',
	touchUp: '',
	touchDifference: '',
	touchType: '',
	touchDirection: '',


	///////////////////////////
	//  menu-view functions  //
	///////////////////////////

	// open the menu
	openMenu: function () {
		window.location.hash = '#menuView';
		$( '.menu-icon a' )
			.toggleClass( 'closed opened' );
		$( '.close-menu' )
			.css( 'display', 'block' );
	},

	// close the menu
	closeMenu: function () {
		window.location.hash = '#';
		$( '.menu-icon a' )
			.toggleClass( 'closed opened' );
		$( '.close-menu' )
			.hide();
	},

	createList: function () {

		// set var to be what number the new list will be
		syncr.newListNumber = $( '.list' ).length + 1;

		var newListName = prompt( 'What should this new list be called?', 'List ' + syncr.newListNumber );

		$( '.active' )
			.toggleClass( 'active hide' );

		$( '.created-lists ol' )
			.append( '<li class="active" id="pickList-' + syncr.newListNumber + '">' + newListName + '</li>' );

		$( '<ol class="list active" id="list-' + syncr.newListNumber + '">' +
				'<li class="add-new-item">+ New item</li>' +
			'</ol>' )
			.insertBefore( '.close-menu' );

		syncr.closeMenu();

	},


	///////////////////////////////
	//  list-specific functions  //
	///////////////////////////////

	// change the list the user is viewing
	changeLists: function () {

		$( '.created-lists' ).toggleClass( 'closed opened' );
		$( '.created-lists li' ).removeClass( 'hide active' );

		$( '.list' )
			.removeClass( 'active' )
			.addClass( 'hide' );

		$( '.created-lists ol' ).on( 'click', 'li', function ( e ) {

			syncr.currentList = $( this ).attr( 'id' ).substr( 9 );

			$( '#pickList-' + syncr.currentList )
				.addClass( 'active' )
				.siblings().addClass( 'hide' );

			$( '.created-lists' ).toggleClass( 'closed opened' );

			$( '#list-' + syncr.currentList )
				.removeClass( 'hide' )
				.addClass( 'active' );

		});

		e.preventDefault();
	},

	// rename the current list
	renameList: function () {

	},


	///////////////////////////////
	//  item-specific functions  //
	///////////////////////////////

	// add new item
	addItem: function ( currentList ) {
		// set var to be the number of items in the current list
		syncr.numberOfListItems = $( '#' + currentList ).children().length;

		// add a new list item with an input field to enter a enw item into it
		$( '<li class="item-editing item-' +  syncr.numberOfListItems + '"><input class="editableItem" type="text" placeholder="Type new item here" autofocus /></li>' )
			.insertBefore( '#' + currentList + ' li:last' );
	},

	// edit existing item
	editItem: function ( currentItem ) {
		$( currentItem )
			.replaceWith( '<li class="item-editing ' +  $( currentItem ).attr( 'class' ) + '"><input class="editableItem" type="text" value="' + $( currentItem ).text() + '" autofocus /></li>' );
	}

};


$( document ).ready ( function () {

	////////////////////////
	//  menu-view events  //
	////////////////////////

	// open the menu when clicking on the menu icon
	$( '.menu-icon a' ).on( 'click', function () {
		syncr.openMenu();
	});

	// close the menu when clicking on the list view
	$( '.close-menu' ).on( 'click', function () {
		syncr.closeMenu();
	});

	// when clicking on the 'create' button...
	$( '#createList' ).on( 'click', function () {
		syncr.createList();
	});


	////////////////////////////
	//  list-specific events  //
	////////////////////////////

	// open up the 'list of lists' when the active list title is clicked
	$( '.created-lists ol' ).on( 'click', 'li.active', function () {
		syncr.changeLists();
	});


	////////////////////////////
	//  item-specific events  //
	////////////////////////////

	// when touching a list item...
	$( '.list' ).on( 'touchstart mousedown', '[class*="item-"]', function ( e ) {

		// capture the coordinates of the first touch
		syncr.touchDown = e.clientX;
		
		// when finished touching...
		$( '.list' ).on( 'touchend mouseup', '[class*="item-"]', function ( e ) {
			// capture the coordinates of the first touch
			syncr.touchUp = e.clientX;
			syncr.touchDifference = Math.abs( syncr.touchDown - syncr.touchUp );

			// capture the list item the user is touching
			syncr.currentItem = '#' + $( this ).parent().attr( 'id' ) + ' .' + $( this ).attr( 'class' );

			// check to see if the touch is a tap (click) or a swipe (drag), and what direction (if any) it's going
			if ( syncr.touchDown > syncr.touchUp && syncr.touchDifference >= 20 ) {
				// user is swiping to the right
				syncr.touchDirection = 'right';
				syncr.touchType = 'swipe';

				console.log( 'swipe right' );

			} else if ( syncr.touchDown < syncr.touchUp && syncr.touchDifference >= 20 ) {
				// user is swiping to the left
				syncr.touchDirection = 'left';
				syncr.touchType = 'swipe';

				console.log( 'swipe left' );

			} else {
				// user is tapping, so edit the item
				syncr.touchDirection = 'none';
				syncr.touchType = 'tap';

				// edit the list item
				syncr.editItem( syncr.currentItem );
			}

		});

	});

	// add a new item when clicking on the 'new item' item
	$( '.add-new-item' ).on( 'click', function ( e ) {
		syncr.currentList = $( this ).parent().attr( 'id' );
		syncr.addItem( syncr.currentList );
	});

	// on keypress or blur of an input field...
	$( '.list' ).on( 'keypress blur', 'input', function ( e ) {
		// check to see if the user pressed 'enter', 'return', or focued out of the input.
		if ( e.which === 13 || e.type === 'blur' || e.type === 'focusout') {

			// if so, remove the input field and set the value in a normal list item
			$( '.item-editing' )
				.html( $( '.editableItem' ).val().replace(/\s{2,}/g, ' ').trim() )
				.removeClass( 'item-editing' );
		}
	});

});