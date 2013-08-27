////////////////
//  syncr js  //
////////////////

var syncr = {

	///////////////
	// variables //
	///////////////

	// contain the number of the new list being made
	newListNumber: '',
	// contains the number of lists in the app
	numberOfLists: '',
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


	///////////////////////////////
	//  list-specific functions  //
	///////////////////////////////

	// change the list the user is viewing
	changeLists: function ( newList ) {

		// make the list the user selects the active list, and hide the rest of the list titles
		$( '#pickList-' + newList )
			.addClass( 'active' )
			.siblings().addClass( 'hide' );
		$( '.created-lists' )
			.addClass( 'closed' )
			.removeClass( 'opened' );

		// show the items of the list the user is opening
		$( '#list-' + newList )
			.removeClass( 'hide' )
			.addClass( 'active' );
	},

	// clear all the items of the current list
	clearList: function () {

		// ask the user if they're sure they want to delete all their list items
		var confirmClearList = confirm( 'Are you sure you want to delete all the items from this list?' );

		// if they do...
		if ( confirmClearList === true ) {

			// clear out all their list items
			$( '.list.active' )
				.html( '<li class="add-new-item">+ New item</li>' );

			// and close the menu
			syncr.closeMenu();
		}

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

	// delete the current list
	deleteList: function () {

		// ask the user if they're sure they want to delete the current list
		var confirmDeleteList = confirm( 'Are you sure you want to delete this list?' );

		// if they do...
		if ( confirmDeleteList === true ) {

			// delete the current list
			$( '.list.active' )
				.remove();

			// delete the current list title
			$( '.created-lists .active' )
				.remove();

			syncr.numberOfLists = $( '.created-lists li' ).length;

			// check to see if there are any lists left over
			if ( syncr.numberOfLists > 0 ) {

				// if there are, view the fist one
				$( '.created-lists li:first-child' )
					.addClass( 'active' )
					.removeClass( 'hide' );
				$( '.list' )
					.first()
					.addClass( 'active' )
					.removeClass( 'hide' );

			} else {

				// if there are not, make a new default one
				$( '.created-lists ol' )
					.html( '<li class="active" id="pickList-1">List 1</li>' );
				$( '<ol class="list active" id="list-1">' +
						'<li class="add-new-item">+ New item</li>' +
					'</ol>' )
					.insertBefore( '.close-menu' );

			}
		}

	},

	// opens the list of lists
	openLists: function () {

		// show all the lists available
		$( '.created-lists' )
			.addClass( 'opened' )
			.removeClass( 'closed' );
		$( '.created-lists li' ).removeClass( 'hide active' );

		// hide the items from the list the user was just viewing
		$( '.list' )
			.removeClass( 'active' )
			.addClass( 'hide' );

		// when the user selects a list to open...
		$( 'header' ).on( 'click', '.opened li', function () {
			// get the list the user clicks on
			syncr.currentList = $( this ).attr( 'id' ).substr( 9 );
			// and send it to the 'changeLists()' function
			syncr.changeLists( syncr.currentList );
		});

	},

	// rename the current list
	renameList: function () {

		syncr.currentList = $( '.created-lists .active' ).text();
		var renameListName = prompt( 'What should this list be called now?', syncr.currentList );

		$( '.created-lists .active' ).text( renameListName );

		syncr.closeMenu();

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

	// rename the current list
	$( '#renameList' ).on( 'click', function () {
		syncr.renameList();
	});

	// clear all items of the current list
	$( '#clearList' ).on( 'click', function () {
		syncr.clearList();
	});

	// delete the current list
	$( '#deleteList' ).on( 'click', function () {
		syncr.deleteList();
	});


	////////////////////////////
	//  list-specific events  //
	////////////////////////////

	// open up the 'list of lists' when the active list title is clicked
	$( 'header' ).on( 'click', '.closed li.active', function () {
		syncr.openLists();
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
	$( '.list.active' ).on( 'click', '.add-new-item', function ( e ) {
		syncr.currentList = $( this ).parent().attr( 'id' );
		syncr.addItem( syncr.currentList );
	});

	// on keypress or blur of an input field...
	$( '.list' ).on( 'keypress blur', 'input', function ( e ) {
		// check to see if the user pressed 'enter', 'return',, 'esc', or focued out of the input.
		if ( e.which === 13 || e.which === 27 || e.type === 'blur' || e.type === 'focusout' ) {

			// make sure there's a value
			if ( $( '.editableItem' ).val() !== '' ) {

				// if so, remove the input field and set the value in a normal list item
				$( '.item-editing' )
					.html( $( '.editableItem' ).val().replace(/\s{2,}/g, ' ').trim() )
					.removeClass( 'item-editing' );

			} else {

				// or else just remove the new blank item
				$( '.item-editing' )
					.remove();

			}
		}
	});

});